<?php

namespace App\Http\Controllers\Psychologist;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Group;
use App\Models\User;
use App\Models\Test;
use App\Models\TestResult;

class GroupController extends Controller
{
    /**
     * Mostrar todas las combinaciones de grupo + semestre disponibles
     */
    public function index(Request $request)
    {
        // Obtener combinaciones únicas de group_id + semestre desde la tabla users
        $groupSemestres = User::where('tipo', 'estudiante')
            ->whereNotNull('group_id')
            ->whereNotNull('semestre')
            ->select('group_id', 'semestre')
            ->selectRaw('COUNT(*) as total_estudiantes')
            ->groupBy('group_id', 'semestre')
            ->with('group:id,nombre')
            ->orderBy('semestre', 'asc')
            ->get()
            ->map(function($item) {
                return [
                    'group_id' => $item->group_id,
                    'grupo_nombre' => $item->group->nombre ?? 'Sin grupo',
                    'semestre' => $item->semestre,
                    'total_estudiantes' => $item->total_estudiantes,
                ];
            })
            ->sortBy('grupo_nombre')
            ->values();

        return Inertia::render('Psychologist/Groups/Index', [
            'groups' => $groupSemestres,
        ]);
    }

    /**
     * Mostrar los estudiantes de un grupo específico con estado de tests
     * La psicóloga ve 4 tests (los 3 del tutor + Asistencia Psicológica)
     */
    public function show(Request $request, $groupId)
    {
        $semestre = $request->query('semestre');

        // Obtener el grupo
        $group = Group::findOrFail($groupId);

        // Obtener los IDs de los tests (4 tests para psicóloga)
        $testAprendizaje = Test::where('tipo', Test::TYPE_VAK)->first();
        $testEmocional = Test::where('tipo', Test::TYPE_IE)->first();
        $testHabilidades = Test::where('tipo', Test::TYPE_SOFT_SKILLS)->first();
        $testAsistencia = Test::where('nombre', 'Asistencia Psicológica')->first();
        
        $testIds = [
            'aprendizaje' => $testAprendizaje?->id,
            'emocional' => $testEmocional?->id,
            'habilidades' => $testHabilidades?->id,
            'asistencia' => $testAsistencia?->id, // ✅ Test exclusivo para psicóloga
        ];

        // Obtener estudiantes del grupo en ese semestre CON estado de tests
        $estudiantes = User::where('tipo', 'estudiante')
            ->where('group_id', $groupId)
            ->where('semestre', $semestre)
            ->orderBy('apellido_paterno')
            ->orderBy('apellido_materno')
            ->orderBy('nombre')
            ->get()
            ->map(function($estudiante) use ($testIds) {
                // Obtener los test results del estudiante
                $testResults = TestResult::where('estudiante_id', $estudiante->id)
                    ->whereIn('test_id', array_filter($testIds))
                    ->pluck('test_id')
                    ->toArray();

                return [
                    'id' => $estudiante->id,
                    'numero_control' => $estudiante->numero_control,
                    'nombre' => $estudiante->nombre,
                    'apellido_paterno' => $estudiante->apellido_paterno,
                    'apellido_materno' => $estudiante->apellido_materno,
                    'email' => $estudiante->email,
                    'foto_perfil_url' => $estudiante->foto_perfil 
                        ? asset('storage/' . $estudiante->foto_perfil)
                        : asset('images/default-avatar.png'),
                    'estado' => $estudiante->estado,
                    // Estado de tests completados (TRUE = ✅, FALSE = ❌)
                    'tests_completados' => [
                        'aprendizaje' => in_array($testIds['aprendizaje'], $testResults),
                        'emocional' => in_array($testIds['emocional'], $testResults),
                        'habilidades' => in_array($testIds['habilidades'], $testResults),
                        'asistencia' => in_array($testIds['asistencia'], $testResults), // ✅ Test adicional
                    ],
                ];
            });

        return Inertia::render('Psychologist/Groups/Show', [
            'group' => $group,
            'semestre' => $semestre,
            'estudiantes' => $estudiantes,
        ]);
    }

    /**
     * Obtener todos los semestres disponibles (opcional)
     */
    public function getSemestres()
    {
        $semestres = User::where('tipo', 'estudiante')
            ->whereNotNull('semestre')
            ->distinct()
            ->pluck('semestre')
            ->sort()
            ->values();

        return response()->json([
            'semestres' => $semestres
        ]);
    }
}