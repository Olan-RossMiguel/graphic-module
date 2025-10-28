<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;

    protected $fillable = ['nombre'];

    public function students()
    {
        return $this->hasMany(User::class, 'group_id')->where('tipo', 'estudiante');
    }

    // Estudiantes por semestre
    public function studentsBySemestre($semestre)
    {
        return $this->hasMany(User::class, 'group_id')
            ->where('tipo', 'estudiante')
            ->where('semestre', $semestre);
    }

    public function tutorGroups()
    {
        return $this->hasMany(TutorGroup::class);
    }

    // Tutores por semestre
    public function tutorsBySemestre($semestre)
    {
        return $this->belongsToMany(User::class, 'tutor_groups', 'group_id', 'user_id')
            ->wherePivot('semestre', $semestre)
            ->where('users.tipo', 'tutor')
            ->withTimestamps();
    }

    // Psicólogas por semestre
    public function psychologistsBySemestre($semestre)
    {
        return $this->belongsToMany(User::class, 'tutor_groups', 'group_id', 'user_id')
            ->wherePivot('semestre', $semestre)
            ->where('users.tipo', 'psicologa')
            ->withTimestamps();
    }

    // NUEVO: Todos los tutores del grupo (todos los semestres)
    public function allTutors()
    {
        return $this->belongsToMany(User::class, 'tutor_groups', 'group_id', 'user_id')
            ->where('users.tipo', 'tutor')
            ->withPivot('semestre')
            ->withTimestamps();
    }

    // NUEVO: Todas las psicólogas del grupo (todos los semestres)
    public function allPsychologists()
    {
        return $this->belongsToMany(User::class, 'tutor_groups', 'group_id', 'user_id')
            ->where('users.tipo', 'psicologa')
            ->withPivot('semestre')
            ->withTimestamps();
    }
}