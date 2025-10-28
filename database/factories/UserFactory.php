<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    public function definition(): array
    {
        $gender = $this->faker->randomElement(['masculino', 'femenino']);
        $firstName = $gender === 'masculino' 
            ? $this->faker->firstNameMale()
            : $this->faker->firstNameFemale();

        $semester = $this->faker->numberBetween(1, 9); // Cambiado de 12 a 9
        $group = $this->faker->randomElement([1, 2]); // Grupos A (1) y B (2)
        
        // Generar número de control único (21E + 5 dígitos)
        $controlNumber = '21E' . $this->faker->unique()->numberBetween(30000, 39999);

        return [
            'numero_control' => $controlNumber,
            'nombre' => $firstName,
            'apellido_paterno' => $this->faker->lastName(),
            'apellido_materno' => $this->faker->lastName(),
            'semestre' => $semester,
            'group_id' => $group,
            'genero' => $gender,
            'email' => $this->faker->unique()->safeEmail(),
            'email_institucional' => $controlNumber . '@tecnm.mx',
            'email_verified_at' => now(),
            'password' => Hash::make('password'), // Password por defecto: 'password'
            'tipo' => 'estudiante',
            'estado' => 'activo',
            'remember_token' => Str::random(10),
            'created_at' => $this->faker->dateTimeBetween('-2 years', 'now'),
            'updated_at' => now(),
        ];
    }

    // Estado para estudiantes inactivos
    public function inactivo(): static
    {
        return $this->state(fn (array $attributes) => [
            'estado' => 'inactivo',
        ]);
    }

    // Estado para estudiantes con baja temporal
    public function bajaTemporal(): static
    {
        return $this->state(fn (array $attributes) => [
            'estado' => 'baja_temporal',
            'fecha_baja' => now()->subMonths(3),
            'motivo_baja' => 'Baja temporal por situación personal',
        ]);
    }

    // Estado para estudiantes con baja definitiva
    public function bajaDefinitiva(): static
    {
        return $this->state(fn (array $attributes) => [
            'estado' => 'baja_definitiva',
            'fecha_baja' => now()->subMonths(6),
            'motivo_baja' => 'Baja definitiva por cambio de institución',
        ]);
    }

    // Estado para estudiantes de un grupo específico
    public function grupoA(): static
    {
        return $this->state(fn (array $attributes) => [
            'group_id' => 1, // Grupo A
        ]);
    }

    public function grupoB(): static
    {
        return $this->state(fn (array $attributes) => [
            'group_id' => 2, // Grupo B
        ]);
    }

    // Estado para estudiantes de un semestre específico
    public function semestre(int $semestre): static
    {
        return $this->state(fn (array $attributes) => [
            'semestre' => $semestre,
        ]);
    }
}