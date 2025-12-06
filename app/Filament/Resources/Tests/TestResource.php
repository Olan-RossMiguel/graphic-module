<?php

namespace App\Filament\Resources\Tests;

use App\Filament\Resources\Tests\Pages\CreateTest;
use App\Filament\Resources\Tests\Pages\EditTest;
use App\Filament\Resources\Tests\Pages\ListTests;
use App\Filament\Resources\Tests\Schemas\TestForm;
use App\Filament\Resources\Tests\Tables\TestsTable;
use App\Models\Test;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class TestResource extends Resource
{
    protected static ?string $model = Test::class;
    
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedClipboardDocumentList;
    
    protected static ?string $navigationLabel = 'Tests';
    
    protected static ?string $modelLabel = 'Test';
    
    protected static ?string $pluralModelLabel = 'Tests';
    
    protected static string|UnitEnum|null $navigationGroup = 'Evaluaciones';

    public static function form(Schema $schema): Schema
    {
        return TestForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return TestsTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListTests::route('/'),
            'create' => CreateTest::route('/create'),
            'edit' => EditTest::route('/{record}/edit'),
        ];
    }
}