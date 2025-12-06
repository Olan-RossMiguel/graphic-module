<?php

namespace App\Filament\Resources\StudentDismissals\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class StudentDismissalForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                Select::make('estudiante_id')
                    ->label('Estudiante')
                    ->relationship(
                        name: 'estudiante',
                        titleAttribute: 'nombre',
                        modifyQueryUsing: fn ($query) => $query->where('estado', 'activo')
                    )
                    ->getOptionLabelFromRecordUsing(fn ($record) => 
                        trim($record->nombre . ' ' . 
                             $record->apellido_paterno . ' ' . 
                             $record->apellido_materno) . 
                        ' (' . $record->numero_control . ')'
                    )
                    ->getSearchResultsUsing(function (string $search) {
                        return User::where('tipo', 'estudiante')
                            ->where('estado', 'activo')
                            ->where(function ($query) use ($search) {
                                $query->where('nombre', 'like', "%{$search}%")
                                    ->orWhere('apellido_paterno', 'like', "%{$search}%")
                                    ->orWhere('apellido_materno', 'like', "%{$search}%")
                                    ->orWhere('numero_control', 'like', "%{$search}%");
                            })
                            ->limit(50)
                            ->get()
                            ->mapWithKeys(fn ($user) => [
                                $user->id => trim($user->nombre . ' ' . 
                                    $user->apellido_paterno . ' ' . 
                                    $user->apellido_materno) . 
                                    ' (' . $user->numero_control . ')'
                            ]);
                    })
                    ->getOptionLabelUsing(function ($value) {
                        $user = User::find($value);
                        if (!$user) return $value;
                        
                        return trim($user->nombre . ' ' . 
                            $user->apellido_paterno . ' ' . 
                            $user->apellido_materno) . 
                            ' (' . $user->numero_control . ')';
                    })
                    ->searchable()
                    ->preload()
                    ->required()
                    ->columnSpanFull(),
                
                Select::make('psicologa_id')
                    ->label('Psicóloga Responsable')
                    ->relationship(
                        name: 'psicologa',
                        titleAttribute: 'nombre',
                        modifyQueryUsing: fn ($query) => $query->where('tipo', 'psicologa')
                    )
                    ->getOptionLabelFromRecordUsing(fn ($record) => 
                        trim($record->nombre . ' ' . 
                             $record->apellido_paterno . ' ' . 
                             $record->apellido_materno)
                    )
                    ->searchable(['nombre', 'apellido_paterno', 'apellido_materno'])
                    ->preload()
                    ->required()
                    ->default(fn () => Auth::id())
                    ->columnSpanFull(),
                
                DatePicker::make('fecha_baja')
                    ->label('Fecha de Baja')
                    ->required()
                    ->native(false)
                    ->displayFormat('d/m/Y')
                    ->default(now())
                    ->maxDate(now())
                    ->live()
                    ->columnSpanFull(),
                
                DatePicker::make('fecha_reingreso')
                    ->label('Fecha de Reingreso (Opcional)')
                    ->native(false)
                    ->displayFormat('d/m/Y')
                    ->helperText('Dejar vacío para BAJA DEFINITIVA. Con fecha = BAJA TEMPORAL.')
                    ->minDate(fn ($get) => $get('fecha_baja') ?: now())
                    ->live()
                    ->columnSpanFull(),
                
                TextInput::make('tipo_baja_calculado')
                    ->label('Tipo de Baja')
                    ->disabled()
                    ->dehydrated(false)
                    ->default(function ($get) {
                        return $get('fecha_reingreso') 
                            ? '🟡 BAJA TEMPORAL' 
                            : '🔴 BAJA DEFINITIVA';
                    })
                    ->live()
                    ->columnSpanFull(),
                
                Textarea::make('motivo')
                    ->label('Motivo de la Baja')
                    ->required()
                    ->rows(4)
                    ->maxLength(65535)
                    ->columnSpanFull(),
            ]);
    }
}