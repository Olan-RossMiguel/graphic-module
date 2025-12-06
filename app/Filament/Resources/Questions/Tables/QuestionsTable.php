<?php

namespace App\Filament\Resources\Questions\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class QuestionsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('test.nombre')
                    ->label('Test')
                    ->searchable()
                    ->sortable(),
                
                TextColumn::make('numero_pregunta')
                    ->label('N°')
                    ->sortable()
                    ->alignCenter(),
                
                TextColumn::make('texto_pregunta')
                    ->label('Pregunta')
                    ->searchable()
                    ->limit(50)
                    ->wrap(),
                
                TextColumn::make('categoria')
                    ->label('Categoría')
                    ->searchable()
                    ->badge()
                    ->color('info'),
                
                TextColumn::make('tipo_respuesta')
                    ->label('Tipo')
                    ->badge(),
                
                TextColumn::make('puntuacion')
                    ->label('Puntos')
                    ->alignCenter()
                    ->sortable(),
            ])

            ->filters([
                SelectFilter::make('test_id')
                    ->relationship('test', 'nombre')
                    ->label('Test'),
                SelectFilter::make('categoria')
                    ->label('Categoría'),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
