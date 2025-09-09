<?php

namespace App\Http\Controllers;

use App\Models\TutorGroup;
use App\Models\Group;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TutorGroupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tutorGroups = TutorGroup::with(['group', 'user'])
            ->orderBy('group_id')
            ->orderBy('rol')
            ->get();

        return Inertia::render('TutorGroups/Index', [
            'tutorGroups' => $tutorGroups,
            'groups' => Group::all(),
            'tutors' => User::where('tipo', 'tutor')->get(),
            'psychologists' => User::where('tipo', 'psicologa')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('TutorGroups/Create', [
            'groups' => Group::all(),
            'tutors' => User::where('tipo', 'tutor')->get(),
            'psychologists' => User::where('tipo', 'psicologa')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'group_id' => 'required|exists:groups,id',
            'user_id' => 'required|exists:users,id',
            'rol' => 'required|in:tutor,psicologa',
        ]);

        // Verificar que no exista ya la asignación
        $exists = TutorGroup::where('group_id', $request->group_id)
            ->where('user_id', $request->user_id)
            ->where('rol', $request->rol)
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'message' => 'Esta asignación ya existe.',
            ]);
        }

        TutorGroup::create($request->all());

        return redirect()->route('tutor-groups.index')
            ->with('success', 'Asignación creada correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(TutorGroup $tutorGroup)
    {
        $tutorGroup->load(['group', 'user']);

        return Inertia::render('TutorGroups/Show', [
            'tutorGroup' => $tutorGroup,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TutorGroup $tutorGroup)
    {
        return Inertia::render('TutorGroups/Edit', [
            'tutorGroup' => $tutorGroup,
            'groups' => Group::all(),
            'tutors' => User::where('tipo', 'tutor')->get(),
            'psychologists' => User::where('tipo', 'psicologa')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TutorGroup $tutorGroup)
    {
        $request->validate([
            'group_id' => 'required|exists:groups,id',
            'user_id' => 'required|exists:users,id',
            'rol' => 'required|in:tutor,psicologa',
        ]);

        // Verificar que no exista otra asignación igual
        $exists = TutorGroup::where('group_id', $request->group_id)
            ->where('user_id', $request->user_id)
            ->where('rol', $request->rol)
            ->where('id', '!=', $tutorGroup->id)
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'message' => 'Esta asignación ya existe.',
            ]);
        }

        $tutorGroup->update($request->all());

        return redirect()->route('tutor-groups.index')
            ->with('success', 'Asignación actualizada correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TutorGroup $tutorGroup)
    {
        $tutorGroup->delete();

        return redirect()->route('tutor-groups.index')
            ->with('success', 'Asignación eliminada correctamente.');
    }

    /**
     * Obtener tutores/psicólogas asignados a un grupo
     */
    public function byGroup(Group $group)
    {
        $tutorGroups = TutorGroup::with('user')
            ->where('group_id', $group->id)
            ->get();

        return response()->json($tutorGroups);
    }

    /**
     * Obtener grupos asignados a un tutor/psicóloga
     */
    public function byUser(User $user)
    {
        $tutorGroups = TutorGroup::with('group')
            ->where('user_id', $user->id)
            ->get();

        return response()->json($tutorGroups);
    }
}