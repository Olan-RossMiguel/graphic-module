<?php

namespace App\Http\Controllers\Tests;

use App\Http\Controllers\QuestionController;
use App\Models\Question;
use App\Models\StudentAnswer;
use App\Models\Test;
use App\Models\TestResult;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class LearningStylesTestController extends QuestionController
{
    private const TEST_NAME = 'Estilos de Aprendizaje VAK';

    private const STYLES = [
        'visual' => 1,
        'auditivo' => 2,
        'lectura_escritura' => 3,
        'kinestesico' => 4
    ];

    /**
     * Obtiene el test de Estilos de Aprendizaje VAK
     */
    private function getTest(): Test
    {
        return Test::where('nombre', self::TEST_NAME)->firstOrFail();
    }

    /**
     * Muestra el formulario del test con paginación
     * GET /tests/estilos-aprendizaje
     */
    public function show(Request $request)
    {
        $test = $this->getTest();
        $user = $request->user();
        $sessionId = $request->session()->getId();

        // Obtener las preguntas paginadas
        $perPage = 5;
        $page = $request->get('page', 1);

        $questions = Question::where('test_id', $test->id)
            ->orderBy('numero_pregunta')
            ->paginate($perPage);

        // Formatear preguntas con opciones
        $formattedQuestions = $questions->map(function ($question) {
            return [
                'id' => $question->id,
                'numero_pregunta' => $question->numero_pregunta,
                'texto_pregunta' => $question->texto_pregunta,
                'opciones' => $question->opciones ?? [],
            ];
        });

        // ⭐ CLAVE: Obtener TODAS las respuestas guardadas (no filtrar por página)
        $allSavedAnswers = StudentAnswer::where('estudiante_id', $user->id)
            ->where('test_id', $test->id)
            ->where('sesion_id', $sessionId)
            ->get()
            ->pluck('respuesta', 'pregunta_id')
            ->toArray();

        // Convertir claves a strings y valores a int (consistencia con JavaScript)
        $allSavedAnswersFormatted = [];
        foreach ($allSavedAnswers as $qid => $respuesta) {
            $allSavedAnswersFormatted[(string)$qid] = (int)$respuesta;
        }

        // Verificar si es la última página
        $isLastPage = $questions->currentPage() === $questions->lastPage();

        // Generar clave única para localStorage
        $testStorageKey = "test_{$test->id}_session_{$user->id}";

        // Log para debugging
        Log::info('📄 Página cargada', [
            'page' => $page,
            'session_id' => $sessionId,
            'user_id' => $user->id,
            'total_saved_answers' => count($allSavedAnswersFormatted),
            'saved_answer_question_ids' => array_keys($allSavedAnswersFormatted),
        ]);

        return Inertia::render('Tests/LearningStyles', [
            'test' => [
                'id' => $test->id,
                'nombre' => $test->nombre,
                'descripcion' => $test->descripcion,
            ],
            'questions' => $formattedQuestions,
            'pagination' => [
                'current_page' => $questions->currentPage(),
                'last_page' => $questions->lastPage(),
                'per_page' => $questions->perPage(),
                'total' => $questions->total(),
                'links' => [
                    'prev' => $questions->previousPageUrl(),
                    'next' => $questions->nextPageUrl(),
                ],
            ],
            'allSavedAnswers' => $allSavedAnswersFormatted, // ⭐ TODAS las respuestas
            'isLastPage' => $isLastPage,
            'testStorageKey' => $testStorageKey,
        ]);
    }

    /**
     * OVERRIDE: Guardar respuestas de página
     * POST /tests/estilos-aprendizaje/answers
     */
    public function storePageAnswers(Request $request, ?Test $test = null)
    {
        if (!$test) {
            $test = $this->getTest();
        }

        $request->validate([
            'answers' => 'required|array',
            'answers.*' => 'nullable',
            'page' => 'nullable|integer|min:1',
        ]);

        $user = $request->user();
        $sessionId = $request->session()->getId();
        $answers = $request->input('answers', []);

        Log::info('💾 Guardando respuestas', [
            'user_id' => $user->id,
            'session_id' => $sessionId,
            'answers_count' => count($answers),
            'answer_ids' => array_keys($answers),
        ]);

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
     * POST /tests/estilos-aprendizaje/submit
     */
    public function submit(Request $request, ?Test $test = null)
    {
        if (!$test) {
            $test = $this->getTest();
        }

        $request->validate([
            'answers' => 'required|array',
            'answers.*' => 'nullable',
        ]);

        $user = $request->user();
        $sessionId = $request->session()->getId();
        $answers = $request->input('answers', []);

        Log::info('🏁 Enviando test final', [
            'user_id' => $user->id,
            'session_id' => $sessionId,
            'final_answers_count' => count($answers),
        ]);

        DB::transaction(function () use ($answers, $test, $user, $sessionId) {
            $now = now();

            // Guardar respuestas finales (incluyendo las de localStorage)
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

            // Calcular resultado después de guardar todas las respuestas
            $this->calculateResult($test, $user, $sessionId);
        });

        return redirect()->route('tests.learning-styles.completed');
    }

    /**
     * Muestra la página de test completado con resultados
     * GET /tests/estilos-aprendizaje/completed
     */
    public function completed(Request $request)
    {
        $test = $this->getTest();
        $user = $request->user();

        $result = TestResult::where('estudiante_id', $user->id)
            ->where('test_id', $test->id)
            ->orderBy('fecha_realizacion', 'desc')
            ->first();

        if (!$result) {
            return redirect()->route('student.tests')
                ->with('error', 'No se encontró resultado del test');
        }

        $chartData = [];
        $insights = [];

        if (isset($result->resultado_json['estilos'])) {
            $estilosNombres = [
                'visual' => 'Visual',
                'auditivo' => 'Auditivo',
                'lectura_escritura' => 'Lectura/Escritura',
                'kinestesico' => 'Kinestésico'
            ];

            foreach ($result->resultado_json['estilos'] as $estilo => $count) {
                $chartData[] = [
                    'name' => $estilosNombres[$estilo] ?? ucfirst($estilo),
                    'value' => $count
                ];
            }

            $insights = $this->generateLearningInsights(
                $result->resultado_json['estilo_dominante'],
                $result->resultado_json['porcentajes']
            );
        }

        return Inertia::render('Tests/TestCompletedLearningStyles', [
            'test' => [
                'id' => $test->id,
                'nombre' => $test->nombre,
                'descripcion' => $test->descripcion,
            ],
            'result' => [
                'fecha_realizacion' => $result->fecha_realizacion,
                'puntuacion_total' => $result->puntuacion_total,
                'estilo_dominante' => $result->resultado_json['estilo_dominante'] ?? null,
            ],
            'chartData' => $chartData,
            'insights' => $insights,
        ]);
    }

    private function generateLearningInsights(string $estiloDominante, array $porcentajes): array
    {
        $facts = [
            'visual' => [
                'fact' => '👁️ ¿Sabías que el 65% de la población tiene una preferencia por el aprendizaje visual? Tu cerebro procesa imágenes 60,000 veces más rápido que el texto.',
                'recommendation' => 'Utiliza mapas mentales, infografías y videos educativos para maximizar tu aprendizaje.'
            ],
            'auditivo' => [
                'fact' => '🎵 Las personas auditivas como tú representan el 30% de los estudiantes. Estudios muestran que grabar y escuchar tus propias notas mejora la retención en un 45%.',
                'recommendation' => 'Graba tus clases, participa en debates, explica conceptos en voz alta y usa podcasts educativos.'
            ],
            'lectura_escritura' => [
                'fact' => '📚 Los estudiantes de lectura/escritura procesan información mejor cuando la transforman en palabras. Escribir notas a mano mejora la comprensión en un 34% comparado con teclear.',
                'recommendation' => 'Toma notas detalladas, crea resúmenes y reescribe conceptos clave con tus propias palabras.'
            ],
            'kinestesico' => [
                'fact' => '🤸 Los aprendices kinestésicos como tú retienen hasta un 75% más de información cuando aprenden haciendo. Tu cerebro asocia movimiento con memoria a largo plazo.',
                'recommendation' => 'Realiza experimentos prácticos, usa simuladores y toma descansos activos cada 25 minutos de estudio.'
            ],
        ];

        $porcentaje = $porcentajes[$estiloDominante] ?? 0;

        return [
            'curious_fact' => $facts[$estiloDominante]['fact'] ?? 'Todos tenemos una forma única de aprender.',
            'recommendation' => $facts[$estiloDominante]['recommendation'] ?? 'Combina diferentes técnicas de estudio.',
            'porcentaje_dominante' => $porcentaje,
        ];
    }

    private function normalizeAnswer($raw): int
    {
        if (is_numeric($raw)) {
            return (int) $raw;
        }

        $key = is_string($raw) ? strtolower($raw) : $raw;
        return self::STYLES[$key] ?? 0;
    }

    private function calculateResult($test, $user, $sessionId)
    {
        $answers = StudentAnswer::query()
            ->with('question')
            ->where('estudiante_id', $user->id)
            ->where('test_id', $test->id)
            ->where('sesion_id', $sessionId)
            ->get();

        if ($answers->isEmpty()) {
            throw new \Exception('No se encontraron respuestas para calcular el resultado');
        }

        $styles = [
            'visual' => 0,
            'auditivo' => 0,
            'lectura_escritura' => 0,
            'kinestesico' => 0
        ];

        $styleMap = array_flip(self::STYLES);

        foreach ($answers as $answer) {
            $respuestaValor = $answer->respuesta;
            if (isset($styleMap[$respuestaValor])) {
                $styles[$styleMap[$respuestaValor]]++;
            }
        }

        $totalAnswers = array_sum($styles);
        if ($totalAnswers === 0) {
            throw new \Exception('No se encontraron respuestas válidas para calcular el resultado');
        }

        $dominantStyle = array_search(max($styles), $styles);

        $percentages = [];
        foreach ($styles as $style => $count) {
            $percentages[$style] = round(($count / $totalAnswers) * 100, 2);
        }

        $resultadoJson = [
            'estilos' => $styles,
            'estilo_dominante' => $dominantStyle,
            'porcentajes' => $percentages,
            'interpretacion' => $this->getInterpretation($dominantStyle, $percentages[$dominantStyle]),
            'fecha_calculo' => now()->toDateTimeString(),
            'total_respuestas' => $totalAnswers,
        ];

        TestResult::updateOrCreate(
            [
                'estudiante_id' => $user->id,
                'test_id' => $test->id,
            ],
            [
                'fecha_realizacion' => now(),
                'puntuacion_total' => max($styles),
                'resultado_json' => $resultadoJson,
            ]
        );
    }

    private function getInterpretation(string $style, float $percentage): array
    {
        $interpretations = [
            'visual' => [
                'descripcion' => 'Aprendes mejor con imágenes, diagramas y organizadores visuales.',
                'caracteristicas' => [
                    'Recuerdas mejor lo que ves',
                    'Prefieres leer instrucciones',
                    'Te ayudan los colores y formas'
                ],
            ],
            'auditivo' => [
                'descripcion' => 'Aprendes mejor escuchando explicaciones y participando en discusiones.',
                'caracteristicas' => [
                    'Recuerdas mejor lo que escuchas',
                    'Prefieres explicaciones verbales',
                    'Te ayudan las grabaciones y debates'
                ],
            ],
            'lectura_escritura' => [
                'descripcion' => 'Aprendes mejor leyendo y escribiendo información.',
                'caracteristicas' => [
                    'Prefieres leer textos y tomar notas',
                    'Te ayudan los resúmenes escritos',
                    'Disfrutas hacer listas y esquemas'
                ],
            ],
            'kinestesico' => [
                'descripcion' => 'Aprendes mejor mediante la práctica y experiencias físicas.',
                'caracteristicas' => [
                    'Recuerdas mejor lo que haces',
                    'Prefieres aprender haciendo',
                    'Te ayudan los experimentos y simulaciones'
                ],
            ],
        ];

        return [
            'estilo' => $style,
            'porcentaje' => $percentage,
            'descripcion' => $interpretations[$style]['descripcion'] ?? 'Estilo no identificado',
            'caracteristicas' => $interpretations[$style]['caracteristicas'] ?? [],
            'recomendacion' => $this->getRecommendation($style),
        ];
    }

    private function getRecommendation(string $style): string
    {
        $recommendations = [
            'visual' => 'Usa mapas mentales, videos educativos, resalta con colores y crea diagramas de flujo.',
            'auditivo' => 'Graba las clases, participa en debates, explica conceptos en voz alta y usa podcasts educativos.',
            'lectura_escritura' => 'Toma notas detalladas, lee resúmenes, crea glosarios y reescribe conceptos clave.',
            'kinestesico' => 'Realiza experimentos, usa simuladores, aprende haciendo y toma descansos activos.',
        ];

        return $recommendations[$style] ?? 'Combina diferentes métodos de estudio para mejores resultados.';
    }
}