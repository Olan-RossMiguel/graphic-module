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
 * Controlador para el Test de Habilidades Blandas
 * - Evaluación de 10 competencias profesionales
 * - Escala Likert 1-5
 * - Cálculo por suma total y por categorías
 */
class SoftSkillsTestController extends QuestionController
{
    private const TEST_NAME = 'Habilidades Blandas';
    
    /**
     * Categorías de Habilidades Blandas evaluadas
     */
    private const CATEGORIES = [
        'comunicacion',
        'trabajo_equipo', 
        'resolucion_problemas',
        'pensamiento_critico',
        'adaptabilidad',
        'gestion_tiempo',
        'liderazgo',
        'creatividad',
        'manejo_estres',
        'responsabilidad'
    ];

    /**
     * Rangos de interpretación del test
     */
    private const INTERPRETATION_RANGES = [
        ['min' => 40, 'max' => 50, 'nivel' => 'Excelente', 'descripcion' => 'Excelente desarrollo de habilidades blandas. Eres muy competente en el ámbito académico y laboral.'],
        ['min' => 30, 'max' => 39, 'nivel' => 'Bueno', 'descripcion' => 'Buen nivel, pero puedes fortalecer algunas áreas.'],
        ['min' => 20, 'max' => 29, 'nivel' => 'Medio', 'descripcion' => 'Nivel medio-bajo, es recomendable trabajar más en tus habilidades blandas.'],
        ['min' => 10, 'max' => 19, 'nivel' => 'Bajo', 'descripcion' => 'Bajo nivel, necesitas enfocarte en desarrollar estas competencias.'],
    ];

    /**
     * Muestra el formulario del test completo
     * GET /tests/habilidades-blandas
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

    /**
     * Envía y finaliza el test
     * POST /tests/habilidades-blandas/submit
     */
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
            ->with('status', '¡Test de Habilidades Blandas completado!');
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
        $rows = DB::table('student_answers as sa')
            ->join('questions as q', 'q.id', '=', 'sa.pregunta_id')
            ->selectRaw('q.categoria, sa.respuesta')
            ->where('sa.estudiante_id', $user->id)
            ->where('sa.test_id', $test->id)
            ->where('sa.sesion_id', $sessionId)
            ->get();

        $totalScore = 0;
        $categories = array_fill_keys(self::CATEGORIES, 0);

        // Sumar puntuaciones
        foreach ($rows as $r) {
            $score = (int) $r->respuesta;
            $category = $r->categoria;
            
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
     * Identifica las 3 categorías con mayor puntuación (fortalezas)
     * 
     * @param array $categories
     * @return array
     */
    private function identifyStrengths(array $categories): array
    {
        arsort($categories);
        $top = array_slice($categories, 0, 3, true);
        
        $result = [];
        foreach ($top as $key => $value) {
            $result[] = [
                'categoria' => $this->getCategoryName($key),
                'puntuacion' => $value,
                'maximo' => 5, // Cada categoría tiene máximo 5 puntos (1 pregunta × 5)
            ];
        }
        
        return $result;
    }

    /**
     * Identifica las 3 categorías con menor puntuación (áreas de mejora)
     * 
     * @param array $categories
     * @return array
     */
    private function identifyWeaknesses(array $categories): array
    {
        asort($categories);
        $bottom = array_slice($categories, 0, 3, true);
        
        $result = [];
        foreach ($bottom as $key => $value) {
            $result[] = [
                'categoria' => $this->getCategoryName($key),
                'puntuacion' => $value,
                'maximo' => 5,
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
            'comunicacion' => 'Practica la expresión clara de ideas. Participa más en clases y reuniones. Toma cursos de oratoria o comunicación efectiva.',
            'trabajo_equipo' => 'Busca oportunidades para colaborar en proyectos grupales. Aprende a escuchar activamente y respetar opiniones diferentes.',
            'resolucion_problemas' => 'Desarrolla el pensamiento analítico. Practica con ejercicios de lógica y busca múltiples soluciones antes de decidir.',
            'pensamiento_critico' => 'Cuestiona la información, analiza fuentes y evalúa evidencias antes de formar conclusiones.',
            'adaptabilidad' => 'Sal de tu zona de confort. Acepta nuevos retos y mantén una mentalidad abierta al cambio.',
            'gestion_tiempo' => 'Usa agendas y planificadores. Establece prioridades y evita la procrastinación.',
            'liderazgo' => 'Ofrécete como voluntario para coordinar proyectos. Desarrolla habilidades de motivación e influencia.',
            'creatividad' => 'Practica lluvia de ideas, explora diferentes perspectivas y permítete cometer errores como parte del aprendizaje.',
            'manejo_estres' => 'Aprende técnicas de relajación, establece límites saludables y mantén equilibrio entre trabajo y descanso.',
            'responsabilidad' => 'Cumple con plazos establecidos, sé puntual en tus compromisos y reconoce tus errores para aprender de ellos.',
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
            'comunicacion' => 'Comunicación',
            'trabajo_equipo' => 'Trabajo en equipo',
            'resolucion_problemas' => 'Resolución de problemas',
            'pensamiento_critico' => 'Pensamiento crítico',
            'adaptabilidad' => 'Adaptabilidad',
            'gestion_tiempo' => 'Gestión del tiempo',
            'liderazgo' => 'Liderazgo',
            'creatividad' => 'Creatividad',
            'manejo_estres' => 'Manejo del estrés',
            'responsabilidad' => 'Responsabilidad',
        ];

        return $names[$key] ?? ucfirst($key);
    }
}