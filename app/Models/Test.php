<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Test extends Model
{
    /** @use HasFactory<\Database\Factories\TestFactory> */
    use HasFactory;

    public const TYPE_ASISTENCIA_PSICOLOGICA = 'evaluacion_psicologica';
    public const TYPE_VAK                   = 'estilos_aprendizaje';
    public const TYPE_IE                    = 'inteligencia_emocional';
    public const TYPE_SOFT_SKILLS           = 'habilidades_blandas';

    protected $fillable = [
        'nombre',
        'tipo',
        'descripcion',
        'numero_preguntas',
        'dimensiones',
        'configuracion_opciones',
    ];

    protected function casts(): array
    {
        return [
            'numero_preguntas'      => 'integer',
            'dimensiones'           => 'array', // JSON → array
            'configuracion_opciones'=> 'array', // JSON → array
        ];
    }

    /* =======================
       Relaciones
    ======================= */

    // Un test tiene muchas preguntas
    public function questions()
    {
        return $this->hasMany(Question::class)->orderBy('numero_pregunta');
    }

    // Respuestas de estudiantes (si las usarás desde aquí)
    public function studentAnswers()
    {
        return $this->hasMany(StudentAnswer::class);
    }

    // Resultados (si los usarás)
    public function results()
    {
        return $this->hasMany(TestResult::class);
    }

    /* =======================
       Scopes / Helpers
    ======================= */

    // Buscar por tipo
    public function scopeTipo($query, string $tipo)
    {
        return $query->where('tipo', $tipo);
    }

    // Atajo para obtener el test de Asistencia Psicológica
    public static function asistenciaPsicologica(): ?self
    {
        return static::where('tipo', self::TYPE_ASISTENCIA_PSICOLOGICA)->first();
    }

    /* =======================
       Accessors (opcionales)
       Exponen flags del JSON configuracion_opciones como atributos "virtuales"
       $test->mostrar_grafica, $test->mostrar_resultados, $test->escala_personalizada
    ======================= */

    protected function mostrarGrafica(): Attribute
    {
        return Attribute::get(fn () => (bool) data_get($this->configuracion_opciones, 'mostrar_grafica', false));
    }

    protected function mostrarResultados(): Attribute
    {
        return Attribute::get(fn () => (bool) data_get($this->configuracion_opciones, 'mostrar_resultados', false));
    }

    protected function escalaPersonalizada(): Attribute
    {
        return Attribute::get(fn () => (bool) data_get($this->configuracion_opciones, 'escala_personalizada', false));
    }
}
