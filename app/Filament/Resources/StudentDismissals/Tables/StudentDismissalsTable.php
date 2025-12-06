<?php

namespace App\Filament\Resources\StudentDismissals\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Table;
use Filament\Forms\Components\DatePicker;
use Illuminate\Database\Eloquent\Builder;

class StudentDismissalsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('estudiante.nombre')
                    ->label('Estudiante')
                    ->searchable(['nombre', 'apellido_paterno', 'apellido_materno'])
                    ->sortable()
                    ->formatStateUsing(
                        fn($record) =>
                        trim($record->estudiante->nombre . ' ' .
                            $record->estudiante->apellido_paterno . ' ' .
                            $record->estudiante->apellido_materno)
                    ),

                TextColumn::make('estudiante.numero_control')
                    ->label('No. Control')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('psicologa.nombre')
                    ->label('Psicóloga')
                    ->sortable()
                    ->formatStateUsing(
                        fn($record) =>
                        trim($record->psicologa->nombre . ' ' .
                            $record->psicologa->apellido_paterno . ' ' .
                            $record->psicologa->apellido_materno)
                    )
                    ->toggleable(),

                TextColumn::make('fecha_baja')
                    ->label('Fecha de Baja')
                    ->date('d/M/Y')
                    ->sortable()
                    ->badge()
                    ->color('danger'),

                TextColumn::make('fecha_reingreso')
                    ->label('Fecha de Reingreso')
                    ->date('d/M/Y')
                    ->sortable()
                    ->badge()
                    ->color('success')
                    ->placeholder('Pendiente')
                    ->formatStateUsing(fn($state) => $state ? $state->format('d/M/Y') : 'Sin reingreso'),

                IconColumn::make('activo')
                    ->label('Estado')
                    ->boolean()
                    ->getStateUsing(fn($record) => $record->fecha_reingreso !== null)
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-x-circle')
                    ->trueColor('success')
                    ->falseColor('danger')
                    ->label('Reingresado'),

                TextColumn::make('motivo')
                    ->label('Motivo')
                    ->limit(50)
                    ->tooltip(fn($record) => $record->motivo)
                    ->searchable()
                    ->toggleable(),

                TextColumn::make('created_at')
                    ->label('Registrado')
                    ->dateTime('d/M/Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('estudiante_id')
                    ->label('Estudiante')
                    ->relationship('estudiante', 'nombre')
                    ->getOptionLabelFromRecordUsing(
                        fn($record) =>
                        trim($record->nombre . ' ' .
                            $record->apellido_paterno . ' ' .
                            $record->apellido_materno) .
                            ' (' . $record->numero_control . ')'
                    )
                    ->searchable(['nombre', 'apellido_paterno', 'apellido_materno', 'numero_control'])
                    ->preload(),

                SelectFilter::make('psicologa_id')
                    ->label('Psicóloga')
                    ->relationship('psicologa', 'nombre')
                    ->getOptionLabelFromRecordUsing(
                        fn($record) =>
                        trim($record->nombre . ' ' .
                            $record->apellido_paterno . ' ' .
                            $record->apellido_materno)
                    )
                    ->searchable(['nombre', 'apellido_paterno', 'apellido_materno'])
                    ->preload(),

                Filter::make('con_reingreso')
                    ->query(fn(Builder $query): Builder => $query->whereNotNull('fecha_reingreso'))
                    ->label('Con Reingreso'),

                Filter::make('sin_reingreso')
                    ->query(fn(Builder $query): Builder => $query->whereNull('fecha_reingreso'))
                    ->label('Sin Reingreso'),

                Filter::make('fecha_baja')
                    ->schema([
                        DatePicker::make('desde')
                            ->label('Desde'),
                        DatePicker::make('hasta')
                            ->label('Hasta'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['desde'] ?? null,
                                fn(Builder $query, $date): Builder => $query->whereDate('fecha_baja', '>=', $date),
                            )
                            ->when(
                                $data['hasta'] ?? null,
                                fn(Builder $query, $date): Builder => $query->whereDate('fecha_baja', '<=', $date),
                            );
                    }),
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('fecha_baja', 'desc');
    }
}
