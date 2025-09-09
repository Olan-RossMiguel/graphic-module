<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
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

    public function isStudent()
    {
        return $this->role === 'student';
    }

    public function isTutor()
    {
        return $this->role === 'tutor';
    }

    public function isPsychologist()
    {
        return $this->role === 'psychologist';
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function tutorGroups()
{
    return $this->hasMany(TutorGroup::class);
}

public function assignedGroups()
{
    return $this->belongsToMany(Group::class, 'tutor_groups', 'user_id', 'group_id')
        ->withPivot('rol')
        ->withTimestamps();
}
}
