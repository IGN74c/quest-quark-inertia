import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getBoardIcon } from '@/lib/board-icons';
import { MoreVertical, Users } from 'lucide-react';

import { BoardData } from '@/types';

type BoardHeaderProps = {
    board: BoardData;
    isAdmin: boolean;
    onRename: () => void;
    onDelete: () => void;
    onUsers: () => void;
};

export function BoardHeader({
    board,
    isAdmin,
    onRename,
    onDelete,
    onUsers,
}: BoardHeaderProps) {
    const BoardIcon = getBoardIcon(board.icon);
    return (
        <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                    <BoardIcon className="h-5 w-5" />
                </span>
                <h1
                    className="cursor-pointer text-2xl font-bold tracking-tight transition-colors hover:text-primary"
                    onClick={() => isAdmin && onRename()}
                >
                    {board.title}
                </h1>
            </div>

            {isAdmin && (
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={onUsers}>
                        <Users className="mr-2 h-4 w-4" /> Участники
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={onRename}>
                                Переименовать
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={onDelete}
                            >
                                Удалить доску
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
        </div>
    );
}
