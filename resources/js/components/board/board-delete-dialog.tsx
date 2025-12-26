import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { BoardData } from '@/types';

interface BoardDeleteDialogProps {
    board: BoardData;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function BoardDeleteDialog({ board, open, onOpenChange }: BoardDeleteDialogProps) {
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
                        Доска «{board.title}» и все её колонки и задачи будут удалены безвозвратно.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
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