<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Group;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Renderiza la página correcta según el rol
     */
    public function edit(Request $request): Response
    {
        $user = $request->user()->load('group');

        // Tutor asignado (solo si estudiante y con grupo)
        $tutorAsignado = null;
        if ($user->tipo === 'estudiante' && $user->group) {
            $tutorAsignado = User::whereHas('assignedGroups', function ($q) use ($user) {
                $q->where('group_id', $user->group_id)->where('rol', 'tutor');
            })->first();
        }

        $fields = [
            'numero_control'       => $user->numero_control,
            'nombre'               => $user->nombre,
            'apellido_paterno'     => $user->apellido_paterno,
            'apellido_materno'     => $user->apellido_materno,
            'email'                => $user->email,
            'email_institucional'  => $user->email_institucional,
            'foto_perfil'          => $user->foto_perfil_url ?? $user->foto_perfil,
            'semestre'             => $user->semestre,
            'grupo'                => $user->group,
            'group_id'             => (string) ($user->group_id ?? ''),
            'tutor_asignado'       => $tutorAsignado,
            'nivel_academico'      => $user->nivel_academico,
        ];

        $pageByRole = [
            'estudiante' => 'Profile/Student',
            'tutor'      => 'Profile/Tutor',
            'psicologa'  => 'Profile/Psychologist',
        ];
        $page = $pageByRole[$user->tipo] ?? 'Profile/Student';

        $props = [
            'user'            => $user,
            'fields'          => $fields,
            'role'            => $user->tipo,
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status'          => session('status'),
        ];

        if ($user->tipo === 'estudiante') {
            $props['grupos'] = Group::select('id', 'nombre')->orderBy('nombre')->get();
        }

        if ($user->tipo === 'tutor') {
            $props['grupos']        = Group::select('id', 'nombre')->orderBy('nombre')->get();
            $props['tutorGroupIds'] = $user->assignedTutorGroups()->pluck('groups.id');
        }

        return Inertia::render($page, $props);
    }

    /**
     * PATCH /profile/student
     * Actualiza perfil de ESTUDIANTE usando Inertia
     */
    public function updateStudent(Request $request)
    {
        $user = $request->user();
        abort_unless($user->tipo === 'estudiante', 403);

        $rules = [
            'numero_control'       => 'required|string|max:50|unique:users,numero_control,' . $user->id,
            'nombre'               => 'required|string|max:255',
            'apellido_paterno'     => 'required|string|max:255',
            'apellido_materno'     => 'required|string|max:255',
            'email'                => 'required|email|unique:users,email,' . $user->id,
            'email_institucional'  => 'nullable|email|unique:users,email_institucional,' . $user->id,
            'semestre'             => 'required|integer|between:1,12',
            'group_id'             => 'required|exists:groups,id',
            'password'             => 'nullable|confirmed|min:8',
            'foto_perfil'          => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ];

        $validated = $request->validate($rules);

        $updateData = [
            'numero_control'      => $validated['numero_control'],
            'nombre'              => $validated['nombre'],
            'apellido_paterno'    => $validated['apellido_paterno'],
            'apellido_materno'    => $validated['apellido_materno'],
            'email'               => $validated['email'],
            'email_institucional' => $validated['email_institucional'],
            'semestre'            => (int) $validated['semestre'],
            'group_id'            => (int) $validated['group_id'],
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = bcrypt($validated['password']);
        }

        if ($request->hasFile('foto_perfil')) {
            if ($user->foto_perfil && Storage::disk('public')->exists($user->foto_perfil)) {
                Storage::disk('public')->delete($user->foto_perfil);
            }

            $path = $request->file('foto_perfil')->store('profiles', 'public');
            $updateData['foto_perfil'] = $path;
        }

        $user->update($updateData);

        return Redirect::route('profile.edit')
            ->with('status', 'Perfil actualizado correctamente');
    }

    /**
     * PATCH /profile/tutor
     * Actualiza perfil de TUTOR usando Inertia
     */
    public function updateTutor(Request $request)
    {
        $user = $request->user();
        abort_unless($user->tipo === 'tutor', 403);

        $rules = [
            'nombre'               => 'required|string|max:255',
            'apellido_paterno'     => 'required|string|max:255',
            'apellido_materno'     => 'required|string|max:255',
            'nivel_academico'      => 'required|in:licenciatura,especialidad,maestria,doctorado',
            'email'                => 'required|email|unique:users,email,' . $user->id,
            'email_institucional'  => 'nullable|email|unique:users,email_institucional,' . $user->id,
            'password'             => 'nullable|confirmed|min:8',
            'foto_perfil'          => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'group_ids'            => 'nullable|array',
            'group_ids.*'          => 'integer|exists:groups,id',
        ];

        $validated = $request->validate($rules);

        $updateData = [
            'nombre'              => $validated['nombre'],
            'apellido_paterno'    => $validated['apellido_paterno'],
            'apellido_materno'    => $validated['apellido_materno'],
            'nivel_academico'     => $validated['nivel_academico'],
            'email'               => $validated['email'],
            'email_institucional' => $validated['email_institucional'],
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = bcrypt($validated['password']);
        }

        if ($request->hasFile('foto_perfil')) {
            if ($user->foto_perfil && Storage::disk('public')->exists($user->foto_perfil)) {
                Storage::disk('public')->delete($user->foto_perfil);
            }
            $updateData['foto_perfil'] = $request->file('foto_perfil')->store('profiles', 'public');
        }

        $user->update($updateData);

        // Sincroniza grupos del tutor
        if (array_key_exists('group_ids', $validated)) {
            $user->assignedTutorGroups()->sync($validated['group_ids'] ?? []);
        }

        return Redirect::route('profile.edit')->with('status', 'Perfil actualizado correctamente');
    }

    /**
     * PATCH /profile/psychologist
     * Actualiza perfil de PSICÓLOGA usando Inertia
     */
    public function updatePsychologist(Request $request)
    {
        $user = $request->user();
        abort_unless($user->tipo === 'psicologa', 403);

        $rules = [
            'nombre'               => 'required|string|max:255',
            'apellido_paterno'     => 'required|string|max:255',
            'apellido_materno'     => 'required|string|max:255',
            'nivel_academico'      => 'required|in:licenciatura,especialidad,maestria,doctorado',
            'email'                => 'required|email|unique:users,email,' . $user->id,
            'email_institucional'  => 'nullable|email|unique:users,email_institucional,' . $user->id,
            'password'             => 'nullable|confirmed|min:8',
            'foto_perfil'          => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ];

        $validated = $request->validate($rules);

        $updateData = [
            'nombre'              => $validated['nombre'],
            'apellido_paterno'    => $validated['apellido_paterno'],
            'apellido_materno'    => $validated['apellido_materno'],
            'nivel_academico'     => $validated['nivel_academico'],
            'email'               => $validated['email'],
            'email_institucional' => $validated['email_institucional'],
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = bcrypt($validated['password']);
        }

        if ($request->hasFile('foto_perfil')) {
            if ($user->foto_perfil && Storage::disk('public')->exists($user->foto_perfil)) {
                Storage::disk('public')->delete($user->foto_perfil);
            }
            $updateData['foto_perfil'] = $request->file('foto_perfil')->store('profiles', 'public');
        }

        $user->update($updateData);

        return Redirect::route('profile.edit')->with('status', 'Perfil actualizado correctamente');
    }

    public function destroy(Request $request)
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();
        Auth::logout();
        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
