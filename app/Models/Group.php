<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    public function tutorGroups()
{
    return $this->hasMany(TutorGroup::class);
}

public function tutors()
{
    return $this->belongsToMany(User::class, 'tutor_groups', 'group_id', 'user_id')
        ->wherePivot('rol', 'tutor')
        ->withTimestamps();
}

public function psychologists()
{
    return $this->belongsToMany(User::class, 'tutor_groups', 'group_id', 'user_id')
        ->wherePivot('rol', 'psicologa')
        ->withTimestamps();
}
}
