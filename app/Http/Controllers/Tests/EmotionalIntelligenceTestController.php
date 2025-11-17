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

/**
 * Controlador para el Test de Inteligencia Emocional
 * - Sin paginación (todas las preguntas en una vista)
 * - Respuestas en escala Likert (1-5)
 * - Cálculo por suma de puntuaciones en 5 categorías
 */
class EmotionalIntelligenceTestController extends QuestionController
{
    private const TEST_NAME = 'Inteligencia Emocional';
    
    /**
     * Categorías de Inteligencia Emocional según Daniel Goleman
     */
    private const CATEGORIES = [
        'autoconciencia',
        'autorregulacion',
        'motivacion',
        'empatia',
        'habilidades_sociales'
    ];

    /**
     * Rangos de interpretación del test
     */
    private const INTERPRETATION_RANGES = [
        ['min' => 40, 'max' => 50, 'nivel' => 'Alto', 'descripcion' => 'Alto nivel de inteligencia emocional'],
        ['min' => 30, 'max' => 39, 'nivel' => 'Bueno', 'descripcion' => 'Buen nivel, aunque con áreas de mejora'],
        ['min' => 20, 'max' => 29, 'nivel' => 'Medio', 'descripcion' => 'Nivel medio-bajo, requiere trabajar más'],
        ['min' => 10, 'max' => 19, 'nivel' => 'Bajo', 'descripcion' => 'Bajo nivel, es recomendable fortalecer habilidades'],
    ];

    /**
     * Muestra el formulario del test completo
     * GET /tests/inteligencia-emocional
     */
public function show(Request $request)
{
    $test = Test::where('nombre', self::TEST_NAME)->firstOrFail();
    return $this->take($request, $test); 
}

public function storePageAnswers(Request $request, Test $test)
{
    return parent::storePageAnswers($request, $test);
}
   public function submit(Request $request, ?Test $test = null)
{
    // ✅ Obtener el test internamente en lugar de recibirlo como parámetro
    $test = Test::where('nombre', self::TEST_NAME)->firstOrFail();
    
    $request->validate([
        'answers' => 'required|array',
        'answers.*' => 'nullable|integer|min:1|max:5',
    ]);

    $user = $request->user();
    $sessionId = $request->session()->getId();
    $answers = $request->input('answers', []);

    DB::transaction(function () use ($answers, $test, $user, $sessionId) {
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
                'respuesta' => (int) $value,
                'fecha_respuesta' => $now,
            ]);
        }

        // Calcular y guardar resultado
        $this->calculateResult($test, $user, $sessionId);
    });

    return redirect()
        ->route('tests.emotional-intelligence.completed')
        ->with('status', '¡Test de Inteligencia Emocional completado!');
}

    /**
     * Calcula el resultado del test
     * Suma puntuaciones totales y por categoría
     * 
     * @param Test $test
     * @param \App\Models\User $user
     * @param string $sessionId
     */
    private function calculateResult($test, $user, $sessionId)
{
    // Obtener todas las respuestas con sus preguntas
    $answers = StudentAnswer::query()
        ->with('question')
        ->where('estudiante_id', $user->id)
        ->where('test_id', $test->id)
        ->where('sesion_id', $sessionId)
        ->get();

    $totalScore = 0;
    $categories = array_fill_keys(self::CATEGORIES, 0);

    // Sumar puntuaciones
    foreach ($answers as $answer) {
        $score = (int) $answer->respuesta;
        $category = $answer->question->categoria;
        
        $totalScore += $score;
        
        if (isset($categories[$category])) {
            $categories[$category] += $score;
        }
    }

    // Determinar nivel y análisis
    $nivel = $this->determineLevel($totalScore);
    $strengths = $this->identifyStrengths($categories);
    $weaknesses = $this->identifyWeaknesses($categories);

    $resultadoJson = [
        'puntuacion_total' => $totalScore,
        'nivel' => $nivel['nivel'],
        'descripcion' => $nivel['descripcion'],
        'por_categoria' => $categories,
        'interpretacion' => $this->getInterpretationMap(),
        'fortalezas' => $strengths,
        'areas_mejora' => $weaknesses,
        'recomendaciones' => $this->generateRecommendations($weaknesses),
        'fecha_calculo' => now()->toDateTimeString(),
    ];

    // ✅ CORRECCIÓN: Guardar o actualizar resultado con test_id explícito
    TestResult::updateOrCreate(
        [
            'estudiante_id' => $user->id,
            'test_id' => $test->id, // ✅ Asegurarse de incluir test_id aquí también
        ],
        [
            'test_id' => $test->id, // ✅ AGREGADO: Incluir test_id en los datos a actualizar
            'fecha_realizacion' => now(),
            'puntuacion_total' => $totalScore,
            'resultado_json' => $resultadoJson,
        ]
    );
}

    /**
     * Determina el nivel según la puntuación total
     * 
     * @param int $score
     * @return array
     */
    private function determineLevel(int $score): array
    {
        foreach (self::INTERPRETATION_RANGES as $range) {
            if ($score >= $range['min'] && $score <= $range['max']) {
                return [
                    'nivel' => $range['nivel'],
                    'descripcion' => $range['descripcion'],
                    'rango' => "{$range['min']}-{$range['max']}",
                ];
            }
        }

        return [
            'nivel' => 'No determinado',
            'descripcion' => 'Puntuación fuera de rango esperado',
            'rango' => 'N/A',
        ];
    }

    /**
     * Retorna el mapa completo de interpretaciones
     * 
     * @return array
     */
    private function getInterpretationMap(): array
    {
        $map = [];
        foreach (self::INTERPRETATION_RANGES as $range) {
            $key = "{$range['min']}-{$range['max']}";
            $map[$key] = $range['descripcion'];
        }
        return $map;
    }

    /**
     * Identifica las 2 categorías con mayor puntuación (fortalezas)
     * 
     * @param array $categories
     * @return array
     */
    private function identifyStrengths(array $categories): array
    {
        arsort($categories);
        $top = array_slice($categories, 0, 2, true);
        
        $result = [];
        foreach ($top as $key => $value) {
            $result[] = [
                'categoria' => $this->getCategoryName($key),
                'puntuacion' => $value,
            ];
        }
        
        return $result;
    }

    /**
     * Identifica las 2 categorías con menor puntuación (áreas de mejora)
     * 
     * @param array $categories
     * @return array
     */
    private function identifyWeaknesses(array $categories): array
    {
        asort($categories);
        $bottom = array_slice($categories, 0, 2, true);
        
        $result = [];
        foreach ($bottom as $key => $value) {
            $result[] = [
                'categoria' => $this->getCategoryName($key),
                'puntuacion' => $value,
            ];
        }
        
        return $result;
    }

    /**
     * Genera recomendaciones personalizadas según áreas de mejora
     * 
     * @param array $weaknesses
     * @return array
     */

    /**
 * Muestra la página de resultados del test completado
 * GET /tests/inteligencia-emocional/completed
 */
public function completed(Request $request)
{
    $user = $request->user();
    $test = Test::where('nombre', self::TEST_NAME)->firstOrFail();

    // Obtener el último resultado del usuario
    $result = TestResult::where('estudiante_id', $user->id)
        ->where('test_id', $test->id)
        ->latest('fecha_realizacion')
        ->first();

    if (!$result) {
        return redirect()
            ->route('student.tests')
            ->with('error', 'No se encontró ningún resultado del test.');
    }

    $resultadoJson = $result->resultado_json;

    // Preparar datos para la gráfica de radar/barras
    $chartData = [];
    if (isset($resultadoJson['por_categoria'])) {
        foreach ($resultadoJson['por_categoria'] as $key => $value) {
            $chartData[] = [
                'name' => $this->getCategoryName($key),
                'value' => $value,
                'fullMark' => 10, // Máximo posible por categoría (2 preguntas × 5 puntos)
            ];
        }
    }

    // Generar insights personalizados
    $insights = $this->generateInsights($resultadoJson);

    return Inertia::render('Tests/TestCompletedEmotionalIntelligence', [
        'test' => $test,
        'result' => [
            'fecha_realizacion' => $result->fecha_realizacion,
            'puntuacion_total' => $result->puntuacion_total,
            'nivel' => $resultadoJson['nivel'] ?? 'No determinado',
            'descripcion' => $resultadoJson['descripcion'] ?? '',
            'fortalezas' => $resultadoJson['fortalezas'] ?? [],
            'areas_mejora' => $resultadoJson['areas_mejora'] ?? [],
            'recomendaciones' => $resultadoJson['recomendaciones'] ?? [],
        ],
        'chartData' => $chartData,
        'insights' => $insights,
    ]);
}

/**
 * Genera insights personalizados basados en los resultados
 * 
 * @param array $resultadoJson
 * @return array
 */
private function generateInsights(array $resultadoJson): array
{
    $nivel = $resultadoJson['nivel'] ?? 'Medio';
    $fortalezas = $resultadoJson['fortalezas'] ?? [];
    $puntuacionTotal = $resultadoJson['puntuacion_total'] ?? 0;

    // Datos curiosos según el nivel
    $curiousFacts = [
        'Alto' => 'Las personas con alta inteligencia emocional suelen tener un 58% más de éxito en su trabajo. ¡Estás en el camino correcto! 🌟',
        'Bueno' => 'El 90% de los profesionales de alto rendimiento tienen alta inteligencia emocional. Estás desarrollando una habilidad clave para el éxito. 💪',
        'Medio' => 'La inteligencia emocional se puede desarrollar a cualquier edad. ¡Cada paso cuenta en tu crecimiento personal! 🚀',
        'Bajo' => 'Reconocer áreas de mejora es el primer paso para desarrollar tu inteligencia emocional. ¡Ya diste el paso más importante! 🌱',
    ];

    // Recomendaciones generales según el nivel
    $recommendations = [
        'Alto' => 'Mantén tu práctica constante y considera mentorizar a otros en desarrollo de inteligencia emocional.',
        'Bueno' => 'Enfócate en las áreas de mejora identificadas para alcanzar un nivel superior de inteligencia emocional.',
        'Medio' => 'Dedica tiempo diario a practicar mindfulness y reflexión sobre tus emociones.',
        'Bajo' => 'Comienza con ejercicios simples de identificación de emociones y busca recursos de desarrollo personal.',
    ];

    // Fortaleza principal
    $mainStrength = '';
    if (!empty($fortalezas)) {
        $mainStrength = $fortalezas[0]['categoria'] ?? '';
    }

    return [
        'curious_fact' => $curiousFacts[$nivel] ?? $curiousFacts['Medio'],
        'recommendation' => $recommendations[$nivel] ?? $recommendations['Medio'],
        'main_strength' => $mainStrength,
        'score_percentage' => round(($puntuacionTotal / 50) * 100, 1), // Máximo 50 puntos
    ];
}
    private function generateRecommendations(array $weaknesses): array
    {
        $recommendations = [
            'autoconciencia' => 'Practica la reflexión diaria sobre tus emociones y reacciones. Lleva un diario emocional.',
            'autorregulacion' => 'Desarrolla técnicas de respiración y manejo del estrés. Practica la pausa antes de reaccionar.',
            'motivacion' => 'Establece metas claras y celebra tus pequeños logros. Encuentra tu propósito personal.',
            'empatia' => 'Escucha activamente y practica ponerte en el lugar de otros. Lee ficción para desarrollar perspectiva.',
            'habilidades_sociales' => 'Participa en actividades grupales y practica la comunicación asertiva. Desarrolla tu red de apoyo.',
        ];

        $result = [];
        foreach ($weaknesses as $weakness) {
            // Buscar el key original de la categoría
            $categoryKey = null;
            foreach (self::CATEGORIES as $key) {
                if ($this->getCategoryName($key) === $weakness['categoria']) {
                    $categoryKey = $key;
                    break;
                }
            }
            
            if ($categoryKey && isset($recommendations[$categoryKey])) {
                $result[] = [
                    'categoria' => $weakness['categoria'],
                    'recomendacion' => $recommendations[$categoryKey],
                ];
            }
        }

        return $result;
    }

    /**
     * Convierte el key de categoría a nombre legible
     * 
     * @param string $key
     * @return string
     */
    private function getCategoryName(string $key): string
    {
        $names = [
            'autoconciencia' => 'Autoconciencia',
            'autorregulacion' => 'Autorregulación',
            'motivacion' => 'Motivación',
            'empatia' => 'Empatía',
            'habilidades_sociales' => 'Habilidades Sociales',
        ];

        return $names[$key] ?? ucfirst($key);
    }
}