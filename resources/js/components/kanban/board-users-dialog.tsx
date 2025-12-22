import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { router } from '@inertiajs/react';
import { Trash2, Shield, User as UserIcon } from 'lucide-react';
import { User } from '@/types';

interface BoardUsersDialogProps {
    boardId: number;
    users: (User & { pivot: { role: string } })[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function BoardUsersDialog({ boardId, users, open, onOpenChange }: BoardUsersDialogProps) {
    
    const updateRole = (userId: number, role: string) => {
        router.patch(`/boards/${boardId}/users/${userId}`, { role }, {
            preserveScroll: true,
        });
    };

    const removeUser = (userId: number) => {
        if (confirm('Вы уверены, что хотите удалить пользователя из доски?')) {
            router.delete(`/boards/${boardId}/users/${userId}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Участники доски</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {users.map((user) => (
                        <div key={user.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent">
                                    <UserIcon className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium leading-none">{user.name}</p>
                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                {/* Админ не может изменить роль самому себе или удалить себя здесь */}
                                {user.pivot.role !== 'admin' ? (
                                    <>
                                        <Select
                                            defaultValue={user.pivot.role}
                                            onValueChange={(value) => updateRole(user.id, value)}
                                        >
                                            <SelectTrigger className="h-8 w-[110px] text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="editor">Редактор</SelectItem>
                                                <SelectItem value="viewer">Читатель</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8 text-destructive" 
                                            onClick={() => removeUser(user.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </>
                                ) : (
                                    <span className="flex items-center gap-1 text-xs font-semibold text-primary px-2">
                                        <Shield className="h-3 w-3" /> Администратор
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}