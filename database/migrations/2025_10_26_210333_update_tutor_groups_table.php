<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tutor_groups', function (Blueprint $table) {
            // Eliminar la columna rol (ya está en users.tipo)
            $table->dropColumn('rol');
            
            // Agregar columna de semestre
            $table->integer('semestre')->nullable()->after('user_id');
            
            // Modificar la unique constraint para incluir semestre
            $table->dropUnique('tutor_groups_group_id_user_id_rol_unique');
            $table->unique(['group_id', 'user_id', 'semestre']);
        });
    }

    public function down(): void
    {
        Schema::table('tutor_groups', function (Blueprint $table) {
            $table->dropUnique(['group_id', 'user_id', 'semestre']);
            $table->dropColumn('semestre');
            $table->enum('rol', ['tutor','psicologa'])->default('tutor');
            $table->unique(['group_id', 'user_id', 'rol']);
        });
    }
};