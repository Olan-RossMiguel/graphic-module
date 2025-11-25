<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Tests\AssistanceTestController;
use App\Http\Controllers\Tests\LearningStylesTestController;
use App\Http\Controllers\Tests\EmotionalIntelligenceTestController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\StudentAnswerController;
use App\Http\Controllers\Tests\SoftSkillsTestController;
use App\Http\Controllers\Tutor\GroupController as TutorGroupController;
use App\Http\Controllers\Psychologist\GroupController as PsychologistGroupController;
use App\Http\Controllers\Psychologist\ReportController as PsychologistReportController;
use App\Http\Controllers\Tutor\ReportController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ==========================================
// RUTAS PÚBLICAS
// ==========================================
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Autenticación
Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
Route::post('register', [RegisteredUserController::class, 'store']);

// ==========================================
// RUTAS PROTEGIDAS (AUTH)
// ==========================================
Route::middleware(['auth'])->group(function () {
    
    // ==========================================
    // PERFIL (Común para todos los roles)
    // ==========================================
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::match(['PATCH', 'POST'], '/profile/student', [ProfileController::class, 'updateStudent'])->name('profile.student.update');
    Route::match(['PATCH', 'POST'], '/profile/tutor', [ProfileController::class, 'updateTutor'])->name('profile.tutor.update');
    Route::match(['PATCH', 'POST'], '/profile/psychologist', [ProfileController::class, 'updatePsychologist'])->name('profile.psychologist.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // ==========================================
    // DASHBOARD PRINCIPAL (Redirección según rol)
    // ==========================================
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // ==========================================
    // RUTAS PARA ESTUDIANTES
    // ==========================================
    Route::prefix('student')->name('student.')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'studentDashboard'])->name('dashboard');
        Route::get('/tests', [DashboardController::class, 'studentTests'])->name('tests');
    });

    // ==========================================
    // TESTS (Común para estudiantes)
    // ==========================================
    Route::prefix('tests')->name('tests.')->group(function () {
        
        // Test de Asistencia Psicológica
        Route::controller(AssistanceTestController::class)
            ->prefix('asistencia-psicologica')
            ->name('assistance.')
            ->group(function () {
                Route::get('/', 'show')->name('show');
                Route::post('/answers', 'storePageAnswers')->name('answers.store');
                Route::post('/submit', 'submit')->name('submit');
                Route::post('/completed', 'completed')->name('completed');
            });

        // Test de Estilos de Aprendizaje
        Route::controller(LearningStylesTestController::class)
            ->prefix('estilos-aprendizaje')
            ->name('learning-styles.')
            ->group(function () {
                Route::get('/', 'show')->name('show');
                Route::post('/answers', 'storePageAnswers')->name('answers.store');
                Route::post('/submit', 'submit')->name('submit');
                Route::get('/completed', 'completed')->name('completed');
            });

        // Test de Inteligencia Emocional
        Route::controller(EmotionalIntelligenceTestController::class)
            ->prefix('inteligencia-emocional')
            ->name('emotional-intelligence.')
            ->group(function () {
                Route::get('/', 'show')->name('show');
                Route::post('/answers', 'storePageAnswers')->name('answers.store');
                Route::post('/submit', 'submit')->name('submit');
                Route::get('/completed', 'completed')->name('completed');
            });

        // Test de Habilidades Blandas
        Route::controller(SoftSkillsTestController::class)
            ->prefix('habilidades-blandas')
            ->name('soft-skills.')
            ->group(function () {
                Route::get('/', 'show')->name('show');
                Route::post('/answers', 'storePageAnswers')->name('answers.store');
                Route::post('/submit', 'submit')->name('submit');
                Route::get('/completed', 'completed')->name('completed');
            });

        // Tests genéricos (QuestionController)
        Route::controller(QuestionController::class)->group(function () {
            Route::get('/{test}/take', 'take')->name('take');
            Route::post('/{test}/answers', 'storePageAnswers')->name('answers.store');
            Route::post('/{test}/submit', 'submit')->name('submit');
        });
    });

    // ==========================================
    // RUTAS PARA TUTORES
    // ==========================================
    Route::prefix('tutor')->name('tutor.')->group(function () {
        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'tutorDashboard'])->name('dashboard');
        
        // Grupos
        Route::get('/groups', [TutorGroupController::class, 'index'])->name('groups.index');
        Route::get('/groups/{group}', [TutorGroupController::class, 'show'])->name('groups.show');
        
        // Estudiantes
        Route::get('/students/{student}', [StudentAnswerController::class, 'showStudentForTutor'])->name('students.show');
         Route::get('/students/{student}/report/general', [ReportController::class, 'showGeneralReport'])
        ->name('students.report.general');
    });

    

    // ==========================================
    // RUTAS PARA PSICÓLOGOS
    // ==========================================
    Route::prefix('psychologist')->name('psychologist.')->group(function () {
        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'psychologistDashboard'])->name('dashboard');
        Route::get('/reports', [DashboardController::class, 'psychologistReports'])->name('reports');
        
        // Grupos (puede ver todos los grupos del sistema)
        Route::get('/groups', [PsychologistGroupController::class, 'index'])->name('groups.index');
        Route::get('/groups/{group}', [PsychologistGroupController::class, 'show'])->name('groups.show');
        
        // Estudiantes (puede ver cualquier estudiante)
        Route::get('/students/{student}', [StudentAnswerController::class, 'showStudentForPsychologist'])->name('students.show');
        Route::get('/students/{student}/report/general', [PsychologistReportController::class, 'showGeneralReport'])
        ->name('students.report.general');
    });
});

// ==========================================
// LOGOUT
// ==========================================
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

require __DIR__ . '/auth.php';