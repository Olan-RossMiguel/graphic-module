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
            'password'          => 'hashed',   // hashea automáticamente al asignar
            'semestre'          => 'integer',
            'group_id'          => 'integer',
        ];
    }

    // Grupo del estudiante
    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    // Relación general a grupos por pivote (con rol)
    public function assignedGroups()
    {
        return $this->belongsToMany(Group::class, 'tutor_groups', 'user_id', 'group_id')
            ->withPivot('rol')
            ->withTimestamps();
    }

    // Grupos donde el usuario actúa como TUTOR
    public function assignedTutorGroups()
    {
        return $this->belongsToMany(Group::class, 'tutor_groups', 'user_id', 'group_id')
            ->wherePivot('rol', 'tutor')
            ->withPivot('rol')
            ->withTimestamps();
    }

    // (Opcional) Grupos donde el usuario actúa como PSICÓLOGA
    public function assignedPsychologistGroups()
    {
        return $this->belongsToMany(Group::class, 'tutor_groups', 'user_id', 'group_id')
            ->wherePivot('rol', 'psicologa')
            ->withPivot('rol')
            ->withTimestamps();
    }

    // Helpers de rol (no tienen nada que ver con Filament)
    public function isEstudiante() { return $this->tipo === 'estudiante'; }
    public function isTutor()      { return $this->tipo === 'tutor'; }
    public function isPsicologa()  { return $this->tipo === 'psicologa'; }
    public function isAdmin()      { return $this->tipo === 'admin'; }

    // Tutor asignado al estudiante (por group_id)
    public function getTutorAttribute()
    {
        if (!$this->isEstudiante() || !$this->group_id) return null;

        return User::whereHas('assignedGroups', function ($q) {
            $q->where('group_id', $this->group_id)->where('rol', 'tutor');
        })->first();
    }

    // Estudiantes de los grupos del tutor
    public function getEstudiantesAttribute()
    {
        if (!$this->isTutor()) return collect();

        $groupIds = $this->assignedTutorGroups()->pluck('groups.id');
        return User::whereIn('group_id', $groupIds)
            ->where('tipo', 'estudiante')
            ->get();
    }

    // URL pública de la foto (disco 'public')
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
