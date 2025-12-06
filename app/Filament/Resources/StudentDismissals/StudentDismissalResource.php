<?php

namespace App\Filament\Resources\StudentDismissals;

use App\Filament\Resources\StudentDismissals\Pages\CreateStudentDismissal;
use App\Filament\Resources\StudentDismissals\Pages\EditStudentDismissal;
use App\Filament\Resources\StudentDismissals\Pages\ListStudentDismissals;
use App\Filament\Resources\StudentDismissals\Schemas\StudentDismissalForm;
use App\Filament\Resources\StudentDismissals\Tables\StudentDismissalsTable;
use App\Models\StudentDismissal;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class StudentDismissalResource extends Resource
{
    protected static ?string $model = StudentDismissal::class;
    
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedUserMinus;
    
    protected static ?string $navigationLabel = 'Bajas de Estudiantes';
    
    protected static ?string $modelLabel = 'Baja';
    
    protected static ?string $pluralModelLabel = 'Bajas';
    
    protected static string|UnitEnum|null $navigationGroup = 'Gestión Académica';

    public static function form(Schema $schema): Schema
    {
        return StudentDismissalForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return StudentDismissalsTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListStudentDismissals::route('/'),
            'create' => CreateStudentDismissal::route('/create'),
            'edit' => EditStudentDismissal::route('/{record}/edit'),
        ];
    }
}
