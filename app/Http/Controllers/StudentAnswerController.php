<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\TestResult;
use App\Models\StudentAnswer;
use Illuminate\Http\Request;
use Inertia\Inertia; 

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
     */
    private function formatTestResults($studentId)
    {
        return TestResult::where('estudiante_id', $studentId)
            ->with(['test'])
            ->get()
            ->map(function($result) {
                // Asegurar que resultado_json sea un array
                $resultadoData = is_string($result->resultado_json) 
                    ? json_decode($result->resultado_json, true) 
                    : $result->resultado_json;

                // Preparar la respuesta base
                $response = [
                    'id' => $result->id,
                    'test_id' => $result->test_id,
                    'test_tipo' => $result->test->tipo,
                    'test_nombre' => $result->test->nombre,
                    'fecha_realizacion' => $result->fecha_realizacion,
                    'puntuacion_total' => $result->puntuacion_total,
                    'recomendaciones' => $result->recomendaciones,
                    'dato_curioso' => $result->dato_curioso,
                    'created_at' => $result->created_at,
                    'updated_at' => $result->updated_at
                ];

                // Agregar resultado_json con toda su estructura
                if ($result->test->tipo === 'estilos_aprendizaje' || $result->test->tipo === 'learning-styles') {
                    $response['resultado_json'] = [
                        'estilos' => $resultadoData['estilos'] ?? [],
                        'estilo_dominante' => $resultadoData['estilo_dominante'] ?? null,
                        'porcentajes' => $resultadoData['porcentajes'] ?? [],
                        'interpretacion' => $resultadoData['interpretacion'] ?? null,
                        'total_respuestas' => $resultadoData['total_respuestas'] ?? 0,
                    ];
                } else {
                    $response['resultado_json'] = $resultadoData;
                }

                return $response;
            });
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