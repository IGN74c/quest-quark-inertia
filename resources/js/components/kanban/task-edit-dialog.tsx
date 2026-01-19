import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import tasksRoute from '@/routes/tasks';
import { SharedData, Task, type User as UserType } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { Trash2, User } from 'lucide-react';

interface TaskEditDialogProps {
    task: Task;
    boardUsers: UserType[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function TaskEditDialog({
    task,
    boardUsers,
    open,
    onOpenChange,
}: TaskEditDialogProps) {
    const { auth } = usePage<SharedData>().props;

    const {
        data,
        setData,
        patch,
        delete: destroy,
        processing,
        errors,
    } = useForm({
        title: task.title || '',
        description: task.description || '',
        assignee_id: task.assignee_id ? String(task.assignee_id) : 'none',
    });

    const canDelete =
        auth.user.id === task.creator_id
    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            title: data.title,
            description: data.description,
            assignee_id:
                data.assignee_id === 'none' ? null : Number(data.assignee_id),
        };

        patch(tasksRoute.update(task.id).url, {
            ...payload,
            onSuccess: () => onOpenChange(false),
            preserveScroll: true,
        } as any);
    };

    const handleDelete = () => {
        if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
            destroy(tasksRoute.destroy(task.id).url, {
                onSuccess: () => onOpenChange(false),
                preserveScroll: true,
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>Редактирование задачи</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        {/* Название */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Название</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                placeholder="Что нужно сделать?"
                            />
                            {errors.title && (
                                <p className="text-xs text-destructive">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        {/* Описание */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Описание</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                placeholder="Добавьте деталей..."
                                className="min-h-[100px]"
                            />
                        </div>

                        {/* Исполнитель */}
                        <div className="space-y-2">
                            <Label>Исполнитель</Label>
                            <Select
                                value={data.assignee_id}
                                onValueChange={(value) =>
                                    setData('assignee_id', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Назначить пользователя" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">
                                        <span className="flex items-center text-muted-foreground">
                                            <User className="mr-2 h-4 w-4" />{' '}
                                            Без исполнителя
                                        </span>
                                    </SelectItem>
                                    {boardUsers?.map((user) => (
                                        <SelectItem
                                            key={user.id}
                                            value={String(user.id)}
                                        >
                                            <span className="flex items-center">
                                                <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px]">
                                                    {user.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                                {user.name}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter className="flex items-center justify-between sm:justify-between">
                        <div>
                            {canDelete && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:bg-destructive/10"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Отмена
                            </Button>
                            <Button type="submit" disabled={processing}>
                                Сохранить
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
