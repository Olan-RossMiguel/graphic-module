<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QuestionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Rutas de autenticación (públicas)
Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
Route::post('register', [RegisteredUserController::class, 'store']);

// Grupo de rutas protegidas
Route::middleware(['auth'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::match(['PATCH', 'POST'], '/profile/student', [ProfileController::class, 'updateStudent'])->name('profile.student.update');
    Route::patch('/profile/tutor', [ProfileController::class, 'updateTutor'])->name('profile.tutor.update');
    Route::patch('/profile/psychologist', [ProfileController::class, 'updatePsychologist'])->name('profile.psychologist.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Ruta principal del dashboard que redirige según el rol
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Rutas específicas para estudiantes
    Route::prefix('student')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'studentDashboard'])->name('student.dashboard');
        Route::get('/tests', [DashboardController::class, 'studentTests'])->name('student.tests');
    });

      Route::get('/tests/assistance', [QuestionController::class, 'assistance'])
        ->name('tests.assistance.show');

    // Guardar respuestas de página (AJAX/Inertia)
   /*  Route::post('/tests/assistance/save', [QuestionController::class, 'assistanceSave'])
        ->name('tests.assistance.save'); */

    // Enviar respuestas finales
    Route::post('/tests/assistance', [QuestionController::class, 'assistanceSubmit'])
        ->name('tests.assistance.submit');

    // Rutas específicas para tutores
    Route::prefix('tutor')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'tutorDashboard'])->name('tutor.dashboard');
        Route::get('/groups', [DashboardController::class, 'tutorGroups'])->name('tutor.groups');
    });

    // Rutas específicas para psicólogos
    Route::prefix('psychologist')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'psychologistDashboard'])->name('psychologist.dashboard');
        Route::get('/reports', [DashboardController::class, 'psychologistReports'])->name('psychologist.reports');
    });
});

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->name('logout');


// ELIMINA o COMENTA esta ruta duplicada que está fuera del middleware:
// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

require __DIR__ . '/auth.php';
