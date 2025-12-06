<?php

namespace App\Observers;

use App\Models\StudentDismissal;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class StudentDismissalObserver
{
    public function created(StudentDismissal $studentDismissal): void
    {
        Log::info('🔴 Observer CREATED disparado', [
            'id' => $studentDismissal->id,
            'estudiante_id' => $studentDismissal->estudiante_id
        ]);

        $tipoBaja = $studentDismissal->fecha_reingreso ? 'baja_temporal' : 'baja_definitiva';
        
        $estudiante = User::find($studentDismissal->estudiante_id);
        
        if ($estudiante) {
            $estudiante->estado = $tipoBaja;
            $estudiante->fecha_baja = $studentDismissal->fecha_baja;
            $estudiante->motivo_baja = $studentDismissal->motivo;
            $estudiante->save();
            
            Log::info('✅ Estado actualizado', [
                'user_id' => $estudiante->id,
                'nuevo_estado' => $estudiante->fresh()->estado
            ]);
        }
    }

    public function updated(StudentDismissal $studentDismissal): void
    {
        Log::info('🔵 Observer UPDATED disparado');

        $tipoBaja = $studentDismissal->fecha_reingreso ? 'baja_temporal' : 'baja_definitiva';
        
        $estudiante = User::find($studentDismissal->estudiante_id);
        
        if ($estudiante) {
            $estudiante->estado = $tipoBaja;
            $estudiante->fecha_baja = $studentDismissal->fecha_baja;
            $estudiante->motivo_baja = $studentDismissal->motivo;
            $estudiante->save();
            
            Log::info('✅ Estado actualizado en UPDATE');
        }
    }

    public function deleted(StudentDismissal $studentDismissal): void
    {
        Log::info('🗑️ Observer DELETED disparado');

        $estudiante = User::find($studentDismissal->estudiante_id);
        
        if ($estudiante && in_array($estudiante->estado, ['baja_temporal', 'baja_definitiva'])) {
            $estudiante->estado = 'activo';
            $estudiante->fecha_baja = null;
            $estudiante->motivo_baja = null;
            $estudiante->save();
            
            Log::info('✅ Usuario REACTIVADO');
        }
    }
}