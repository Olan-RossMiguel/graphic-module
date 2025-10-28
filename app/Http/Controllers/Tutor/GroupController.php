<?php

namespace App\Http\Controllers\Tutor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\TutorGroup;

class GroupController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // OPCIÓN 1: Usar el método simple (recomendado)
        $groups = $user->getMyTutorGroups();

        // OPCIÓN 2: Usar la relación directa
        // $groups = $user->tutorGroups()->with('group')->get();

        // Transformar los datos para la vista
        $formattedGroups = $groups->map(function($tutorGroup) {
            return [
                'id' => $tutorGroup->group->id,
                'nombre' => $tutorGroup->group->nombre,
                'pivot' => [
                    'semestre' => $tutorGroup->semestre
                ]
            ];
        });

        return Inertia::render('Tutor/Groups/Index', [
            'groups' => $formattedGroups,
        ]);
    }

public function show(Request $request, $groupId)
{
    $user = $request->user();
    $semestre = $request->query('semestre');

    // Verificar que el tutor tiene acceso a este grupo en el semestre especificado
    $tutorGroup = TutorGroup::where('user_id', $user->id)
        ->where('group_id', $groupId)
        ->where('semestre', $semestre)
        ->with('group')
        ->firstOrFail();

    // Obtener estudiantes del grupo en ese semestre SIN la relación testResults
    $estudiantes = $tutorGroup->group->students()
        ->where('semestre', $semestre)
        ->where('tipo', 'estudiante')
        ->get()
        ->map(function($estudiante) {
            return [
                'id' => $estudiante->id,
                'numero_control' => $estudiante->numero_control,
                'nombre' => $estudiante->nombre,
                'apellido_paterno' => $estudiante->apellido_paterno,
                'apellido_materno' => $estudiante->apellido_materno,
                'email' => $estudiante->email,
                'foto_perfil_url' => $estudiante->foto_perfil_url,
                'estado' => $estudiante->estado,
            ];
        });

    return Inertia::render('Tutor/Groups/Show', [
        'group' => $tutorGroup->group,
        'semestre' => $semestre,
        'estudiantes' => $estudiantes,
    ]);
}
}