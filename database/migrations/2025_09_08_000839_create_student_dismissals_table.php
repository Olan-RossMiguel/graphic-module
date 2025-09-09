<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('student_dismissals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('estudiante_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('psicologa_id')->constrained('users')->onDelete('cascade');
            $table->text('motivo'); // Motivo de la baja
            $table->date('fecha_baja'); // Fecha efectiva de la baja
            $table->date('fecha_reingreso')->nullable(); // Fecha posible de reingreso
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_dismissals');
    }
};
