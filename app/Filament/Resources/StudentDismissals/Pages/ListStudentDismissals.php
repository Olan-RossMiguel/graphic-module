<?php

namespace App\Filament\Resources\StudentDismissals\Pages;

use App\Filament\Resources\StudentDismissals\StudentDismissalResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListStudentDismissals extends ListRecords
{
    protected static string $resource = StudentDismissalResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
