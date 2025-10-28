<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\TutorGroup;
use App\Models\User;
use App\Models\Group;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;


class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        $groups = Group::all(); // Cargar grupos para el select

        return Inertia::render('Auth/Register', [
            'groups' => $groups,
            'canResetPassword' => \Illuminate\Support\Facades\Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Log::info('=== INICIANDO REGISTRO ===');
        Log::info('Datos recibidos:', $request->all());

        try {
            // Validaciones generales
            $request->validate([
                'nombre' => 'required|string|max:255',
                'apellido_paterno' => 'required|string|max:255',
                'apellido_materno' => 'required|string|max:255',
                'genero' => 'required|in:masculino,femenino',
                'email' => 'required|string|email|max:255|unique:users',
                'email_institucional' => 'required|string|email|max:255|unique:users,email_institucional',
                'password' => 'required|string|confirmed|min:8',
                'tipo' => 'required|in:estudiante,tutor,psicologa',
            ]);

            // Validaciones específicas según tipo
            if ($request->tipo === 'estudiante') {
                $request->validate([
                    'numero_control' => 'required|string|max:255|unique:users',
                    'semestre' => 'required|integer|between:1,12',
                    'group_id' => 'required|exists:groups,id',
                ]);
            } else {
                $request->validate([
                    'nivel_academico' => 'required|in:licenciatura,especialidad,maestria,doctorado',
                ]);

                if ($request->tipo === 'tutor') {
                    $request->validate([
                        'grupos_tutor' => 'nullable|array',
                        'grupos_tutor.*' => 'exists:groups,id',
                    ]);
                }
            }

            // Crear el usuario
            $userData = [
                'numero_control' => $request->tipo === 'estudiante' ? $request->numero_control : null,
                'nombre' => $request->nombre,
                'apellido_paterno' => $request->apellido_paterno,
                'apellido_materno' => $request->apellido_materno,
                'genero' => $request->genero,
                'email' => $request->email,
                'email_institucional' => $request->email_institucional,
                'password' => Hash::make($request->password),
                'tipo' => $request->tipo,
                'semestre' => $request->tipo === 'estudiante' ? $request->semestre : null,
                'group_id' => $request->tipo === 'estudiante' ? $request->group_id : null,
                'nivel_academico' => $request->tipo !== 'estudiante' ? $request->nivel_academico : null,
            ];

            $user = User::create($userData);

            // Asignar grupos a tutores
            if ($request->tipo === 'tutor' && !empty($request->grupos_tutor)) {
                foreach ($request->grupos_tutor as $grupoId) {
                    TutorGroup::create([
                        'user_id' => $user->id,
                        'group_id' => $grupoId,
                        'rol' => 'tutor',
                    ]);
                }
            }
            // Evento de registro y login
            event(new Registered($user));
            Auth::login($user);

            // Redirección según tipo de usuario
            if ($user->tipo === 'estudiante') {
                return redirect()->route('student.dashboard');
            } elseif ($user->tipo === 'tutor') {
                return redirect()->route('tutor.dashboard');
            } elseif ($user->tipo === 'psicologa') {
                return redirect()->route('psychologist.dashboard');
            } else {
                return redirect()->route('dashboard'); // fallback
            }
        } catch (\Exception $e) {
            Log::error('ERROR en registro: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return back()->withErrors(['error' => 'Error interno del servidor'])->withInput();
        }
    }
}
