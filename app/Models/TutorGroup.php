<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TutorGroup extends Model
{
    use HasFactory;

    protected $fillable = [
        'group_id',
        'user_id',
        'rol',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relación con el grupo
     */
    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    /**
     * Relación con el usuario (tutor/psicóloga)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope para tutores
     */
    public function scopeTutors($query)
    {
        return $query->where('rol', 'tutor');
    }

    /**
     * Scope para psicólogas
     */
    public function scopePsychologists($query)
    {
        return $query->where('rol', 'psicologa');
    }

}
