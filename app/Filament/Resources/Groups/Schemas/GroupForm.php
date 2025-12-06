<?php

namespace App\Filament\Resources\Groups\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class GroupForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
             ->schema([
                TextInput::make('nombre')
                    ->required()
                    ->maxLength(255)
                    ->label('Nombre del Grupo')
                    ->placeholder('Ej: 5A, Grupo 1, etc.')
                    ->columnSpanFull(),
            ]);
    }
}
