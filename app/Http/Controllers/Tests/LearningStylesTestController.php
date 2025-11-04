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

        // ⭐ CLAVE: Obtener TODAS las respuestas guardadas
        $allSavedAnswers = StudentAnswer::where('estudiante_id', $user->id)
            ->where('test_id', $test->id)
            ->where('sesion_id', $sessionId)
            ->get()
            ->pluck('respuesta', 'pregunta_id')
            ->toArray();

        // 🔥 CORRECCIÓN: Convertir claves a strings, pero MANTENER valores originales
        $allSavedAnswersFormatted = [];
        foreach ($allSavedAnswers as $qid => $respuesta) {
            // Solo convertir la clave a string, dejar el valor como está
            $allSavedAnswersFormatted[(string)$qid] = (string)$respuesta;
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
            'saved_answers' => $allSavedAnswersFormatted, // Ver qué valores se están enviando
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
            'answers' => $answers, // Ver qué se está guardando
        ]);

        DB::transaction(function () use ($answers, $test, $user, $sessionId) {
            $now = now();

            foreach ($answers as $questionId => $value) {
                if ($value === null || $value === '') continue;

                $belongs = Question::where('id', $questionId)
                    ->where('test_id', $test->id)
                    ->exists();

                if (!$belongs) continue;

                // 🔥 IMPORTANTE: Guardar el valor normalizado
                $normalizedValue = $this->normalizeAnswer($value);
                
                Log::info('Guardando respuesta individual', [
                    'pregunta_id' => $questionId,
                    'valor_original' => $value,
                    'valor_normalizado' => $normalizedValue,
                ]);

                StudentAnswer::recordAnswer([
                    'estudiante_id' => $user->id,
                    'test_id' => $test->id,
                    'pregunta_id' => (int) $questionId,
                    'sesion_id' => $sessionId,
                    'respuesta' => $normalizedValue,
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

            // Guardar respuestas finales
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

            // Calcular resultado
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

    /**
     * Normaliza la respuesta para guardarla en BD
     * Convierte strings como 'visual' a números (1, 2, 3, 4)
     */
    private function normalizeAnswer($raw): int
    {
        // Si ya es un número válido, devolverlo
        if (is_numeric($raw)) {
            $intVal = (int) $raw;
            // Verificar que esté en el rango válido (1-4)
            if ($intVal >= 1 && $intVal <= 4) {
                return $intVal;
            }
        }

        // Si es un string, convertirlo usando el mapeo
        $key = is_string($raw) ? strtolower(trim($raw)) : $raw;
        
        if (isset(self::STYLES[$key])) {
            return self::STYLES[$key];
        }

        // Si no se puede normalizar, registrar error
        Log::warning('Valor de respuesta no reconocido', [
            'raw_value' => $raw,
            'type' => gettype($raw)
        ]);

        return 0; // Valor por defecto para respuestas inválidas
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