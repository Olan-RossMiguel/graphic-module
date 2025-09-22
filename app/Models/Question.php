<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    /** @use HasFactory<\Database\Factories\QuestionFactory> */
    use HasFactory;

    protected $table = 'questions';

    /**
     * ✅ 5 por página por defecto
     */
    protected $perPage = 5;

    protected $fillable = [
        'test_id',
        'numero_pregunta',
        'texto_pregunta',
        'tipo_respuesta',  // enum('opcion_multiple')
        'opciones',        // JSON con [{texto, valor}, ...]
        'categoria',
        'puntuacion',
    ];

    protected $casts = [
        'opciones'   => 'array',   // convierte JSON <-> array
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relaciones
    |--------------------------------------------------------------------------
    */
    public function test()
    {
        return $this->belongsTo(Test::class);
    }

    public function studentAnswers()
    {
        // FK en student_answers = pregunta_id
        return $this->hasMany(StudentAnswer::class, 'pregunta_id');
    }

    /*
    |--------------------------------------------------------------------------
    | Scopes útiles
    |--------------------------------------------------------------------------
    */
    public function scopeForTest($query, int $testId)
    {
        return $query->where('test_id', $testId);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('numero_pregunta');
    }

    /*
    |--------------------------------------------------------------------------
    | Mutators/Accessors robustos para 'opciones'
    |--------------------------------------------------------------------------
    | Acepta array o string JSON al guardar, y siempre devuelve array al leer.
    */
    public function setOpcionesAttribute($value): void
    {
        if (is_string($value)) {
            $decoded = json_decode($value, true);
            $this->attributes['opciones'] = json_encode($decoded ?? []);
        } else {
            $this->attributes['opciones'] = json_encode($value ?? []);
        }
    }

    public function getOpcionesAttribute($value): array
    {
        if (is_array($value)) {
            return $value;
        }
        $decoded = json_decode($value ?? '[]', true);
        return $decoded ?: [];
    }
}
