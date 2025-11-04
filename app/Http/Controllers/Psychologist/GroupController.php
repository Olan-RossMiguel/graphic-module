<?php

namespace App\Http\Controllers\Psychologist;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Group;
use App\Models\User;

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
            ->get()
            ->map(function($item) {
                return [
                    'group_id' => $item->group_id,
                    'grupo_nombre' => $item->group->nombre ?? 'Sin grupo',
                    'semestre' => $item->semestre,
                    'total_estudiantes' => $item->total_estudiantes,
                ];
            })
            ->sortBy([
                ['grupo_nombre', 'asc'],
                ['semestre', 'asc']
            ])
            ->values();

        return Inertia::render('Psychologist/Groups/Index', [
            'groups' => $groupSemestres,
        ]);
    }

    /**
     * Mostrar los estudiantes de un grupo específico
     */
    public function show(Request $request, $groupId)
    {
        $semestre = $request->query('semestre');

        // Obtener el grupo
        $group = Group::findOrFail($groupId);

        // Obtener estudiantes del grupo en ese semestre específico
        $estudiantes = User::where('tipo', 'estudiante')
            ->where('group_id', $groupId)
            ->where('semestre', $semestre)
            ->select([
                'id',
                'numero_control',
                'nombre',
                'apellido_paterno',
                'apellido_materno',
                'email',
                'foto_perfil',
                'estado',
            ])
            ->orderBy('apellido_paterno')
            ->orderBy('apellido_materno')
            ->orderBy('nombre')
            ->get()
            ->map(function($estudiante) {
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