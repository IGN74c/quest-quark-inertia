import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { BoardData } from '@/types';
import { router } from '@inertiajs/react';

interface BoardDeleteDialogProps {
    board: BoardData;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function BoardDeleteDialog({
    board,
    open,
    onOpenChange,
}: BoardDeleteDialogProps) {
    const handleDelete = () => {
        router.delete(`/boards/${board.id}`, {
            onSuccess: () => {
                // Можно очистить store или редирект произойдёт автоматически
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Удалить доску?</DialogTitle>
                    <DialogDescription>
                        Доска «{board.title}» и все её колонки и задачи будут
                        удалены безвозвратно.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Отмена
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        Удалить
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
