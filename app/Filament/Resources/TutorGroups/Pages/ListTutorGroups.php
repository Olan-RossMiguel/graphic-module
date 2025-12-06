<?php

namespace App\Filament\Resources\TutorGroups\Pages;

use App\Filament\Resources\TutorGroups\TutorGroupResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListTutorGroups extends ListRecords
{
    protected static string $resource = TutorGroupResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
