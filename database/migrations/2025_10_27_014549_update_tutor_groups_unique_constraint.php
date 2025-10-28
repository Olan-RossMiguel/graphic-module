<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tutor_groups', function (Blueprint $table) {
            // Primero eliminar las foreign keys
            $table->dropForeign(['group_id']);
            $table->dropForeign(['user_id']);
            
            // Eliminar la constraint única actual
            $table->dropUnique('tutor_groups_group_id_user_id_rol_unique');
            
            // Crear nueva constraint única que incluya semestre
            $table->unique(['group_id', 'user_id', 'semestre']);
            
            // Volver a agregar las foreign keys
            $table->foreign('group_id')
                  ->references('id')
                  ->on('groups')
                  ->onDelete('cascade');
                  
            $table->foreign('user_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('tutor_groups', function (Blueprint $table) {
            // Eliminar foreign keys
            $table->dropForeign(['group_id']);
            $table->dropForeign(['user_id']);
            
            // Eliminar la nueva constraint única
            $table->dropUnique(['group_id', 'user_id', 'semestre']);
            
            // Recrear la constraint única original
            $table->unique(['group_id', 'user_id', 'rol']);
            
            // Volver a agregar las foreign keys
            $table->foreign('group_id')
                  ->references('id')
                  ->on('groups')
                  ->onDelete('cascade');
                  
            $table->foreign('user_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');
        });
    }
};