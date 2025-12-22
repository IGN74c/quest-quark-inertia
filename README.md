## Схемы таблиц
```php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->string('password');
    $table->rememberToken();
    $table->timestamps();
});
Schema::create('boards', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->foreignIdFor(User::class);
    $table->timestamps();
});
Schema::create('board_users', function (Blueprint $table) {
    $table->id();
    $table->foreignIdFor(Board::class);
    $table->foreignIdFor(User::class);
    $table->enum('role', ['admin', 'editor', 'viewer']);
    $table->timestamps();
});
Schema::create('columns', function (Blueprint $table) {
    $table->id();
    $table->foreignIdFor(Board::class);
    $table->string('title');
    $table->integer('position');
    $table->timestamps();
});
Schema::create('tasks', function (Blueprint $table) {
    $table->id();
    $table->foreignIdFor(Column::class)->constrained();
    $table->foreignIdFor(User::class, 'creator_id')->constrained();
    $table->foreignIdFor(User::class, 'assignee_id')->nullable()->constrained();
    $table->string('title');
    $table->text('description');
    $table->integer('position');
    $table->timestamps();
});
```
## Основные компоненты проекта (шаблон проекта) inertia js, shadcn ui
```ts
//app-layout.tsx
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}
export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        {children}
    </AppLayoutTemplate>
);
// app-sidebar-layout.tsx
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';
export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
// @types
import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';
export interface Board {
    id: number;
    title: string;
}
export interface Auth {
    user: User;
    boards: Board[];
}
export interface BreadcrumbItem {
    title: string;
    href: string;
}
export interface NavGroup {
    title: string;
    items: NavItem[];
}
export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}
export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}
export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}
```
## Зависимости
```json
// package.json
"devDependencies": {
    "@eslint/js": "^9.19.0",
    "@laravel/vite-plugin-wayfinder": "^0.1.3",
    "@types/node": "^22.13.5",
    "babel-plugin-react-compiler": "^1.0.0",
    "eslint": "^9.17.0",
    "eslint-config-prettier": "^10.0.1",
    "eslint-plugin-react": "^7.37.3",
    "eslint-plugin-react-hooks": "^7.0.0",
    "prettier": "^3.4.2",
    "prettier-plugin-organize-imports": "^4.1.0",
    "prettier-plugin-tailwindcss": "^0.6.11",
    "typescript-eslint": "^8.23.0"
},
"dependencies": {
    "@dnd-kit/core": "^6.3.1",
    "@dnd-kit/modifiers": "^9.0.0",
    "@dnd-kit/sortable": "^10.0.0",
    "@headlessui/react": "^2.2.0",
    "@inertiajs/react": "^2.1.4",
    "@radix-ui/react-avatar": "^1.1.3",
    "@radix-ui/react-checkbox": "^1.1.4",
    "@radix-ui/react-collapsible": "^1.1.3",
    "@radix-ui/react-dialog": "^1.1.6",
    "@radix-ui/react-dropdown-menu": "^2.1.6",
    "@radix-ui/react-label": "^2.1.2",
    "@radix-ui/react-navigation-menu": "^1.2.5",
    "@radix-ui/react-select": "^2.1.6",
    "@radix-ui/react-separator": "^1.1.2",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-toggle": "^1.1.2",
    "@radix-ui/react-toggle-group": "^1.1.2",
    "@radix-ui/react-tooltip": "^1.1.8",
    "@tailwindcss/vite": "^4.1.11",
    "@types/react": "^19.2.0",
    "@types/react-dom": "^19.2.0",
    "@vitejs/plugin-react": "^5.0.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "concurrently": "^9.0.1",
    "globals": "^15.14.0",
    "input-otp": "^1.4.2",
    "laravel-vite-plugin": "^2.0",
    "lucide-react": "^0.475.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "tailwind-merge": "^3.0.1",
    "tailwindcss": "^4.0.0",
    "tw-animate-css": "^1.4.0",
    "typescript": "^5.7.2",
    "vite": "^7.0.4"
}
// composer.json
"require": {
    "php": "^8.2",
    "inertiajs/inertia-laravel": "^2.0",
    "laravel/fortify": "^1.30",
    "laravel/framework": "^12.0",
    "laravel/tinker": "^2.10.1",
    "laravel/wayfinder": "^0.1.9"
},
"require-dev": {
    "fakerphp/faker": "^1.23",
    "laravel/pail": "^1.2.2",
    "laravel/pint": "^1.24",
    "laravel/sail": "^1.41",
    "mockery/mockery": "^1.6",
    "nunomaduro/collision": "^8.6",
    "pestphp/pest": "^4.2",
    "pestphp/pest-plugin-laravel": "^4.0"
}
```
## Маршруты
```php
Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    // --- Доски (Boards) ---
    Route::get('/boards/{board}', [BoardController::class, 'show'])->name('boards.show');
    Route::post('/boards', [BoardController::class, 'store'])->name('boards.store');
    Route::delete('/boards/{board}', [BoardController::class, 'destroy'])->name('boards.destroy');
    // --- Колонки (Columns) ---
    Route::post('/boards/{board}/columns', [ColumnController::class, 'store'])->name('columns.store');
    Route::delete('/columns/{column}', [ColumnController::class, 'destroy'])->name('columns.destroy');
    Route::patch('/columns/{column}/move', [TaskMovementController::class, 'moveColumn'])->name('columns.move');
    // --- Задачи (Tasks) ---
    Route::post('/columns/{column}/tasks', [TaskController::class, 'store'])->name('tasks.store');
    Route::patch('/tasks/{task}', [TaskController::class, 'update'])->name('tasks.update');
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');
    Route::patch('/tasks/{task}/move', [TaskMovementController::class, 'move'])->name('tasks.move');
});
```