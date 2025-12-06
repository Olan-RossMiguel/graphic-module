<?php

namespace App\Filament\Resources\Questions\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\KeyValue;
use Filament\Schemas\Schema;

class QuestionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
              ->schema([
                Select::make('test_id')
                    ->relationship('test', 'nombre')
                    ->required()
                    ->searchable()
                    ->preload()
                    ->label('Test')
                    ->columnSpanFull(),
                
                TextInput::make('numero_pregunta')
                    ->required()
                    ->numeric()
                    ->minValue(1)
                    ->label('Número de Pregunta'),
                
                TextInput::make('categoria')
                    ->required()
                    ->maxLength(255)
                    ->label('Categoría')
                    ->placeholder('Ej: Autoestima, Depresión, etc.'),
                
                Textarea::make('texto_pregunta')
                    ->required()
                    ->label('Texto de la Pregunta')
                    ->rows(3)
                    ->columnSpanFull(),
                
                Select::make('tipo_respuesta')
                    ->options([
                        'opcion_multiple' => 'Opción Múltiple',
                    ])
                    ->default('opcion_multiple')
                    ->required()
                    ->label('Tipo de Respuesta'),
                
                KeyValue::make('opciones')
                    ->label('Opciones de Respuesta')
                    ->keyLabel('Valor')
                    ->valueLabel('Texto de la Opción')
                    ->required()
                    ->columnSpanFull()
                    ->helperText('Define las opciones de respuesta (Ej: 1 => "Nunca", 2 => "A veces", etc.)'),
                
                TextInput::make('puntuacion')
                    ->required()
                    ->numeric()
                    ->default(1)
                    ->minValue(1)
                    ->label('Puntuación'),
            ]);
    }
}
