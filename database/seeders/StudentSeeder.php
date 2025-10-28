<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    public function run(): void
    {

        $studentsPerSemester = 13;
        $remaining = 3;

        for ($semestre = 1; $semestre <= 9; $semestre++) {
            $count = $studentsPerSemester + ($semestre <= $remaining ? 1 : 0);
            User::factory()
                ->count($count)
                ->state(['semestre' => $semestre])
                ->create();
        }
    }
}
