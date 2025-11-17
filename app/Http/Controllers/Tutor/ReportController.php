<?php

namespace App\Http\Controllers\Tutor;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\TestResult;
use App\Models\Test;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Generar vista del reporte general para un estudiante
     */
    public function showGeneralReport(Request $request, $studentId)
    {
        $tutor = $request->user();
        
        // Obtener el estudiante
        $student = User::where('id', $studentId)
            ->where('tipo', 'estudiante')
            ->with(['group'])
            ->firstOrFail();

        // Verificar que el tutor tiene acceso al estudiante
        $tutorHasAccess = $tutor->tutorGroups()
            ->where('group_id', $student->group_id)
            ->where('semestre', $student->semestre)
            ->exists();

        if (!$tutorHasAccess) {
            abort(403, 'No tienes acceso a este estudiante.');
        }

        // Obtener los IDs de los tests principales
        $testAprendizaje = Test::where('tipo', Test::TYPE_VAK)->first();
        $testEmocional = Test::where('tipo', Test::TYPE_IE)->first();
        $testHabilidades = Test::where('tipo', Test::TYPE_SOFT_SKILLS)->first();

        // Obtener todos los resultados del estudiante
        $testResults = TestResult::where('estudiante_id', $studentId)
            ->with(['test'])
            ->whereIn('test_id', [
                $testAprendizaje?->id,
                $testEmocional?->id,
                $testHabilidades?->id,
            ])
            ->get();

        // Formatear los resultados
        $formattedResults = $testResults->map(function($result) {
            $resultadoData = is_string($result->resultado_json) 
                ? json_decode($result->resultado_json, true) 
                : $result->resultado_json;

            // ✅ FIX: Calcular total de respuestas correctamente
            $totalRespuestas = $resultadoData['total_respuestas'] ?? null;
            
            if (!$totalRespuestas) {
                // Primero intentar contar desde la relación questions
                $totalRespuestas = $result->test->questions()->count();
                
                // Si no hay preguntas registradas, usar valor por defecto
                if ($totalRespuestas === 0) {
                    $totalRespuestas = $this->getDefaultQuestionCount($result->test->tipo);
                }
            }

            return [
                'test_id' => $result->test_id,
                'test_tipo' => $result->test->tipo,
                'test_nombre' => $result->test->nombre,
                'fecha' => $result->fecha_realizacion->format('Y-m-d'),
                'puntuacion' => $result->puntuacion_total,
                'data' => $this->formatTestData($result->test->tipo, $resultadoData),
                'porcentajes' => $resultadoData['porcentajes'] ?? null,
                'estilo_dominante' => $resultadoData['estilo_dominante'] ?? null,
                'recomendaciones' => $result->recomendaciones,
                'dato_curioso' => $result->dato_curioso,
                'total_respuestas' => $totalRespuestas,
            ];
        });

        // Preparar datos del estudiante
        $studentData = [
            'id' => $student->id,
            'numero_control' => $student->numero_control,
            'nombre_completo' => trim("{$student->nombre} {$student->apellido_paterno} {$student->apellido_materno}"),
            'email' => $student->email,
            'grupo' => $student->group->nombre ?? 'Sin grupo',
            'semestre' => $student->semestre,
            'foto_perfil_url' => $student->foto_perfil_url,
        ];

        return Inertia::render('Tutor/Reports/GeneralReport', [
            'student' => $studentData,
            'testResults' => $formattedResults,
        ]);
    }

    /**
     * ✅ NUEVO: Obtener número de preguntas por defecto según tipo de test
     */
    private function getDefaultQuestionCount($testTipo)
    {
        $defaults = [
            'estilos_aprendizaje' => 10,
            'learning-styles' => 10,
            'inteligencia_emocional' => 10,
            'emotional-intelligence' => 10,
            'habilidades_blandas' => 10,
            'soft-skills' => 10,
            'asistencia_psicologica' => 10,
            'psychological-assistance' => 10,
        ];

        return $defaults[$testTipo] ?? 10; // Por defecto 10 preguntas
    }

    /**
     * Formatear datos del test según el tipo
     */
    private function formatTestData($testTipo, $resultadoData)
    {
        $data = [];

        if ($testTipo === Test::TYPE_VAK || $testTipo === 'learning-styles') {
            // Estilos de Aprendizaje
            $estilos = $resultadoData['estilos'] ?? $resultadoData ?? [];
            foreach ($estilos as $estilo => $count) {
                $data[$estilo] = is_numeric($count) ? (int)$count : 0;
            }
        } 
        elseif ($testTipo === Test::TYPE_IE || $testTipo === 'emotional-intelligence') {
            // Inteligencia Emocional
            if (isset($resultadoData['por_categoria'])) {
                foreach ($resultadoData['por_categoria'] as $categoria => $value) {
                    if (is_numeric($value)) {
                        $data[$categoria] = round((float)$value, 2);
                    } elseif (is_array($value)) {
                        $puntuacion = $value['sumaPonderada'] ?? $value['suma'] ?? 0;
                        $data[$categoria] = round((float)$puntuacion, 2);
                    }
                }
            }
        }
        elseif ($testTipo === Test::TYPE_SOFT_SKILLS || $testTipo === 'soft-skills') {
            // Habilidades Blandas
            if (isset($resultadoData['por_categoria'])) {
                foreach ($resultadoData['por_categoria'] as $categoria => $value) {
                    if (is_numeric($value)) {
                        $data[$categoria] = round((float)$value, 2);
                    } elseif (is_array($value)) {
                        $puntuacion = $value['sumaPonderada'] ?? $value['suma'] ?? 0;
                        $data[$categoria] = round((float)$puntuacion, 2);
                    }
                }
            }
        }

        return $data;
    }
}