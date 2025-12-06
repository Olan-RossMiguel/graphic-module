<?php

namespace App\Filament\Resources\TutorGroups\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Schemas\Schema;

class TutorGroupForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Select::make('user_id')
                    ->relationship('user', 'nombre', function ($query) {
                        return $query->whereIn('tipo', ['tutor', 'psicologa']);
                    })
                    ->required()
                    ->searchable()
                    ->preload()
                    ->label('Tutor/Psicóloga')
                    ->getOptionLabelFromRecordUsing(fn ($record) => 
                        trim("{$record->nombre} {$record->apellido_paterno} {$record->apellido_materno}") . " ({$record->tipo})"
                    ),
                
                Select::make('group_id')
                    ->relationship('group', 'nombre')
                    ->required()
                    ->searchable()
                    ->preload()
                    ->label('Grupo'),
                
                TextInput::make('semestre')
                    ->numeric()
                    ->required()
                    ->minValue(1)
                    ->maxValue(9)
                    ->label('Semestre')
                    ->default(1),
            ]);
    }
}
