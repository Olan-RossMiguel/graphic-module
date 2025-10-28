<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Illuminate\Contracts\Filesystem\Filesystem;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'numero_control',
        'nombre',
        'apellido_paterno',
        'apellido_materno',
        'genero',
        'email',
        'email_institucional',
        'password',
        'tipo',
        'semestre',
        'group_id',
        'nivel_academico',
        'estado',
        'foto_perfil',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'semestre'          => 'integer',
            'group_id'          => 'integer',
        ];
    }

    // Grupo del estudiante
    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    // NUEVA: Relación directa con tutor_groups (con semestre)
    public function tutorGroups()
    {
        return $this->hasMany(TutorGroup::class);
    }

    // ACTUALIZADA: Grupos asignados (con semestre)
        public function assignedGroups()
    {
        return $this->belongsToMany(Group::class, 'tutor_groups', 'user_id', 'group_id')
            ->withPivot('semestre')
            ->withTimestamps();
    }

    // CORREGIDA: Grupos donde es tutor (con semestre)
    public function assignedTutorGroups()
    {
        return $this->belongsToMany(Group::class, 'tutor_groups', 'user_id', 'group_id')
            ->where('tutor_groups.user_id', $this->id) // Filtro correcto
            ->withPivot('semestre')
            ->withTimestamps();
    }

    // CORREGIDA: Grupos donde es psicóloga (con semestre)
    public function assignedPsychologistGroups()
    {
        return $this->belongsToMany(Group::class, 'tutor_groups', 'user_id', 'group_id')
            ->where('tutor_groups.user_id', $this->id) // Filtro correcto
            ->withPivot('semestre')
            ->withTimestamps();
    }

    // NUEVO: Método mejorado para obtener grupos del tutor
    public function tutorGroupsWithSemestre()
    {
        return $this->hasMany(TutorGroup::class)
            ->with('group')
            ->whereHas('user', function($query) {
                $query->where('tipo', 'tutor');
            });
    }

    // NUEVO: Método simple para grupos del tutor actual
    public function getMyTutorGroups()
    {
        return TutorGroup::where('user_id', $this->id)
            ->with('group')
            ->get();
    }

    // Helpers de rol
    public function isEstudiante() { return $this->tipo === 'estudiante'; }
    public function isTutor()      { return $this->tipo === 'tutor'; }
    public function isPsicologa()  { return $this->tipo === 'psicologa'; }
    public function isAdmin()      { return $this->tipo === 'admin'; }

    // NUEVO: Tutor asignado al estudiante (por group_id y semestre)
    public function getTutorAttribute()
    {
        if (!$this->isEstudiante() || !$this->group_id || !$this->semestre) return null;

        return User::whereHas('tutorGroups', function ($q) {
            $q->where('group_id', $this->group_id)
              ->where('semestre', $this->semestre)
              ->where('tipo', 'tutor');
        })->first();
    }

    // NUEVO: Psicóloga asignada al grupo del estudiante
    public function getPsychologistAttribute()
    {
        if (!$this->isEstudiante() || !$this->group_id || !$this->semestre) return null;

        return User::whereHas('tutorGroups', function ($q) {
            $q->where('group_id', $this->group_id)
              ->where('semestre', $this->semestre)
              ->where('tipo', 'psicologa');
        })->first();
    }

    // ACTUALIZADA: Estudiantes de los grupos del tutor (por semestre)
    public function getEstudiantesBySemestre($semestre = null)
    {
        if (!$this->isTutor()) return collect();

        $groupIds = $this->tutorGroups()
            ->when($semestre, function($q) use ($semestre) {
                $q->where('semestre', $semestre);
            })
            ->pluck('group_id');

        return User::whereIn('group_id', $groupIds)
            ->where('tipo', 'estudiante')
            ->when($semestre, function($q) use ($semestre) {
                $q->where('semestre', $semestre);
            })
            ->get();
    }

    // NUEVO: Todos los estudiantes para psicólogas (todos los grupos y semestres)
    public function getAllEstudiantesForPsychologist()
    {
        if (!$this->isPsicologa()) return collect();

        return User::where('tipo', 'estudiante')->get();
    }

    // NUEVO: Grupos por semestre para tutores
    public function getGroupsBySemestre($semestre)
    {
        if (!$this->isTutor()) return collect();

        return $this->tutorGroups()
            ->with('group')
            ->where('semestre', $semestre)
            ->get()
            ->pluck('group');
    }

    // NUEVO: Todos los grupos para psicólogas
    public function getAllGroupsForPsychologist()
    {
        if (!$this->isPsicologa()) return collect();

        return Group::with(['students', 'tutorGroups.user'])->get();
    }

    // URL pública de la foto
    public function getFotoPerfilUrlAttribute()
    {
        if (!$this->foto_perfil) return '/images/default-avatar.png';
        return url('storage/' . $this->foto_perfil);
    }

    public function getNombreCompletoAttribute()
    {
        return trim("{$this->nombre} {$this->apellido_paterno} {$this->apellido_materno}");
    }
}