<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentDismissal extends Model
{
    use HasFactory;

    protected $fillable = [
        'estudiante_id',
        'psicologa_id',
        'motivo',
        'fecha_baja',
        'fecha_reingreso',
    ];

    protected $casts = [
        'fecha_baja' => 'date',
        'fecha_reingreso' => 'date',
    ];

    // Relaciones
    public function estudiante(): BelongsTo
    {
        return $this->belongsTo(User::class, 'estudiante_id');
    }

    public function psicologa(): BelongsTo
    {
        return $this->belongsTo(User::class, 'psicologa_id');
    }

    // Accessor para obtener el tipo de baja automáticamente
    public function getTipoBajaAttribute(): string
    {
        return $this->fecha_reingreso ? 'baja_temporal' : 'baja_definitiva';
    }

    // Events
    protected static function booted()
    {
        // Al crear la baja, actualizar el estado del usuario
        static::created(function ($dismissal) {
            $tipoBaja = $dismissal->fecha_reingreso ? 'baja_temporal' : 'baja_definitiva';
            
            $dismissal->estudiante->update([
                'estado' => $tipoBaja,
                'fecha_baja' => $dismissal->fecha_baja,
                'motivo_baja' => $dismissal->motivo,
            ]);
        });

        // Al actualizar la baja
        static::updated(function ($dismissal) {
            $tipoBaja = $dismissal->fecha_reingreso ? 'baja_temporal' : 'baja_definitiva';
            
            // Si se cambia el motivo o las fechas, sincronizar
            if ($dismissal->isDirty(['motivo', 'fecha_baja', 'fecha_reingreso'])) {
                $dismissal->estudiante->update([
                    'estado' => $tipoBaja,
                    'fecha_baja' => $dismissal->fecha_baja,
                    'motivo_baja' => $dismissal->motivo,
                ]);
            }

            // Si la fecha de reingreso ha pasado (llegó el día de reingreso)
            if ($dismissal->fecha_reingreso && now()->gte($dismissal->fecha_reingreso)) {
                $dismissal->estudiante->update([
                    'estado' => 'activo',
                    'fecha_baja' => null,
                    'motivo_baja' => null,
                ]);
            }
        });

        // Al eliminar la baja, reactivar al estudiante
        static::deleted(function ($dismissal) {
            // Solo reactivar si está en estado de baja
            if (in_array($dismissal->estudiante->estado, ['baja_temporal', 'baja_definitiva'])) {
                $dismissal->estudiante->update([
                    'estado' => 'activo',
                    'fecha_baja' => null,
                    'motivo_baja' => null,
                ]);
            }
        });
    }
}