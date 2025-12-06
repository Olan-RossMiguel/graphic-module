<?php

namespace App\Models;

use Filament\Models\Contracts\HasName;
use Filament\Models\Contracts\FilamentUser; // ← Agregar este import
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Support\Facades\Auth;
use Filament\Panel;

class User extends Authenticatable implements HasName, FilamentUser // ← Implementar FilamentUser
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
        'fecha_baja',
        'motivo_baja',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'fecha_baja' => 'datetime',
            'password' => 'hashed',
            'semestre' => 'integer',
            'group_id' => 'integer',
        ];
    }

    // ====== MÉTODOS DE FILAMENT ======
    
    public function getFilamentName(): string
    {
        $nombreCompleto = trim("{$this->nombre} {$this->apellido_paterno} {$this->apellido_materno}");

        if (!empty($nombreCompleto)) {
            return $nombreCompleto;
        }

        return $this->email ?? 'Usuario';
    }

    // ← ESTE ES EL MÉTODO IMPORTANTE PARA CONTROL DE ACCESO
    public function canAccessPanel(Panel $panel): bool
    {
        // Solo admin puede acceder
        return $this->tipo === 'admin';
        
        // O si quieres que admin, tutor y psicóloga accedan:
        // return in_array($this->tipo, ['admin', 'tutor', 'psicologa']);
    }

    // ====== RELACIONES ======
    
    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    public function tutorGroups()
    {
        return $this->hasMany(TutorGroup::class);
    }

    public function assignedGroups()
    {
        return $this->belongsToMany(Group::class, 'tutor_groups', 'user_id', 'group_id')
            ->withPivot('semestre')
            ->withTimestamps();
    }

    public function assignedTutorGroups()
    {
        return $this->belongsToMany(Group::class, 'tutor_groups', 'user_id', 'group_id')
            ->where('tutor_groups.user_id', $this->id)
            ->withPivot('semestre')
            ->withTimestamps();
    }

    public function assignedPsychologistGroups()
    {
        return $this->belongsToMany(Group::class, 'tutor_groups', 'user_id', 'group_id')
            ->where('tutor_groups.user_id', $this->id)
            ->withPivot('semestre')
            ->withTimestamps();
    }

    public function tutorGroupsWithSemestre()
    {
        return $this->hasMany(TutorGroup::class)
            ->with('group')
            ->whereHas('user', function ($query) {
                $query->where('tipo', 'tutor');
            });
    }

    public function getMyTutorGroups()
    {
        return TutorGroup::where('user_id', $this->id)
            ->with('group')
            ->get();
    }

    // ====== HELPERS DE ROL ======
    
    public function isEstudiante()
    {
        return $this->tipo === 'estudiante';
    }

    public function isTutor()
    {
        return $this->tipo === 'tutor';
    }

    public function isPsicologa()
    {
        return $this->tipo === 'psicologa';
    }

    public function isAdmin()
    {
        return $this->tipo === 'admin';
    }

    public function dismissals()
    {
        return $this->hasMany(StudentDismissal::class, 'estudiante_id');
    }

    public function dismissalsAsPsychologist()
    {
        return $this->hasMany(StudentDismissal::class, 'psicologa_id');
    }

    // ====== ATRIBUTOS Y MÉTODOS DE NEGOCIO ======
    
    public function getTutorAttribute()
    {
        if (!$this->isEstudiante() || !$this->group_id || !$this->semestre) return null;

        return User::where('tipo', 'tutor')
            ->whereHas('tutorGroups', function ($q) {
                $q->where('group_id', $this->group_id)
                    ->where('semestre', $this->semestre);
            })
            ->select(['id', 'nombre', 'apellido_paterno', 'apellido_materno', 'email', 'foto_perfil'])
            ->first();
    }

    public function getPsychologistAttribute()
    {
        if (!$this->isEstudiante() || !$this->group_id || !$this->semestre) return null;

        return User::whereHas('tutorGroups', function ($q) {
            $q->where('group_id', $this->group_id)
                ->where('semestre', $this->semestre)
                ->where('tipo', 'psicologa');
        })->first();
    }

    public function getEstudiantesBySemestre($semestre = null)
    {
        if (!$this->isTutor()) return collect();

        $groupIds = $this->tutorGroups()
            ->when($semestre, function ($q) use ($semestre) {
                $q->where('semestre', $semestre);
            })
            ->pluck('group_id');

        return User::whereIn('group_id', $groupIds)
            ->where('tipo', 'estudiante')
            ->when($semestre, function ($q) use ($semestre) {
                $q->where('semestre', $semestre);
            })
            ->get();
    }

    public function getAllEstudiantesForPsychologist()
    {
        if (!$this->isPsicologa()) return collect();

        return User::where('tipo', 'estudiante')->get();
    }

    public function getGroupsBySemestre($semestre)
    {
        if (!$this->isTutor()) return collect();

        return $this->tutorGroups()
            ->with('group')
            ->where('semestre', $semestre)
            ->get()
            ->pluck('group');
    }

    public function getAllGroupsForPsychologist()
    {
        if (!$this->isPsicologa()) return collect();

        return Group::with(['students', 'tutorGroups.user'])->get();
    }

    public function getFotoPerfilUrlAttribute()
    {
        if (!$this->foto_perfil) return '/images/default-avatar.png';
        return url('storage/' . $this->foto_perfil);
    }

    public function getNombreCompletoAttribute()
    {
        return trim("{$this->nombre} {$this->apellido_paterno} {$this->apellido_materno}");
    }

    public function darDeBaja(string $motivo, string $fechaBaja, ?string $fechaReingreso = null, ?int $psicologaId = null): StudentDismissal
    {
        return StudentDismissal::create([
            'estudiante_id' => $this->id,
            'psicologa_id' => $psicologaId ?? auth()->user()?->id,
            'motivo' => $motivo,
            'fecha_baja' => $fechaBaja,
            'fecha_reingreso' => $fechaReingreso,
        ]);
    }
}