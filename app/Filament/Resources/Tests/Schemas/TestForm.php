<?php

namespace App\Filament\Resources\Tests\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\KeyValue;
use Filament\Schemas\Schema;

class TestForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->schema([
                TextInput::make('nombre')
                    ->required()
                    ->maxLength(255)
                    ->label('Nombre del Test')
                    ->columnSpanFull(),
                
                TextInput::make('tipo')
                    ->required()
                    ->maxLength(255)
                    ->label('Tipo de Test')
                    ->placeholder('Ej: Psicológico, Académico, etc.'),
                
                Textarea::make('descripcion')
                    ->label('Descripción')
                    ->rows(3)
                    ->columnSpanFull(),
                
                TextInput::make('numero_preguntas')
                    ->required()
                    ->numeric()
                    ->minValue(1)
                    ->label('Número de Preguntas')
                    ->default(10),
                
                KeyValue::make('dimensiones')
                    ->label('Dimensiones')
                    ->keyLabel('Dimensión')
                    ->valueLabel('Descripción')
                    ->required()
                    ->columnSpanFull(),
                
                KeyValue::make('configuracion_opciones')
                    ->label('Configuración de Opciones')
                    ->keyLabel('Opción')
                    ->valueLabel('Valor/Puntos')
                    ->columnSpanFull(),
            ]);
    }
}
