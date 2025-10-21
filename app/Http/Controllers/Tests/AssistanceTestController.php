<?php

namespace App\Http\Controllers\Tests;

use App\Http\Controllers\QuestionController;
use App\Models\Question;
use App\Models\StudentAnswer;
use App\Models\Test;
use App\Models\TestResult;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

/**
 * Controlador para el Test de Asistencia Psicológica
 * - Con paginación (5 preguntas por página)
 * - Respuestas mixtas (string y numéricas)
 * - Cálculo ponderado por categorías
 */
class AssistanceTestController extends QuestionController
{
    private const TEST_NAME = 'Asistencia Psicológica';

    /**
     * Muestra el formulario del test completo
     * GET /tests/asistencia-psicologica
     */
    public function show(Request $request)
    {
        $test = Test::where('nombre', self::TEST_NAME)->firstOrFail();
        return $this->take($request, $test); 
    }

    /**
     * OVERRIDE: Guardar respuestas de página
     * Debe mantener la misma firma que el padre
     * 
     * POST /tests/asistencia-psicologica/answers
     */
 /**
 * OVERRIDE: Guardar respuestas de página
 * POST /tests/asistencia-psicologica/answers
 */
public function storePageAnswers(Request $request, ?Test $test = null)
{
    // Si no se pasa el test por ruta, lo buscamos
    if (!$test) {
        $test = Test::where('nombre', self::TEST_NAME)->firstOrFail();
    }

    $request->validate([
        'answers' => 'required|array',
        'answers.*' => 'nullable',
        'page' => 'nullable|integer|min:1',
    ]);

    $user = $request->user();
    $sessionId = $request->session()->getId();
    $answers = $request->input('answers', []);

    DB::transaction(function () use ($answers, $test, $user, $sessionId) {
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
                'respuesta' => $this->normalizeAnswer($value),
                'fecha_respuesta' => $now,
            ]);
        }
    });

    return back()->with('status', 'Respuestas guardadas correctamente');
}

/**
 * OVERRIDE: Envía y finaliza el test
 * POST /tests/asistencia-psicologica/submit
 */
public function submit(Request $request, ?Test $test = null)
{
    // Si no se pasa el test por ruta, lo buscamos
    if (!$test) {
        $test = Test::where('nombre', self::TEST_NAME)->firstOrFail();
    }

    $request->validate([
        'answers' => 'required|array',
        'answers.*' => 'nullable',
    ]);

    $user = $request->user();
    $sessionId = $request->session()->getId();
    $answers = $request->input('answers', []);

    $result = null;

    DB::transaction(function () use ($answers, $test, $user, $sessionId, &$result) {
        $now = now();

        // Guardar todas las respuestas
        foreach ($answers as $questionId => $value) {
            $belongs = Question::where('id', $questionId)
                ->where('test_id', $test->id)
                ->exists();
                
            if (!$belongs) continue;

            StudentAnswer::recordAnswer([
                'estudiante_id' => $user->id,
                'test_id' => $test->id,
                'pregunta_id' => (int) $questionId,
                'sesion_id' => $sessionId,
                'respuesta' => $this->normalizeAnswer($value),
                'fecha_respuesta' => $now,
            ]);
        }

        // Calcular y guardar resultado
        $this->calculateResult($test, $user, $sessionId);

        // Obtener el resultado guardado
        $result = TestResult::where('estudiante_id', $user->id)
            ->where('test_id', $test->id)
            ->first();
    });

    return Inertia::render('Tests/TestCompleted', [
        'test' => [
            'id' => $test->id,
            'nombre' => $test->nombre,
            'descripcion' => $test->descripcion,
        ],
        'result' => $result ? [
            'fecha_realizacion' => $result->fecha_realizacion,
            'puntuacion_total' => $result->puntuacion_total,
        ] : null,
    ]);
}

public function completed(Request $request)
{
    $test = $this->getTest();
    $user = $request->user();

    $result = TestResult::where('estudiante_id', $user->id)
        ->where('test_id', $test->id)
        ->first();

    return Inertia::render('Tests/TestCompleted', [
        'test' => [
            'id' => $test->id,
            'nombre' => $test->nombre,
            'descripcion' => $test->descripcion,
        ],
        'result' => $result ? [
            'fecha_realizacion' => $result->fecha_realizacion,
            'puntuacion_total' => $result->puntuacion_total,
        ] : null,
    ]);
}

/**
 * Obtiene el test de Asistencia Psicológica
 */
private function getTest(): Test
{
    return Test::where('nombre', self::TEST_NAME)->firstOrFail();
}

    /**
     * Normaliza respuestas con valores mixtos (string/int)
     * 
     * @param mixed $raw Valor de la respuesta
     * @return int Valor normalizado
     */
    private function normalizeAnswer($raw): int
    {
        // Si ya es numérico (escalas 1-5), usar tal cual
        if (is_numeric($raw)) {
            return (int) $raw;
        }

        // Mapa para respuestas tipo string
        $map = [
            // Preguntas Si/No
            'si' => 1,
            'no' => 0,
            'indeciso' => 0,
            
            // Frecuencias
            'semanal' => 4,
            'quincenal' => 3,
            'mensual' => 2,
            'ocasional' => 1,
            
            // Duración
            '3_meses' => 1,
            '3_6_meses' => 2,
            '6_12_meses' => 3,
            'mas_1_ano' => 4,
            
            // Intensidad
            'mucho' => 5,
            'parte' => 3,
            'poco' => 1,
            'nada' => 0,
        ];

        $key = is_string($raw) ? strtolower($raw) : $raw;
        return $map[$key] ?? 0;
    }

    /**
     * Calcula el resultado del test (puntuación ponderada)
     * 
     * @param Test $test
     * @param \App\Models\User $user
     * @param string $sessionId
     */
    private function calculateResult($test, $user, $sessionId)
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

        // Calcular puntuación ponderada
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
            'nivel' => $this->getInterpretation($total),
            'fecha_calculo' => now()->toDateTimeString(),
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

    /**
     * Genera interpretación según la puntuación total
     * 
     * @param float $total
     * @return string
     */
    private function getInterpretation(float $total): string
    {
        if ($total >= 50) {
            return 'Se recomienda fuertemente asistencia psicológica';
        } elseif ($total >= 35) {
            return 'Nivel moderado - Se recomienda evaluación profesional';
        } elseif ($total >= 20) {
            return 'Nivel bajo - Mantener seguimiento preventivo';
        }
        
        return 'Nivel mínimo - No se requiere intervención inmediata';
    }
}