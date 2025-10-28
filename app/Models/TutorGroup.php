<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TutorGroup extends Model
{
    use HasFactory;

    protected $fillable = [
        'group_id',
        'user_id', 
        'semestre'
    ];

    protected $casts = [
        'semestre' => 'integer'
    ];

    // Relación con el grupo
    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    // Relación con el usuario (tutor o psicóloga)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Scope para filtrar por semestre
    public function scopeBySemestre($query, $semestre)
    {
        return $query->where('semestre', $semestre);
    }

    // Scope para filtrar por usuario
    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    // Scope para tutores
    public function scopeTutors($query)
    {
        return $query->whereHas('user', function($q) {
            $q->where('tipo', 'tutor');
        });
    }

    // Scope para psicólogas
    public function scopePsychologists($query)
    {
        return $query->whereHas('user', function($q) {
            $q->where('tipo', 'psicologa');
        });
    }
}