<?php

namespace App\Http\Controllers;

use App\Models\Test;
use App\Models\TestResult;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    /**
     * Mostrar el dashboard según el rol del usuario
     */
    public function index()
    {
        // Verificar que el usuario esté autenticado
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();

        // Redirigir según el rol del usuario
        switch ($user->tipo) {
            case 'estudiante':
                return redirect()->route('student.dashboard');
            case 'tutor':
                return redirect()->route('tutor.dashboard');
            case 'psicologa':
                return redirect()->route('psychologist.dashboard');
            default:
                abort(403, 'Rol no válido');
        }
    }

    /**
     * Obtener datos del usuario para compartir
     */
    private function getUserData()
    {
        $user = Auth::user();
        return [
            'id' => $user->id,
            'nombre' => $user->nombre,
            'nombre_completo' => $user->nombre_completo,
            'foto_perfil' => $user->foto_perfil,
            'tipo' => $user->tipo,
            'email' => $user->email,
        ];
    }

    /**
     * Dashboard para estudiantes
     */
    public function studentDashboard()
    {
        if (Auth::user()->tipo !== 'estudiante') {
            abort(403, 'No autorizado');
        }

        $data = [
            'user' => $this->getUserData(),
            'welcome_message' => 'Bienvenido Estudiante',
            'pending_tests' => 3,
            'completed_tests' => 5,
        ];

        return Inertia::render('Student/Dashboard', $data);
    }

    /**
     * Dashboard para tutores
     */
    public function tutorDashboard()
    {
        if (Auth::user()->tipo !== 'tutor') {
            abort(403, 'No autorizado');
        }

        $data = [
            'user' => $this->getUserData(),
            'welcome_message' => 'Bienvenido Tutor',
            'total_groups' => 4,
            'total_students' => 120,
        ];

        return Inertia::render('Tutor/Dashboard', $data);
    }

    /**
     * Dashboard para psicólogos
     */
    public function psychologistDashboard()
    {
        if (Auth::user()->tipo !== 'psicologa') { // ← Cambié 'psychologist' a 'psicologa'
            abort(403, 'No autorizado');
        }

        $data = [
            'user' => $this->getUserData(),
            'welcome_message' => 'Bienvenida Psicóloga',
            'total_reports' => 15,
            'pending_reviews' => 8,
        ];

        return Inertia::render('Psychologist/Dashboard', $data);
    }

    /**
     * Tests para estudiantes
     */
    public function studentTests()
    {
        if (Auth::user()->tipo !== 'estudiante') abort(403);

        $userId = Auth::id();

        $completedIds = TestResult::where('estudiante_id', $userId)->pluck('test_id')->all();

        $tests = Test::select('id','nombre','tipo')
            ->orderBy('id')
            ->get()
            ->map(function ($t) use ($completedIds) {
                return [
                    'id'        => $t->id,
                    'name'      => $t->nombre,
                    'type'      => $t->tipo,
                    'completed' => in_array($t->id, $completedIds),
                ];
            });

        return Inertia::render('Student/Tests', [
            'user' => $this->getUserData(),
            'tests' => $tests
        ]);
    }

    /**
     * Grupos para tutores
     */
    public function tutorGroups()
    {
        if (Auth::user()->tipo !== 'tutor') {
            abort(403, 'No autorizado');
        }

        $groups = [
            ['id' => 1, 'name' => 'Grupo 1A', 'students_count' => 30],
            ['id' => 2, 'name' => 'Grupo 2B', 'students_count' => 28],
            ['id' => 3, 'name' => 'Grupo 3C', 'students_count' => 32],
        ];

        return Inertia::render('Tutor/Groups', [
            'user' => $this->getUserData(),
            'groups' => $groups
        ]);
    }

    /**
     * Reportes para psicólogos
     */
    public function psychologistReports()
    {
        if (Auth::user()->tipo !== 'psicologa') { // ← Cambié 'psychologist' a 'psicologa'
            abort(403, 'No autorizado');
        }

        $reports = [
            ['id' => 1, 'title' => 'Reporte General', 'date' => '2023-10-15'],
            ['id' => 2, 'title' => 'Análisis por Grupos', 'date' => '2023-10-10'],
            ['id' => 3, 'title' => 'Estadísticas Globales', 'date' => '2023-10-05'],
        ];

        return Inertia::render('Psychologist/Reports', [
            'user' => $this->getUserData(),
            'reports' => $reports
        ]);
    }
}