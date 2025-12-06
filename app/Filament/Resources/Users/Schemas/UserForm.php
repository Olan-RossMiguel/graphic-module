<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Hash;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1) // Una sola columna principal
            ->components([
                Section::make('Información Personal')
                    ->schema([
                        FileUpload::make('foto_perfil')
                            ->label('Foto de Perfil')
                            ->image()
                            ->imageEditor()
                            ->circleCropper()
                            ->directory('profile-photos')
                            ->visibility('public')
                            ->columnSpanFull(),
                        
                        TextInput::make('numero_control')
                            ->label('Número de Control')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255),
                        
                        TextInput::make('nombre')
                            ->label('Nombre(s)')
                            ->required()
                            ->maxLength(255),
                        
                        TextInput::make('apellido_paterno')
                            ->label('Apellido Paterno')
                            ->required()
                            ->maxLength(255),
                        
                        TextInput::make('apellido_materno')
                            ->label('Apellido Materno')
                            ->maxLength(255),
                        
                        Select::make('genero')
                            ->label('Género')
                            ->options([
                                'masculino' => 'Masculino',
                                'femenino' => 'Femenino',
                            ])
                            ->required()
                            ->native(false),
                    ])
                    ->columns(2)
                    ->columnSpanFull(),

                Section::make('Información Académica')
                    ->schema([
                        TextInput::make('semestre')
                            ->label('Semestre')
                            ->numeric()
                            ->minValue(1)
                            ->maxValue(12),
                        
                        Select::make('group_id')
                            ->label('Grupo')
                            ->relationship('group', 'nombre')
                            ->searchable()
                            ->preload(),
                        
                        Select::make('nivel_academico')
                            ->label('Nivel Académico')
                            ->options([
                                'licenciatura' => 'Licenciatura',
                                'especialidad' => 'Especialidad',
                                'maestria' => 'Maestría',
                                'doctorado' => 'Doctorado',
                            ])
                            ->native(false),
                    ])
                    ->columns(3)
                    ->columnSpanFull(),

                Section::make('Información de Cuenta')
                    ->schema([
                        TextInput::make('email')
                            ->label('Email Personal')
                            ->email()
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255),
                        
                        TextInput::make('email_institucional')
                            ->label('Email Institucional')
                            ->email()
                            ->maxLength(255),
                        
                        DateTimePicker::make('email_verified_at')
                            ->label('Email Verificado')
                            ->displayFormat('d/m/Y H:i'),
                        
                        TextInput::make('password')
                            ->label('Contraseña')
                            ->password()
                            ->dehydrateStateUsing(fn ($state) => Hash::make($state))
                            ->dehydrated(fn ($state) => filled($state))
                            ->required(fn (string $context): bool => $context === 'create')
                            ->minLength(8)
                            ->maxLength(255)
                            ->revealable()
                            ->helperText('Mínimo 8 caracteres. Dejar en blanco para mantener la contraseña actual.'),
                        
                        Select::make('tipo')
                            ->label('Tipo de Usuario')
                            ->options([
                                'admin' => 'Administrador',
                                'tutor' => 'Tutor',
                                'psicologa' => 'Psicóloga',
                                'estudiante' => 'Estudiante',
                            ])
                            ->default('estudiante')
                            ->required()
                            ->native(false),
                    ])
                    ->columns(2)
                    ->columnSpanFull(),

                Section::make('Estado del Usuario')
                    ->schema([
                        Select::make('estado')
                            ->label('Estado')
                            ->options([
                                'activo' => 'Activo',
                                'inactivo' => 'Inactivo',
                                'baja_temporal' => 'Baja Temporal',
                                'baja_definitiva' => 'Baja Definitiva',
                            ])
                            ->default('activo')
                            ->required()
                            ->native(false)
                            ->live(),
                        
                        DateTimePicker::make('fecha_baja')
                            ->label('Fecha de Baja')
                            ->displayFormat('d/m/Y H:i')
                            ->visible(fn ($get) => 
                                in_array($get('estado'), ['baja_temporal', 'baja_definitiva'])
                            ),
                        
                        Textarea::make('motivo_baja')
                            ->label('Motivo de Baja')
                            ->rows(3)
                            ->columnSpanFull()
                            ->visible(fn ($get) => 
                                in_array($get('estado'), ['baja_temporal', 'baja_definitiva'])
                            ),
                    ])
                    ->columns(2)
                    ->columnSpanFull(),
            ]);
    }
}