import { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import {
    SharedData,
    Task,
    type BoardData,
} from '@/types';
import AppLayout from '@/layouts/app-layout';
import { useBoardStore } from '@/stores/use-board-store';

import { MoreVertical, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DndContext,
    DragOverlay,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    closestCorners,
    defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
    SortableContext,
    horizontalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable';

import KanbanColumn from '@/components/kanban/kanban-column';
import KanbanTask from '@/components/kanban/kanban-task';
import TaskCreateDialog from '@/components/kanban/task-create-dialog';
import ColumnCreateDialog from '@/components/kanban/column-create-dialog';
import BoardUsersDialog from '@/components/board/board-users-dialog';
import tasksRoute from '@/routes/tasks';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import BoardRenameDialog from '@/components/board/board-rename-dialog';
import BoardDeleteDialog from '@/components/board/board-delete-dialog';

const getColumnDndId = (id: number) => `column-${id}`;
const getTaskDndId = (id: number) => `task-${id}`;

const parseDndId = (id: string) => ({
    type: id.split('-')[0],
    originalId: parseInt(id.split('-')[1]),
});

function useKanbanDnd(initialBoard: BoardData) {
    const { columns, setBoard, updateColumns, updateColumnOrder } = useBoardStore();
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [activeColumnId, setActiveColumnId] = useState<number | null>(null);

    const handleDragStart = (event: DragStartEvent) => {
        const { type, originalId } = parseDndId(event.active.id as string);

        if (type === 'task') {
            const task = columns.flatMap(c => c.tasks).find(t => t.id === originalId);
            setActiveTask(task || null);
        } else if (type === 'column') {
            setActiveColumnId(originalId);
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over || !activeTask) return;

        const activeId = active.id as string;
        const overId = over.id as string;
        if (activeId === overId) return;

        const { type: activeType } = parseDndId(activeId);
        if (activeType !== 'task') return;

        const activeCol = columns.find(c => c.tasks.some(t => getTaskDndId(t.id) === activeId));
        const overCol = columns.find(c => getColumnDndId(c.id) === overId) ||
            columns.find(c => c.tasks.some(t => getTaskDndId(t.id) === overId));

        if (!activeCol || !overCol || activeCol.id === overCol.id) return;

        updateColumns(columns.map(col => {
            if (col.id === activeCol.id) {
                return { ...col, tasks: col.tasks.filter(t => getTaskDndId(t.id) !== activeId) };
            }
            if (col.id === overCol.id) {
                const overIndex = col.tasks.findIndex(t => getTaskDndId(t.id) === overId);
                const newIndex = overIndex === -1 ? col.tasks.length : overIndex;
                const newTasks = [...col.tasks];
                newTasks.splice(newIndex, 0, activeTask!);
                return { ...col, tasks: newTasks };
            }
            return col;
        }));
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) {
            setActiveTask(null);
            setActiveColumnId(null);
            return;
        }

        const activeId = active.id as string;
        const overId = over.id as string;
        const { type, originalId } = parseDndId(activeId);

        // === Перемещение задач ===
        if (type === 'task') {
            const overCol = columns.find(c => getColumnDndId(c.id) === overId) ||
                columns.find(c => c.tasks.some(t => getTaskDndId(t.id) === overId));

            if (overCol) {
                const tasksInCol = overCol.tasks;
                const oldIndex = tasksInCol.findIndex(t => getTaskDndId(t.id) === activeId);
                const newIndex = tasksInCol.findIndex(t => getTaskDndId(t.id) === overId);
                const reorderedTasks = arrayMove(tasksInCol, oldIndex, newIndex === -1 ? tasksInCol.length : newIndex);

                updateColumns(columns.map(c =>
                    c.id === overCol.id ? { ...c, tasks: reorderedTasks } : c
                ));

                router.patch(tasksRoute.move(originalId).url, {
                    column_id: overCol.id,
                    task_ids: reorderedTasks.map(t => t.id),
                }, {
                    preserveScroll: true,
                    onSuccess: (page) => setBoard(page.props.board as BoardData),
                    onError: () => setBoard(initialBoard),
                });
            }
        }

        // === Перемещение колонок ===
        else if (type === 'column') {
            const oldIndex = columns.findIndex(c => c.id === originalId);
            const newIndex = columns.findIndex(c => c.id === parseDndId(overId).originalId);

            if (oldIndex !== newIndex && newIndex !== -1) {
                const reorderedColumns = arrayMove(columns, oldIndex, newIndex);

                updateColumnOrder(reorderedColumns.map(c => c.id));

                router.patch(`/columns/${originalId}/move`, {
                    position: newIndex,
                }, {
                    preserveScroll: true,
                    onSuccess: (page) => setBoard(page.props.board as BoardData),
                    onError: () => setBoard(initialBoard),
                });
            }
        }

        setActiveTask(null);
        setActiveColumnId(null);
    };

    return {
        activeTask,
        activeColumnId,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
    };
}

export default function Show({ board: initialBoard }: { board: BoardData }) {
    const { auth } = usePage<SharedData>().props;
    const { board, columns, setBoard } = useBoardStore();

    const [isRenameOpen, setIsRenameOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [isColumnDialogOpen, setIsColumnDialogOpen] = useState(false);
    const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
    const [isUsersDialogOpen, setIsUsersDialogOpen] = useState(false);
    const [currentColumnId, setCurrentColumnId] = useState<number | null>(null);

    useEffect(() => {
        setBoard(initialBoard);
    }, [initialBoard]);

    const { activeTask, handleDragStart, handleDragOver, handleDragEnd } =
        useKanbanDnd(initialBoard);

    if (!board) return null;

    const isAdmin =
        board.users?.find((u) => u.id === auth.user.id)?.pivot?.role === 'admin';

    const handleAddTask = (colId: number) => {
        setCurrentColumnId(colId);
        setIsTaskDialogOpen(true);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: board.title, href: '#' },
            ]}
        >
            <Head title={board.title} />

            <div className="flex h-full flex-col p-6 overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                    <h1
                        className="text-2xl font-bold tracking-tight cursor-pointer hover:text-primary transition-colors"
                        onClick={() => isAdmin && setIsRenameOpen(true)}
                    >
                        {board.title}
                    </h1>

                    <div className="flex items-center gap-2">
                        {isAdmin && (
                            <>
                                <Button variant="outline" size="sm" onClick={() => setIsUsersDialogOpen(true)}>
                                    <Users className="mr-2 h-4 w-4" /> Участники
                                </Button>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => setIsRenameOpen(true)}>
                                            Переименовать
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="text-destructive focus:text-destructive"
                                            onClick={() => setIsDeleteOpen(true)}
                                        >
                                            Удалить доску
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-x-auto pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <DndContext
                        collisionDetection={closestCorners}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="flex gap-4 h-full items-start">
                            <SortableContext
                                items={columns.map((c) => getColumnDndId(c.id))}
                                strategy={horizontalListSortingStrategy}
                            >
                                {columns.map((column) => (
                                    <KanbanColumn
                                        key={column.id}
                                        column={column}
                                        tasks={column.tasks.filter(
                                            (t) => t.id !== activeTask?.id
                                        )}
                                        getTaskDndId={getTaskDndId}
                                        onAddTask={() => handleAddTask(column.id)}
                                    />
                                ))}
                            </SortableContext>

                            <button
                                onClick={() => setIsColumnDialogOpen(true)}
                                className="flex h-12 w-80 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/20 text-sm font-medium text-muted-foreground hover:border-muted-foreground/50 hover:bg-accent/50 transition-all"
                            >
                                + Добавить колонку
                            </button>
                        </div>

                        <DragOverlay
                            dropAnimation={{
                                sideEffects: defaultDropAnimationSideEffects({
                                    styles: { active: { opacity: '0.5' } },
                                }),
                            }}
                        >
                            {activeTask && <KanbanTask task={activeTask} />}
                        </DragOverlay>
                    </DndContext>
                </div>
            </div>

            <TaskCreateDialog
                columnId={currentColumnId}
                open={isTaskDialogOpen}
                onOpenChange={setIsTaskDialogOpen}
            />
            <ColumnCreateDialog
                boardId={board.id}
                open={isColumnDialogOpen}
                onOpenChange={setIsColumnDialogOpen}
            />
            <BoardUsersDialog
                boardId={board.id}
                users={board.users || []}
                open={isUsersDialogOpen}
                onOpenChange={setIsUsersDialogOpen}
            />
            <BoardRenameDialog
                board={board}
                open={isRenameOpen}
                onOpenChange={setIsRenameOpen}
            />
            <BoardDeleteDialog
                board={board}
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
            />
        </AppLayout>
    );
}