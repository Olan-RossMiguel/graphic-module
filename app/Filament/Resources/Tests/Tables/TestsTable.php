<?php

namespace App\Filament\Resources\Tests\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class TestsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('nombre')
                    ->searchable()
                    ->sortable()
                    ->label('Nombre')
                    ->weight('bold'),
                
                TextColumn::make('tipo')
                    ->searchable()
                    ->sortable()
                    ->badge()
                    ->label('Tipo'),
                
                TextColumn::make('numero_preguntas')
                    ->numeric()
                    ->sortable()
                    ->label('N° Preguntas')
                    ->alignCenter(),
                
                TextColumn::make('questions_count')
                    ->counts('questions')
                    ->label('Preguntas Creadas')
                    ->badge()
                    ->color('success')
                    ->alignCenter(),
                
                TextColumn::make('created_at')
                    ->dateTime('d/m/Y')
                    ->sortable()
                    ->label('Creado')
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                
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
