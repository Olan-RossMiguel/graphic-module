<?php

namespace App\Providers;
use App\Models\StudentDismissal;
use App\Observers\StudentDismissalObserver;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        StudentDismissal::observe(StudentDismissalObserver::class);
        Vite::prefetch(concurrency: 3);
    }
}
