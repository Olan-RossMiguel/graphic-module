<?php

namespace App\Filament\Resources\TutorGroups\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class TutorGroupsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user.nombre_completo')
                    ->label('Tutor/Psicóloga')
                    ->searchable(['nombre', 'apellido_paterno', 'apellido_materno'])
                    ->sortable(),
                
                TextColumn::make('user.tipo')
                    ->label('Tipo')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'tutor' => 'info',
                        'psicologa' => 'success',
                        default => 'gray',
                    }),
                
                TextColumn::make('group.nombre')
                    ->label('Grupo')
                    ->searchable()
                    ->sortable(),
                
                TextColumn::make('semestre')
                    ->label('Semestre')
                    ->sortable()
                    ->badge()
                    ->color('warning'),
                
                TextColumn::make('created_at')
                    ->dateTime('d/m/Y')
                    ->sortable()
                    ->label('Asignado')
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
             ->filters([
                SelectFilter::make('semestre')
                    ->options([
                        1 => 'Semestre 1',
                        2 => 'Semestre 2',
                        3 => 'Semestre 3',
                        4 => 'Semestre 4',
                        5 => 'Semestre 5',
                        6 => 'Semestre 6',
                        7 => 'Semestre 7',
                        8 => 'Semestre 8',
                        9 => 'Semestre 9',
                    ]),
                SelectFilter::make('tipo')
                    ->relationship('user', 'tipo')
                    ->label('Tipo de Usuario'),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
                
            ])
               ->defaultSort('semestre', 'desc');
            
    }
}
