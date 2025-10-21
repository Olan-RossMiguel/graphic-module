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
    public function submit(Request $request, Test $test)
    {
       

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
            ->route('student.tests')
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

        // Guardar o actualizar resultado
        TestResult::updateOrCreate(
            [
                'estudiante_id' => $user->id,
                'test_id' => $test->id,
            ],
            [
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