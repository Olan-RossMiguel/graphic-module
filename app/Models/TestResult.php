<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TestResult extends Model
{
    /** @use HasFactory<\Database\Factories\TestResultFactory> */
    use HasFactory;

    protected $fillable = [
        'estudiante_id',
        'test_id',
        'fecha_realizacion',
        'puntuacion_total',
        'resultado_json',
        'dato_curioso',
        'recomendaciones',
    ];

    protected $casts = [
        'fecha_realizacion' => 'datetime',
        'puntuacion_total'  => 'float',
        'resultado_json'    => 'array',   // ← para leerlo como array
    ];

    // Relaciones
    public function student()
    {
        return $this->belongsTo(User::class, 'estudiante_id');
    }

    public function test()
    {
        return $this->belongsTo(Test::class, 'test_id');
    }

    // Scopes útiles (opcionales)
    public function scopeForStudent($query, int $studentId)
    {
        return $query->where('estudiante_id', $studentId);
    }

    public function scopeForTest($query, int $testId)
    {
        return $query->where('test_id', $testId);
    }

    // Helper opcional para acceder rápido a "por_categoria"
    public function getPorCategoriaAttribute(): array
    {
        return $this->resultado_json['por_categoria'] ?? [];
    }
}
