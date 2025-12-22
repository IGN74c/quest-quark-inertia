<?php

namespace Database\Seeders;

use App\Models\Board;
use App\Models\Column;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Создаем/получаем главного пользователя

        $testUser = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'IGN test',
                'password' => Hash::make('test'),
            ]
        );

        $user = User::firstOrCreate(
            ['email' => 'ign@example.com'],
            [
                'name' => 'IGN',
                'password' => Hash::make('123'),
            ]
        );
        // 2. Создаем основную доску
        $board = Board::create([
            'title' => 'Рабочий проект',
            'user_id' => $user->id,
        ]);

        // Привязываем пользователя к доске через pivot таблицу
        $board->users()->attach($user->id, ['role' => 'admin']);
        $board->users()->attach($testUser->id, ['role' => 'viewer']);

        // 3. Структура колонок
        $columns = [
            ['title' => 'Бэклог', 'position' => 0],
            ['title' => 'В работе', 'position' => 1],
            ['title' => 'Готово', 'position' => 2],
        ];

        foreach ($columns as $colData) {
            $column = Column::create([
                'board_id' => $board->id,
                'title' => $colData['title'],
                'position' => $colData['position'],
            ]);

            // 4. Генерируем задачи для каждой колонки
            $taskCount = $column->title === 'Бэклог' ? 5 : 2;

            for ($i = 0; $i < $taskCount; $i++) {
                Task::create([
                    'column_id' => $column->id,
                    'creator_id' => $user->id,
                    'assignee_id' => $user->id,
                    'title' => "Задача #" . ($i + 1) . " в колонке {$column->title}",
                    'description' => "Описание для тестовой задачи " . ($i + 1),
                    'position' => $i,
                ]);
            }
        }
    }
}