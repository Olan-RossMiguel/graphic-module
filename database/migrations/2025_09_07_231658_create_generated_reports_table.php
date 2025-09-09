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
        Schema::create('generated_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Cambiado de tutor_id
            $table->enum('tipo_reporte', ['individual', 'grupal', 'historico']);
            $table->json('parametros_json');
            $table->json('datos_generados');
            $table->enum('formato', ['png', 'pdf', 'html'])->default('png');
            $table->string('ruta_archivo');
            $table->string('nombre_archivo');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('generated_reports');
    }
};
