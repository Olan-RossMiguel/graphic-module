<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Tests\AssistanceTestController;
use App\Http\Controllers\Tests\LearningStylesTestController;
use App\Http\Controllers\Tests\EmotionalIntelligenceTestController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\Tests\SoftSkillsTestController;
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


    // TESTS ESPECIALIZADOS (Controladores dedicados)
    // ============================================================

    /**
     * Test de Asistencia Psicológica
     * - 15 preguntas sin paginación
     * - Respuestas mixtas (string y numéricas)
     * - Cálculo ponderado por categorías
     */
    // DENTRO del middleware auth, agrega este grupo:
    Route::prefix('tests')->name('tests.')->group(function () {

        // Assistance Test
        Route::controller(AssistanceTestController::class)
            ->prefix('asistencia-psicologica')
            ->name('assistance.')
            ->group(function () {
                Route::get('/', 'show')->name('show'); // ✅ tests.assistance.show
                Route::post('/answers', 'storePageAnswers')->name('answers.store');
                Route::post('/submit', 'submit')->name('submit');
                Route::post('/completed', 'completed')->name('completed');
            });

        // Learning Styles Test - Manteniendo misma estructura
        Route::controller(LearningStylesTestController::class)
            ->prefix('estilos-aprendizaje')
            ->name('learning-styles.')
            ->group(function () {
                Route::get('/', 'show')->name('show');
                Route::post('/answers', 'storePageAnswers')->name('answers.store');
                Route::post('/submit', 'submit')->name('submit');
                Route::get('/completed', 'completed')->name('completed'); // ✅ GET para mostrar resultados
            });
        // Emotional Intelligence Test
        Route::controller(EmotionalIntelligenceTestController::class)
            ->prefix('inteligencia-emocional')
            ->name('emotional-intelligence.')
            ->group(function () {
                Route::get('/', 'show')->name('show'); // ✅ tests.emotional-intelligence.show
                Route::post('/answers', 'storePageAnswers')->name('answers.store');
                Route::post('/submit', 'submit')->name('submit');
            });

        // Soft Skills Test
        Route::controller(SoftSkillsTestController::class)
            ->prefix('habilidades-blandas')
            ->name('soft-skills.')
            ->group(function () {
                Route::get('/', 'show')->name('show');
                Route::post('/answers', 'storePageAnswers')->name('answers.store');
                Route::post('/submit', 'submit')->name('submit');
            });

        // Tests genéricos (QuestionController)
        Route::controller(QuestionController::class)->group(function () {
            Route::get('/{test}/take', 'take')->name('take'); // ✅ tests.take
            Route::post('/{test}/answers', 'storePageAnswers')->name('answers.store');
            Route::post('/{test}/submit', 'submit')->name('submit');
        });
    });

    Route::controller(QuestionController::class)->group(function () {
        // Mostrar test con paginación
        Route::get('/{test}/take', 'take')->name('take');

        // Guardar respuestas de página actual (sin finalizar)
        Route::post('/{test}/answers', 'storePageAnswers')->name('answers.store');

        // Enviar y finalizar test
        Route::post('/{test}/submit', 'submit')->name('submit');
    });

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
