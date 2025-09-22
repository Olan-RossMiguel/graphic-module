<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\StudentAnswer;
use App\Models\Test;
use App\Models\TestResult;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class QuestionController extends Controller
{
    /**
     * Muestra la página del test (5 preguntas por página).
     * GET /tests/{test}/take?page=1
     */

  public function assistance(Request $request)
{
    // usa id=1 o por nombre
    $test = Test::where('nombre', 'Asistencia Psicológica')->firstOrFail();

    $questions = Question::where('test_id', $test->id)
        ->orderBy('numero_pregunta')
        ->get([
            'id','test_id','numero_pregunta','texto_pregunta',
            'tipo_respuesta','opciones','categoria','puntuacion'
        ]);

    return Inertia::render('Tests/PsychologistAssistance', [
        'test' => [
            'id' => $test->id,
            'nombre' => $test->nombre,
            'descripcion' => $test->descripcion,
        ],
        'questions' => $questions,   // ← array completo (15) para paginar en el front
    ]);
}

public function assistanceSave(Request $request)
{
    $test = Test::findOrFail(1);
    return $this->storePageAnswers($request, $test);
}

public function assistanceSubmit(Request $request)
{
    $test = Test::findOrFail(1);

    $request->validate([
        'answers'   => 'required|array',
        'answers.*' => 'nullable', // ← permite string o int
    ]);

    $user      = $request->user();
    $sessionId = $request->session()->getId();
    $answers   = $request->input('answers', []);

    DB::transaction(function () use ($answers, $test, $user, $sessionId) {
        $now = now();

        foreach ($answers as $questionId => $value) {
            // Verifica pertenencia
            $belongs = Question::where('id', $questionId)
                ->where('test_id', $test->id)
                ->exists();
            if (!$belongs) continue;

            StudentAnswer::recordAnswer([
                'estudiante_id'   => $user->id,
                'test_id'         => $test->id,
                'pregunta_id'     => (int) $questionId,
                'sesion_id'       => $sessionId,
                'respuesta'       => $this->normalizeAnswer($value), // ← aquí
                'fecha_respuesta' => $now,
            ]);
        }

        // … tu cálculo y TestResult::updateOrCreate() tal cual
    });

    return redirect()->route('student.tests')->with('status', '¡Tus respuestas fueron enviadas!');
}

private function normalizeAnswer($raw): int
{
    // Si ya es numérico (las escalas 1..5), úsalo tal cual
    if (is_numeric($raw)) {
        return (int) $raw;
    }

    // Mapa para preguntas con valores string (ajústalo si cambias las opciones)
    $map = [
        'si' => 1, 'no' => 0, 'indeciso' => 0,
        'semanal' => 4, 'quincenal' => 3, 'mensual' => 2, 'ocasional' => 1,
        '3_meses' => 1, '3_6_meses' => 2, '6_12_meses' => 3, 'mas_1_ano' => 4,
        'mucho' => 5, 'parte' => 3, 'poco' => 1, 'nada' => 0,
    ];

    $key = is_string($raw) ? strtolower($raw) : $raw;
    return $map[$key] ?? 0;
}


    public function take(Request $request, Test $test): Response
    {
        $perPage = 5;
        $page    = (int) ($request->query('page', 1));
        $user    = $request->user();
        $sessionId = $request->session()->getId();

        // Preguntas paginadas
        $paginator = Question::where('test_id', $test->id)
            ->orderBy('numero_pregunta')
            ->paginate($perPage)
            ->withQueryString();

        $questionIds = $paginator->getCollection()->pluck('id')->all();

        // Respuestas ya guardadas en esta sesión (para pintar valores)
        $savedAnswers = StudentAnswer::query()
            ->forStudent($user->id)
            ->forTest($test->id)
            ->forSession($sessionId)
            ->whereIn('pregunta_id', $questionIds)
            ->pluck('respuesta', 'pregunta_id'); // [pregunta_id => respuesta]

        // Mapeo limpio para Inertia (con opciones ya decodificadas)
        $questions = $paginator->getCollection()->map(function (Question $q) {
            return [
                'id'               => $q->id,
                'numero_pregunta'  => $q->numero_pregunta,
                'texto_pregunta'   => $q->texto_pregunta,
                'tipo_respuesta'   => $q->tipo_respuesta,
                'opciones'         => $q->opciones,   // viene como array gracias al cast
                'categoria'        => $q->categoria,
                'puntuacion'       => $q->puntuacion,
            ];
        });

        return Inertia::render('Tests/PsychologistAssistance', [
            'test' => [
                'id'                => $test->id,
                'nombre'            => $test->nombre,
                'tipo'              => $test->tipo,
                'descripcion'       => $test->descripcion,
                'numero_preguntas'  => $test->numero_preguntas,
                'config'            => $test->configuracion_opciones, // array por cast
            ],

            // Preguntas + paginación
            'questions' => $questions,
            'pagination' => [
                'current_page' => $paginator->currentPage(),
                'per_page'     => $paginator->perPage(),
                'last_page'    => $paginator->lastPage(),
                'total'        => $paginator->total(),
                'links'        => [
                    'prev' => $paginator->previousPageUrl(),
                    'next' => $paginator->nextPageUrl(),
                ],
            ],

            // Respuestas ya guardadas (para preseleccionar en el front)
            'savedAnswers' => $savedAnswers,

            // Para saber si estamos en la última página (activar “Enviar respuestas”)
            'isLastPage' => $paginator->currentPage() >= $paginator->lastPage(),
        ]);
    }

    // QuestionController.php



    /**
     * Guarda respuestas de la página actual (no finaliza).
     * POST /tests/{test}/answers
     *
     * Espera payload:
     * {
     *   "answers": { "pregunta_id": <int>, ... },
     *   "page": <int>
     * }
     */
    public function storePageAnswers(Request $request, Test $test)
    {
        $request->validate([
            'answers'              => 'required|array',
            'answers.*'            => 'nullable|integer', // IMPORTANTE: si tienes valores NO numéricos, mapéalos en el front a enteros
            'page'                 => 'nullable|integer|min:1',
        ]);

        $user      = $request->user();
        $sessionId = $request->session()->getId();
        $answers   = $request->input('answers', []);

        DB::transaction(function () use ($answers, $test, $user, $sessionId) {
            $now = now();

            foreach ($answers as $questionId => $value) {
                if ($value === null || $value === '') {
                    continue; // permite limpiar si lo deseas; aquí simplemente ignoramos nulls
                }

                // Asegura que la pregunta pertenece a este test
                $belongs = Question::where('id', $questionId)
                    ->where('test_id', $test->id)
                    ->exists();

                if (!$belongs) {
                    continue;
                }

                StudentAnswer::recordAnswer([
                    'estudiante_id'   => $user->id,
                    'test_id'         => $test->id,
                    'pregunta_id'     => (int) $questionId,
                    'sesion_id'       => $sessionId,
                    'respuesta'       => (int) $value,    // <- ver nota arriba si tienes respuestas string
                    'fecha_respuesta' => $now,
                ]);
            }
        });

        // Respuesta Inertia: no redirige; el front decide pasar a la siguiente página
        return back()->with('status', 'Respuestas guardadas.');
    }

    /**
     * Guarda últimas respuestas y FINALIZA el test.
     * POST /tests/{test}/submit
     *
     * Espera payload:
     * {
     *   "answers": { "pregunta_id": <int>, ... } // opcional: respuestas de la última página
     * }
     */
    public function submit(Request $request, Test $test)
    {
        $request->validate([
            'answers'   => 'nullable|array',
            'answers.*' => 'nullable|integer',
        ]);

        $user      = $request->user();
        $sessionId = $request->session()->getId();
        $answers   = $request->input('answers', []);

        DB::transaction(function () use ($answers, $test, $user, $sessionId) {
            // 1) Guardar (otra vez) por si vienen respuestas de la última página
            if (!empty($answers)) {
                $now = now();
                foreach ($answers as $questionId => $value) {
                    if ($value === null || $value === '') continue;

                    $belongs = Question::where('id', $questionId)
                        ->where('test_id', $test->id)
                        ->exists();

                    if (!$belongs) continue;

                    StudentAnswer::recordAnswer([
                        'estudiante_id'   => $user->id,
                        'test_id'         => $test->id,
                        'pregunta_id'     => (int) $questionId,
                        'sesion_id'       => $sessionId,
                        'respuesta'       => (int) $value,
                        'fecha_respuesta' => $now,
                    ]);
                }
            }

            // 2) Calcular resultado (suma ponderada por "puntuacion")
            //    * Solo tiene sentido si 'respuesta' es numérica y 'puntuacion' > 0
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

                // acumula total ponderado
                $total += ($peso > 0 ? $resp * $peso : 0);

                // por categoría
                if (!isset($porCategoria[$r->categoria])) {
                    $porCategoria[$r->categoria] = [
                        'suma'        => 0,
                        'items'       => 0,
                        'sumaPonderada' => 0,
                    ];
                }
                $porCategoria[$r->categoria]['suma']          += $resp;
                $porCategoria[$r->categoria]['sumaPonderada'] += ($peso > 0 ? $resp * $peso : 0);
                $porCategoria[$r->categoria]['items']++;
            }

            $resultadoJson = [
                'por_categoria' => $porCategoria,
                'notas' => [
                    'info' => 'Este test puede ocultar resultados al estudiante según configuración.',
                ],
            ];

            // 3) Upsert en test_results (índice único: estudiante_id + test_id)
            TestResult::updateOrCreate(
                [
                    'estudiante_id' => $user->id,
                    'test_id'       => $test->id,
                ],
                [
                    'fecha_realizacion' => now(),
                    'puntuacion_total'  => (float) $total,
                    'resultado_json'    => $resultadoJson,
                    // 'dato_curioso'    => null,
                    // 'recomendaciones' => null,
                ]
            );
        });

        // Redirige al listado del estudiante con flash (sin recargar full gracias a Inertia)
        return redirect()
            ->route('student.tests')
            ->with('status', '¡Tus respuestas fueron enviadas!');
    }
}

