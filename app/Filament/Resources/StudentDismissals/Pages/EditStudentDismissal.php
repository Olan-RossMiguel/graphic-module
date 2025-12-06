<?php

namespace App\Filament\Resources\StudentDismissals\Pages;

use App\Filament\Resources\StudentDismissals\StudentDismissalResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditStudentDismissal extends EditRecord
{
    protected static string $resource = StudentDismissalResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
