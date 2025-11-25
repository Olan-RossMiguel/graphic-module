<?php

namespace App\Http\Controllers\Psychologist;

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
     * PARA PSICÓLOGOS - Incluye el test de Asistencia Psicológica
     */
    public function showGeneralReport(Request $request, $studentId)
    {
        $psychologist = $request->user();
        
       

        // Obtener el estudiante
        $student = User::where('id', $studentId)
            ->where('tipo', 'estudiante')
            ->with(['group'])
            ->firstOrFail();

        // Obtener los IDs de los 4 tests (los 3 del tutor + Asistencia Psicológica)
        $testAprendizaje = Test::where('tipo', Test::TYPE_VAK)->first();
        $testEmocional = Test::where('tipo', Test::TYPE_IE)->first();
        $testHabilidades = Test::where('tipo', Test::TYPE_SOFT_SKILLS)->first();
        $testAsistencia = Test::where('nombre', 'Asistencia Psicológica')->first();

        // Obtener todos los resultados del estudiante
        $testResults = TestResult::where('estudiante_id', $studentId)
            ->with(['test'])
            ->whereIn('test_id', array_filter([
                $testAprendizaje?->id,
                $testEmocional?->id,
                $testHabilidades?->id,
                $testAsistencia?->id,
            ]))
            ->get();

        // Formatear los resultados
        $formattedResults = $testResults->map(function($result) {
            $resultadoData = is_string($result->resultado_json) 
                ? json_decode($result->resultado_json, true) 
                : $result->resultado_json;

            // Calcular total de respuestas correctamente
            $totalRespuestas = $resultadoData['total_respuestas'] ?? null;
            
            if (!$totalRespuestas) {
                $totalRespuestas = $result->test->questions()->count();
                
                if ($totalRespuestas === 0) {
                    $totalRespuestas = $this->getDefaultQuestionCount($result->test->tipo);
                }
            }

            $formatted = [
                'test_id' => $result->test_id,
                'test_tipo' => $result->test->tipo,
                'test_nombre' => $result->test->nombre,
                'fecha' => $result->fecha_realizacion->format('Y-m-d'),
                'puntuacion' => $result->puntuacion_total,
                'data' => $this->formatTestData($result->test->tipo, $result->test->nombre, $resultadoData),
                'porcentajes' => $resultadoData['porcentajes'] ?? null,
                'estilo_dominante' => $resultadoData['estilo_dominante'] ?? null,
                'recomendaciones' => $result->recomendaciones,
                'dato_curioso' => $result->dato_curioso,
                'total_respuestas' => $totalRespuestas,
            ];

            // Si es el test de Asistencia Psicológica, agregar datos adicionales
            if ($result->test->nombre === 'Asistencia Psicológica') {
                $formatted['respuestas'] = $this->getIndividualAnswers($result);
                $formatted['nivel'] = $resultadoData['nivel'] ?? null;
                $formatted['por_categoria'] = $resultadoData['por_categoria'] ?? null;
            }

            return $formatted;
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
            'group_id' => $student->group_id,
        ];

        return Inertia::render('Psychologist/Reports/GeneralReport', [
            'student' => $studentData,
            'testResults' => $formattedResults,
        ]);
    }

    /**
     * Obtener respuestas individuales del test de Asistencia Psicológica
     */
    private function getIndividualAnswers($testResult)
    {
        $resultadoData = is_string($testResult->resultado_json) 
            ? json_decode($testResult->resultado_json, true) 
            : $testResult->resultado_json;

        return $resultadoData['respuestas'] ?? [];
    }

    /**
     * Obtener número de preguntas por defecto según tipo de test
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
            'asistencia_psicologica' => 15,
            'psychological-assistance' => 15,
        ];

        return $defaults[$testTipo] ?? 10;
    }

    /**
     * Formatear datos del test según el tipo
     */
    private function formatTestData($testTipo, $testNombre, $resultadoData)
    {
        $data = [];

        // Estilos de Aprendizaje
        if ($testTipo === Test::TYPE_VAK || $testTipo === 'learning-styles') {
            $estilos = $resultadoData['estilos'] ?? $resultadoData ?? [];
            foreach ($estilos as $estilo => $count) {
                $data[$estilo] = is_numeric($count) ? (int)$count : 0;
            }
        } 
        // Inteligencia Emocional
        elseif ($testTipo === Test::TYPE_IE || $testTipo === 'emotional-intelligence') {
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
        // Habilidades Blandas
        elseif ($testTipo === Test::TYPE_SOFT_SKILLS || $testTipo === 'soft-skills') {
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
        // Asistencia Psicológica
        elseif ($testNombre === 'Asistencia Psicológica') {
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