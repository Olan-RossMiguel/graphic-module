<?php

namespace App\Filament\Resources\TutorGroups\Pages;

use App\Filament\Resources\TutorGroups\TutorGroupResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditTutorGroup extends EditRecord
{
    protected static string $resource = TutorGroupResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
