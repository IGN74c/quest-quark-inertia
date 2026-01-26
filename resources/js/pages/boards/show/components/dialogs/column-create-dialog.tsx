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
import { useForm } from '@inertiajs/react';

interface ColumnCreateDialogProps {
    boardId: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ColumnCreateDialog({
    boardId,
    open,
    onOpenChange,
}: ColumnCreateDialogProps) {
    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/boards/${boardId}/columns`, {
            onSuccess: () => {
                reset();
                onOpenChange(false);
            },
            preserveScroll: true,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>Добавить новую колонку</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="col-title">Название колонки</Label>
                            <Input
                                id="col-title"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                placeholder="Например: В работе"
                                autoFocus
                            />
                            {errors.title && (
                                <p className="text-xs text-destructive">
                                    {errors.title}
                                </p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Отмена
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Создать
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
