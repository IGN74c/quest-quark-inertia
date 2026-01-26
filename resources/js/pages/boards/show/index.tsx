import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

import AppLayout from '@/layouts/app-layout';
import { useBoardStore } from '@/stores/use-board-store';
import { BoardData, SharedData } from '@/types';

import BoardDeleteDialog from '@/components/board/board-delete-dialog';
import BoardRenameDialog from '@/components/board/board-rename-dialog';
import BoardUsersDialog from '@/components/board/board-users-dialog';
import ColumnCreateDialog from '@/components/kanban/column-create-dialog';
import TaskCreateDialog from '@/components/kanban/task-create-dialog';

import { BoardHeader } from './components/BoardHeader';
import { KanbanBoard } from './components/KanbanBoard';
import { useBoardModals } from './hooks/useBoardModals';

type ShowProps = {
    board: BoardData;
};

export default function Show({ board: initialBoard }: ShowProps) {
    const { auth } = usePage<SharedData>().props;
    const { board, setBoard } = useBoardStore();

    const modals = useBoardModals();

    useEffect(() => {
        setBoard(initialBoard);
    }, [initialBoard, setBoard]);

    if (!board) return null;

    const isAdmin =
        board.users?.find((u) => u.id === auth.user.id)?.pivot?.role ===
        'admin';

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: board.title, href: '#' },
            ]}
        >
            <Head title={board.title} />

            <div className="flex h-full flex-col overflow-hidden p-6">
                <BoardHeader
                    board={board}
                    isAdmin={isAdmin}
                    onRename={() => modals.rename.setOpen(true)}
                    onDelete={() => modals.delete.setOpen(true)}
                    onUsers={() => modals.users.setOpen(true)}
                />

                <KanbanBoard
                    initialBoard={initialBoard}
                    onAddColumn={() => modals.column.setOpen(true)}
                    onAddTask={modals.openTaskDialog}
                />
            </div>

            {/* Модальные окна */}
            <TaskCreateDialog
                columnId={modals.currentColumnId}
                open={modals.task.open}
                onOpenChange={modals.task.setOpen}
            />

            <ColumnCreateDialog
                boardId={board.id}
                open={modals.column.open}
                onOpenChange={modals.column.setOpen}
            />

            <BoardUsersDialog
                boardId={board.id}
                users={board.users || []}
                open={modals.users.open}
                onOpenChange={modals.users.setOpen}
            />

            <BoardRenameDialog
                board={board}
                open={modals.rename.open}
                onOpenChange={modals.rename.setOpen}
            />

            <BoardDeleteDialog
                board={board}
                open={modals.delete.open}
                onOpenChange={modals.delete.setOpen}
            />
        </AppLayout>
    );
}
