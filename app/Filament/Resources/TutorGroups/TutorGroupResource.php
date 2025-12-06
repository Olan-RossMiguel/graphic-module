<?php

namespace App\Filament\Resources\TutorGroups;

use App\Filament\Resources\TutorGroups\Pages\CreateTutorGroup;
use App\Filament\Resources\TutorGroups\Pages\EditTutorGroup;
use App\Filament\Resources\TutorGroups\Pages\ListTutorGroups;
use App\Filament\Resources\TutorGroups\Schemas\TutorGroupForm;
use App\Filament\Resources\TutorGroups\Tables\TutorGroupsTable;
use App\Models\TutorGroup;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class TutorGroupResource extends Resource
{
    protected static ?string $model = TutorGroup::class;
    
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedAcademicCap;
    
    protected static ?string $navigationLabel = 'Asignaciones';
    
    protected static ?string $modelLabel = 'Asignación';
    
    protected static ?string $pluralModelLabel = 'Asignaciones';
    
    protected static string|UnitEnum|null $navigationGroup = 'Gestión Académica';

    public static function form(Schema $schema): Schema
    {
        return TutorGroupForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return TutorGroupsTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListTutorGroups::route('/'),
            'create' => CreateTutorGroup::route('/create'),
            'edit' => EditTutorGroup::route('/{record}/edit'),
        ];
    }
}