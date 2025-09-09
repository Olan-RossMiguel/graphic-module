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
        Schema::create('tutor_groups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('group_id')->constrained('groups')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Cambiado de tutor_id a user_id
            $table->enum('rol', ['tutor', 'psicologa']); // NUEVO: especifica el rol en este grupo
            $table->timestamps();

            $table->unique(['group_id', 'user_id', 'rol']); // Evitar duplicados por rol
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tutor_groups');
    }
};
