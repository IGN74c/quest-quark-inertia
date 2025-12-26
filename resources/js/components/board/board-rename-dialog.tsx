import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { BoardData } from '@/types';

interface BoardRenameDialogProps {
    board: BoardData;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function BoardRenameDialog({ board, open, onOpenChange }: BoardRenameDialogProps) {
    const [title, setTitle] = useState(board.title);
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        if (title.trim() === '' || title === board.title) {
            onOpenChange(false);
            return;
        }

        setLoading(true);
        router.patch(
            `/boards/${board.id}`,
            { title: title.trim() },
            {
                preserveScroll: true,
                onSuccess: () => onOpenChange(false),
                onFinish: () => setLoading(false),
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Переименовать доску</DialogTitle>
                </DialogHeader>
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Отмена
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        Сохранить
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}