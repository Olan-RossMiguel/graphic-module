<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\StudentAnswer;
use App\Models\Test;
use App\Models\TestResult;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controlador GENÉRICO para tests con paginación
 * 
 * IMPORTANTE: Este controlador SOLO maneja tests genéricos que requieren paginación.
 * Los tests especializados tienen sus propios controladores en App\Http\Controllers\Tests\:
 * - AssistanceTestController (Asistencia Psicológica)
 * - LearningStylesTestController (Estilos de Aprendizaje VAK)
 * - EmotionalIntelligenceTestController (Inteligencia Emocional)
 */
class QuestionController extends Controller
{
    /**
     * Muestra un test genérico con paginación (5 preguntas por página)
     * 
     * GET /tests/{test}/take?page=1
     * 
     * @param Request $request
     * @param Test $test
     * @return Response
     */
public function take(Request $request, Test $test): Response
{
    $perPage = 5;
    $page = (int) ($request->query('page', 1));
    $user = $request->user();
    $sessionId = $request->session()->getId();

    // Preguntas paginadas
    $paginator = Question::where('test_id', $test->id)
        ->orderBy('numero_pregunta')
        ->paginate($perPage)
        ->withQueryString();

    $questionIds = $paginator->getCollection()->pluck('id')->all();

    // Respuestas ya guardadas en esta sesión (para preseleccionar valores)
    $savedAnswers = StudentAnswer::query()
        ->forStudent($user->id)
        ->forTest($test->id)
        ->forSession($sessionId)
        ->whereIn('pregunta_id', $questionIds)
        ->pluck('respuesta', 'pregunta_id');

    // Mapeo limpio para Inertia
    $questions = $paginator->getCollection()->map(function (Question $q) {
        return [
            'id' => $q->id,
            'numero_pregunta' => $q->numero_pregunta,
            'texto_pregunta' => $q->texto_pregunta,
            'tipo_respuesta' => $q->tipo_respuesta,
            'opciones' => $q->opciones,
            'categoria' => $q->categoria,
            'puntuacion' => $q->puntuacion,
        ];
    });

    // ✅ CORREGIR: Estructura de paginación que el componente espera
    $template = $this->getTemplateForTest($test);

    return Inertia::render($template, [
        'test' => [
            'id' => $test->id,
            'nombre' => $test->nombre,
            'tipo' => $test->tipo,
            'descripcion' => $test->descripcion,
            'numero_preguntas' => $test->numero_preguntas,
            'config' => $test->configuracion_opciones,
        ],
        'questions' => $questions,
        'pagination' => [
            'current_page' => $paginator->currentPage(),
            'per_page' => $paginator->perPage(),
            'last_page' => $paginator->lastPage(),
            'total' => $paginator->total(),
            // ✅ CORREGIDO: Usar booleanos para prev/next
            'links' => [
                'prev' => !is_null($paginator->previousPageUrl()),
                'next' => !is_null($paginator->nextPageUrl()),
            ],
        ],
        'savedAnswers' => $savedAnswers,
        'isLastPage' => $paginator->currentPage() >= $paginator->lastPage(),
    ]);
}

/**
 * Determina el template de Inertia según el nombre del test
 */
private function getTemplateForTest(Test $test): string
{
    $templates = [
        'Asistencia Psicológica' => 'Tests/PsychologistAssistance',
        'Estilos de Aprendizaje VAK' => 'Tests/LearningStyles',
        'Inteligencia Emocional' => 'Tests/EmotionalIntelligence',
        'Habilidades Blandas' => 'Tests/SoftSkills',
    ];

    return $templates[$test->nombre] ?? 'Tests/GenericTest';
}

    /**
     * Guarda respuestas de la página actual (sin finalizar el test)
     * Permite navegación entre páginas sin perder progreso
     * 
     * POST /tests/{test}/answers
     * 
     * Payload esperado:
     * {
     *   "answers": { "pregunta_id": <int>, ... },
     *   "page": <int>
     * }
     * 
     * @param Request $request
     * @param Test $test
     * @return \Illuminate\Http\RedirectResponse
     */
    public function storePageAnswers(Request $request, Test $test)
    {
        $request->validate([
            'answers' => 'required|array',
            'answers.*' => 'nullable|integer',
            'page' => 'nullable|integer|min:1',
        ]);

        $user = $request->user();
        $sessionId = $request->session()->getId();
        $answers = $request->input('answers', []);

        DB::transaction(function () use ($answers, $test, $user, $sessionId) {
            $now = now();

            foreach ($answers as $questionId => $value) {
                // Ignorar respuestas vacías
                if ($value === null || $value === '') {
                    continue;
                }

                // Verificar que la pregunta pertenece al test
                $belongs = Question::where('id', $questionId)
                    ->where('test_id', $test->id)
                    ->exists();

                if (!$belongs) {
                    continue;
                }

                // Guardar o actualizar respuesta
                StudentAnswer::recordAnswer([
                    'estudiante_id' => $user->id,
                    'test_id' => $test->id,
                    'pregunta_id' => (int) $questionId,
                    'sesion_id' => $sessionId,
                    'respuesta' => (int) $value,
                    'fecha_respuesta' => $now,
                ]);
            }
        });

        return back()->with('status', 'Respuestas guardadas correctamente');
    }

    /**
     * Guarda últimas respuestas y FINALIZA el test genérico
     * Calcula resultado con puntuación ponderada estándar
     * 
     * POST /tests/{test}/submit
     * 
     * Payload esperado:
     * {
     *   "answers": { "pregunta_id": <int>, ... } // Opcional: respuestas finales
     * }
     * 
     * @param Request $request
     * @param Test $test
     * @return \Illuminate\Http\RedirectResponse
     */
    public function submit(Request $request, Test $test)
    {
        $request->validate([
            'answers' => 'nullable|array',
            'answers.*' => 'nullable|integer',
        ]);

        $user = $request->user();
        $sessionId = $request->session()->getId();
        $answers = $request->input('answers', []);

        DB::transaction(function () use ($answers, $test, $user, $sessionId) {
            // 1) Guardar respuestas finales (si existen)
            if (!empty($answers)) {
                $now = now();
                
                foreach ($answers as $questionId => $value) {
                    if ($value === null || $value === '') continue;

                    $belongs = Question::where('id', $questionId)
                        ->where('test_id', $test->id)
                        ->exists();

                    if (!$belongs) continue;

                    StudentAnswer::recordAnswer([
                        'estudiante_id' => $user->id,
                        'test_id' => $test->id,
                        'pregunta_id' => (int) $questionId,
                        'sesion_id' => $sessionId,
                        'respuesta' => (int) $value,
                        'fecha_respuesta' => $now,
                    ]);
                }
            }

            // 2) Calcular resultado con puntuación ponderada estándar
            $this->calculateGenericResult($test, $user, $sessionId);
        });

        return redirect()
            ->route('student.tests')
            ->with('status', '¡Test completado exitosamente!');
    }

    /**
     * Calcula resultado genérico con suma ponderada
     * Formula: Σ (respuesta × puntuacion) para cada pregunta
     * 
     * @param Test $test
     * @param \App\Models\User $user
     * @param string $sessionId
     */
    private function calculateGenericResult($test, $user, $sessionId)
    {
        // Obtener todas las respuestas con sus preguntas
        $rows = DB::table('student_answers as sa')
            ->join('questions as q', 'q.id', '=', 'sa.pregunta_id')
            ->selectRaw('q.categoria, q.puntuacion, sa.respuesta')
            ->where('sa.estudiante_id', $user->id)
            ->where('sa.test_id', $test->id)
            ->where('sa.sesion_id', $sessionId)
            ->get();

        $total = 0;
        $porCategoria = [];

        foreach ($rows as $r) {
            $peso = (int) $r->puntuacion;
            $resp = (int) $r->respuesta;

            // Acumular total ponderado
            $total += ($peso > 0 ? $resp * $peso : 0);

            // Acumular por categoría
            if (!isset($porCategoria[$r->categoria])) {
                $porCategoria[$r->categoria] = [
                    'suma' => 0,
                    'items' => 0,
                    'sumaPonderada' => 0,
                ];
            }
            
            $porCategoria[$r->categoria]['suma'] += $resp;
            $porCategoria[$r->categoria]['sumaPonderada'] += ($peso > 0 ? $resp * $peso : 0);
            $porCategoria[$r->categoria]['items']++;
        }

        $resultadoJson = [
            'puntuacion_total' => $total,
            'por_categoria' => $porCategoria,
            'fecha_calculo' => now()->toDateTimeString(),
            'notas' => [
                'info' => 'Resultado calculado con fórmula genérica de puntuación ponderada.',
            ],
        ];

        // Guardar o actualizar resultado
        TestResult::updateOrCreate(
            [
                'estudiante_id' => $user->id,
                'test_id' => $test->id,
            ],
            [
                'fecha_realizacion' => now(),
                'puntuacion_total' => (float) $total,
                'resultado_json' => $resultadoJson,
            ]
        );
    }
}