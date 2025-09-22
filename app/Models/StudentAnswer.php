<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;

class StudentAnswer extends Model
{
    /** @use HasFactory<\Database\Factories\StudentAnswerFactory> */
    use HasFactory;

     protected $table = 'student_answers';

    protected $fillable = [
        'estudiante_id',
        'test_id',
        'pregunta_id',
        'respuesta',
        'sesion_id',
        'fecha_respuesta',
    ];

    protected function casts(): array
    {
        return [
            'respuesta'       => 'integer',   // OJO: ver nota abajo si necesitas valores no numéricos
            'fecha_respuesta' => 'datetime',
        ];
    }

    /* =======================
       Relaciones
    ======================= */

    public function estudiante()
    {
        return $this->belongsTo(User::class, 'estudiante_id');
    }

    public function test()
    {
        return $this->belongsTo(Test::class);
    }

    public function question()
    {
        return $this->belongsTo(Question::class, 'pregunta_id');
    }

    /* =======================
       Scopes útiles
    ======================= */

    public function scopeForStudent($query, int $studentId)
    {
        return $query->where('estudiante_id', $studentId);
    }

    public function scopeForTest($query, int $testId)
    {
        return $query->where('test_id', $testId);
    }

    public function scopeForSession($query, string $sessionId)
    {
        return $query->where('sesion_id', $sessionId);
    }

    public function scopeForQuestion($query, int $questionId)
    {
        return $query->where('pregunta_id', $questionId);
    }

    /* =======================
       Helpers
    ======================= */

    /**
     * Registra o actualiza la respuesta del estudiante para una pregunta
     * dentro de la misma sesión del test.
     *
     * Requiere: estudiante_id, test_id, pregunta_id, sesion_id, respuesta
     * Opcional: fecha_respuesta (si no se pasa, usa now())
     */
    public static function recordAnswer(array $attributes): self
    {
        $keys = Arr::only($attributes, [
            'estudiante_id', 'test_id', 'pregunta_id', 'sesion_id',
        ]);

        $values = [
            'respuesta'       => $attributes['respuesta'],
            'fecha_respuesta' => $attributes['fecha_respuesta'] ?? now(),
        ];

        return static::updateOrCreate($keys, $values);
    }
}
