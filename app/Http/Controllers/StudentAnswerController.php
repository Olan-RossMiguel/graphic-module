<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\TestResult;
use App\Models\StudentAnswer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;


class StudentAnswerController extends Controller
{
    /**
     * Mostrar detalles de un estudiante específico con sus resultados de tests
     * PARA TUTORES - Vista Inertia con validación de acceso
     */
    public function showStudentForTutor(Request $request, $studentId)
    {
        $tutor = $request->user();

        // Obtener el estudiante
        $student = User::where('id', $studentId)
            ->where('tipo', 'estudiante')
            ->with(['group'])
            ->firstOrFail();

        // ✅ VALIDACIÓN: Verificar que el tutor tiene acceso
        $tutorHasAccess = $tutor->tutorGroups()
            ->where('group_id', $student->group_id)
            ->where('semestre', $student->semestre)
            ->exists();

        if (!$tutorHasAccess) {
            abort(403, 'No tienes acceso a este estudiante.');
        }

        // Obtener y formatear resultados
        $testResults = $this->formatTestResults($studentId);

        return Inertia::render('Tutor/Students/Show', [
            'student' => $this->formatStudentData($student),
            'testResults' => $testResults
        ]);
    }

    /**
     * Mostrar detalles de un estudiante específico con sus resultados de tests
     * PARA PSICÓLOGOS - Vista Inertia SIN validación de acceso (puede ver a todos)
     */
    public function showStudentForPsychologist(Request $request, $studentId)
    {
        // Obtener el estudiante
        $student = User::where('id', $studentId)
            ->where('tipo', 'estudiante')
            ->with(['group'])
            ->firstOrFail();

        // ✅ SIN VALIDACIÓN: El psicólogo puede ver cualquier estudiante

        // Obtener y formatear resultados
        $testResults = $this->formatTestResults($studentId);

        return Inertia::render('Psychologist/Students/Show', [
            'student' => $this->formatStudentData($student),
            'testResults' => $testResults
        ]);
    }

    /**
     * Método privado para formatear los resultados de tests
     * ♻️ REUTILIZABLE para tutor y psicólogo
     * ✅ MEJORADO: Ahora incluye datos formateados para gráficas
     */
    private function formatTestResults($studentId)
    {
        return TestResult::where('estudiante_id', $studentId)
            ->with(['test'])
            ->get()
            ->map(function ($result) {
                // Asegurar que resultado_json sea un array
                $resultadoData = is_string($result->resultado_json)
                    ? json_decode($result->resultado_json, true)
                    : $result->resultado_json;

                // ✅ CALCULAR total_respuestas si no existe
                $totalRespuestas = $resultadoData['total_respuestas'] ?? null;

                if (!$totalRespuestas) {
                    $totalRespuestas = $result->test->questions()->count();
                    if ($totalRespuestas === 0) {
                        $totalRespuestas = $this->getDefaultQuestionCount($result->test->tipo);
                    }
                }

                // Preparar la respuesta base
                $response = [
                    'id' => $result->id,
                    'test_id' => $result->test_id,
                    'test_tipo' => $result->test->tipo,
                    'test_nombre' => $result->test->nombre,
                    'fecha' => $result->fecha_realizacion,
                    'puntuacion' => $result->puntuacion_total,
                    'recomendaciones' => $result->recomendaciones,
                    'dato_curioso' => $result->dato_curioso,
                    'created_at' => $result->created_at,
                    'updated_at' => $result->updated_at,
                    'total_respuestas' => $totalRespuestas,
                ];

                // ✅ AGREGAR DATOS FORMATEADOS SEGÚN EL TIPO DE TEST
                if ($result->test->tipo === 'estilos_aprendizaje' || $result->test->tipo === 'learning-styles') {
                    $response['data'] = $this->formatLearningStylesData($resultadoData);
                    $response['porcentajes'] = $resultadoData['porcentajes'] ?? [];
                    $response['estilo_dominante'] = $resultadoData['estilo_dominante'] ?? null;
                    $response['interpretacion'] = $resultadoData['interpretacion'] ?? null;
                } elseif ($result->test->tipo === 'inteligencia_emocional' || $result->test->tipo === 'emotional-intelligence') {
                    $response['data'] = $this->formatEmotionalIntelligenceData($resultadoData);
                } elseif ($result->test->tipo === 'habilidades_blandas' || $result->test->tipo === 'soft-skills') {
                    $response['data'] = $this->formatSoftSkillsData($resultadoData);
                }
                // ✅ MEJORADO: Manejo específico del test de Asistencia Psicológica
                // Dentro de formatTestResults, en la sección de Asistencia Psicológica:
                elseif ($result->test->nombre === 'Asistencia Psicológica') {
                    $response['data'] = $this->formatPsychologicalAssistanceData($resultadoData);
                    $response['nivel'] = $resultadoData['nivel'] ?? null;
                    $response['por_categoria'] = $resultadoData['por_categoria'] ?? null;

                    // ✅ NUEVO: Obtener respuestas individuales
                    $response['respuestas'] = $this->getIndividualAnswers($result->id, $result->test_id);
                     Log::info('Response asistencia psicológica', [
        'has_respuestas' => isset($response['respuestas']),
        'respuestas_count' => count($response['respuestas'] ?? []),
    ]);
                } else {
                    // Formato genérico para otros tests
                    $response['data'] = $this->formatGenericData($resultadoData);
                }

                return $response;
            });
    }

   /**
 * ✅ MEJORADO: Obtener respuestas individuales CON el texto de la pregunta
 */
private function getIndividualAnswers($testResultId, $testId)
{
    // Obtener el estudiante_id desde el test_result
    $testResult = TestResult::find($testResultId);
    
    if (!$testResult) {
        return [];
    }

    // Obtener las respuestas del estudiante con la información de la pregunta
    $answers = StudentAnswer::where('estudiante_id', $testResult->estudiante_id)
        ->where('test_id', $testId)
        ->with('question')
        ->orderBy('pregunta_id')
        ->get();

    $respuestas = [];

    foreach ($answers as $answer) {
        $preguntaKey = 'pregunta_' . $answer->question->numero_pregunta;
        
        // ✅ Guardar tanto la respuesta como el texto de la pregunta
        $respuestas[$preguntaKey] = [
            'respuesta' => $answer->respuesta,
            'texto_pregunta' => $answer->question->texto_pregunta,
            'categoria' => $answer->question->categoria,
            'numero' => $answer->question->numero_pregunta,
        ];
    }
Log::info('Respuestas formateadas', ['respuestas' => $respuestas]);
    return $respuestas;
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
     * Formatea datos de Estilos de Aprendizaje para gráficas
     */
    private function formatLearningStylesData($resultadoData)
    {
        // El resultado puede venir en diferentes formatos
        $estilos = $resultadoData['estilos'] ?? $resultadoData ?? [];
        $data = [];

        // Si ya es un array simple de estilos
        if (is_array($estilos)) {
            foreach ($estilos as $estilo => $count) {
                $data[$estilo] = is_numeric($count) ? (int)$count : 0;
            }
        }

        return $data;
    }

    /**
     * Formatea datos de Inteligencia Emocional para gráficas
     */
    private function formatEmotionalIntelligenceData($resultadoData)
    {
        $data = [];

        // Primero intentar obtener de 'por_categoria'
        if (isset($resultadoData['por_categoria']) && is_array($resultadoData['por_categoria'])) {
            $porCategoria = $resultadoData['por_categoria'];

            foreach ($porCategoria as $categoria => $value) {
                // Si el valor es un número directo, usarlo
                if (is_numeric($value)) {
                    // Convertir claves a formato esperado
                    $categoriaFormatted = $this->formatCategoryName($categoria);
                    $data[$categoriaFormatted] = round((float)$value, 2);
                }
                // Si es un array con sumaPonderada
                elseif (is_array($value)) {
                    $categoriaFormatted = $this->formatCategoryName($categoria);
                    $puntuacion = $value['sumaPonderada'] ?? $value['suma'] ?? $value['items'] ?? 0;
                    $data[$categoriaFormatted] = round((float)$puntuacion, 2);
                }
            }
        }

        return $data;
    }

    /**
     * Formatea el nombre de la categoría a formato esperado
     */
    private function formatCategoryName($categoria)
    {
        // Mapeo de nombres en minúsculas/sin tildes a formato correcto
        $mapping = [
            'autoconciencia' => 'autoconciencia',
            'autorregulacion' => 'autorregulacion',
            'motivacion' => 'motivacion',
            'empatia' => 'empatia',
            'habilidades_sociales' => 'habilidades_sociales',
        ];

        $key = strtolower($categoria);
        return $mapping[$key] ?? $categoria;
    }

    /**
     * Formatea datos de Habilidades Blandas para gráficas
     */
    private function formatSoftSkillsData($resultadoData)
    {
        $data = [];

        // Primero intentar obtener de 'por_categoria'
        if (isset($resultadoData['por_categoria']) && is_array($resultadoData['por_categoria'])) {
            $porCategoria = $resultadoData['por_categoria'];

            foreach ($porCategoria as $categoria => $value) {
                // Si el valor es un número directo, usarlo
                if (is_numeric($value)) {
                    // Convertir claves a formato esperado
                    $categoriaFormatted = $this->formatSoftSkillCategoryName($categoria);
                    $data[$categoriaFormatted] = round((float)$value, 2);
                }
                // Si es un array con sumaPonderada
                elseif (is_array($value)) {
                    $categoriaFormatted = $this->formatSoftSkillCategoryName($categoria);
                    $puntuacion = $value['sumaPonderada'] ?? $value['suma'] ?? $value['items'] ?? 0;
                    $data[$categoriaFormatted] = round((float)$puntuacion, 2);
                }
            }
        }

        return $data;
    }

    /**
     * Formatea el nombre de las categorías de habilidades blandas
     */
    private function formatSoftSkillCategoryName($categoria)
    {
        // Mapeo de nombres en minúsculas/sin tildes a formato correcto
        $mapping = [
            'comunicacion' => 'comunicacion',
            'trabajo_equipo' => 'trabajo_equipo',
            'resolucion_problemas' => 'resolucion_problemas',
            'pensamiento_critico' => 'pensamiento_critico',
            'adaptabilidad' => 'adaptabilidad',
            'gestion_tiempo' => 'gestion_tiempo',
            'liderazgo' => 'liderazgo',
            'creatividad' => 'creatividad',
            'manejo_estres' => 'manejo_estres',
            'responsabilidad' => 'responsabilidad',
        ];

        $key = strtolower($categoria);
        return $mapping[$key] ?? $categoria;
    }

    /**
     * Formatea datos de Asistencia Psicológica para gráficas
     */
    private function formatPsychologicalAssistanceData($resultadoData)
    {
        $porCategoria = $resultadoData['por_categoria'] ?? [];
        $data = [];

        foreach ($porCategoria as $categoria => $valores) {
            $puntuacion = $valores['sumaPonderada'] ??
                $valores['suma'] ?? 0;
            $data[$categoria] = round($puntuacion, 2);
        }

        return $data;
    }

    /**
     * Formatea datos genéricos para tests sin formato específico
     */
    private function formatGenericData($resultadoData)
    {
        $porCategoria = $resultadoData['por_categoria'] ?? [];
        $data = [];

        foreach ($porCategoria as $categoria => $valores) {
            $puntuacion = $valores['sumaPonderada'] ??
                $valores['suma'] ?? 0;
            $data[$categoria] = round($puntuacion, 2);
        }

        return $data;
    }

    /**
     * Método privado para formatear datos del estudiante
     * ♻️ REUTILIZABLE para tutor y psicólogo
     */
    private function formatStudentData($student)
    {
        return [
            'id' => $student->id,
            'numero_control' => $student->numero_control,
            'nombre' => $student->nombre,
            'apellido_paterno' => $student->apellido_paterno,
            'apellido_materno' => $student->apellido_materno,
            'email' => $student->email,
            'foto_perfil_url' => $student->foto_perfil_url,
            'group_id' => $student->group_id,
            'group_nombre' => $student->group->nombre ?? null,
            'semestre' => $student->semestre,
            'estado' => $student->estado,
        ];
    }

    /**
     * Mostrar un estudiante específico (API - mantén este para otras funcionalidades)
     */
    public function show(StudentAnswer $student)
    {
        return response()->json($student);
    }
}
