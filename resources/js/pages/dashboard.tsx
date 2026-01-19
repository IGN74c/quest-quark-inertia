import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import boardsRoute from '@/routes/boards';
import { User, type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ClipboardList, Plus, TrendingUp, UserPlus, Users } from 'lucide-react';
import { useState } from 'react';

interface Board {
    id: number;
    title: string;
    pivot?: { role: string };
    columns: Array<{ tasks: Task[] }>;
    users: User[];
}

interface Task {
    id: number;
    title: string;
    completed?: boolean;
}

interface DashboardProps {
    boards: Board[];
    stats: {
        total_boards: number;
        total_tasks: number;
        total_members: number;
    };
}

export default function Dashboard({ boards = [], stats }: DashboardProps) {
    const [open, setOpen] = useState(false);
    const [inviteOpen, setInviteOpen] = useState(false);
    const [selectedBoard, setSelectedBoard] = useState<number | null>(null);

    const { data, setData, post, reset, errors, processing } = useForm({
        title: '',
    });
    const inviteForm = useForm({ email: '' });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(boardsRoute.store().url, {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    };

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBoard) return;

        inviteForm.post(boardsRoute.invite(selectedBoard).url, {
            onSuccess: () => {
                setInviteOpen(false);
                setSelectedBoard(null);
                inviteForm.reset();
            },
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Статистика */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Доски
                                    </p>
                                    <p className="mt-2 text-2xl font-bold">
                                        {stats.total_boards}
                                    </p>
                                </div>
                                <ClipboardList className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Всего задач
                                    </p>
                                    <p className="mt-2 text-2xl font-bold">
                                        {stats.total_tasks}
                                    </p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Участники
                                    </p>
                                    <p className="mt-2 text-2xl font-bold">
                                        {stats.total_members}
                                    </p>
                                </div>
                                <Users className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Список досок */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Мои доски</h1>
                    <Button size="sm" onClick={() => setOpen(true)}>
                        <Plus className="h-4 w-4" />
                        Создать доску
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {boards.map((board) => {
                        const totalTasks = board.columns.reduce(
                            (sum, col) => sum + col.tasks.length,
                            0,
                        );

                        return (
                            <div
                                key={board.id}
                                className="group relative overflow-hidden rounded-xl border bg-card transition-all hover:shadow-lg"
                            >
                                <Link
                                    href={boardsRoute.show(board.id).url}
                                    className="absolute inset-0 z-10"
                                />

                                <div className="relative aspect-video p-6">
                                    <div className="mb-8 flex items-start justify-between">
                                        <h3 className="relative z-20 text-lg font-bold text-card-foreground">
                                            {board.title}
                                        </h3>
                                        {board.pivot?.role === 'admin' && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="z-20 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setSelectedBoard(board.id);
                                                    setInviteOpen(true);
                                                }}
                                            >
                                                <UserPlus className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>

                                    <div className="absolute right-4 bottom-4 left-4 z-20 space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Задачи
                                            </span>
                                            <span className="font-medium">
                                                {totalTasks}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <Badge
                                                variant="secondary"
                                                className="text-[10px]"
                                            >
                                                {board.pivot?.role ||
                                                    'участник'}
                                            </Badge>
                                            <span className="text-muted-foreground">
                                                {board.users.length}{' '}
                                                {board.users.length === 1
                                                    ? 'участник'
                                                    : 'участников'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Кнопка создания новой доски */}
                    <button
                        onClick={() => setOpen(true)}
                        className="flex aspect-video flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/25 transition-all hover:border-muted-foreground/50 hover:bg-accent/50"
                    >
                        <Plus className="mb-3 h-10 w-10 text-muted-foreground" />
                        <span className="text font-medium text-muted-foreground">
                            Новая доска
                        </span>
                    </button>
                </div>
            </div>

            {/* Модалка создания доски (УСЛОВИЕ УБРАНО) */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <form onSubmit={submit}>
                        <DialogHeader>
                            <DialogTitle>Новая доска</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2 py-4">
                            <Label>Название</Label>
                            <Input
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                autoFocus
                            />
                            {errors.title && (
                                <p className="text-sm text-destructive">
                                    {errors.title}
                                </p>
                            )}
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={processing}>
                                Создать
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Модалка приглашения пользователя */}
            <Dialog
                open={inviteOpen}
                onOpenChange={(val) => {
                    setInviteOpen(val);
                    if (!val) setSelectedBoard(null);
                }}
            >
                <DialogContent>
                    <form onSubmit={handleInvite}>
                        <DialogHeader>
                            <DialogTitle>Пригласить пользователя</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Email пользователя</Label>
                                <Input
                                    type="email"
                                    value={inviteForm.data.email}
                                    onChange={(e) =>
                                        inviteForm.setData(
                                            'email',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="user@example.com"
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={inviteForm.processing}
                            >
                                Отправить приглашение
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
