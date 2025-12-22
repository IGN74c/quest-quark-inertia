import AppLayout from '@/layouts/app-layout';
import { type BoardData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragStartEvent,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
    closestCorners,
    DragOverlay,
    defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
    SortableContext,
    horizontalListSortingStrategy,
    arrayMove,
    sortableKeyboardCoordinates
} from '@dnd-kit/sortable';
import { useState, useEffect } from 'react';
import { useBoardStore } from '@/stores/use-board-store';
import { Users } from 'lucide-react';

import KanbanColumn from '@/components/kanban/kanban-column';
import KanbanTask from '@/components/kanban/kanban-task';
import tasksRoute from '@/routes/tasks';
import TaskCreateDialog from '@/components/kanban/task-create-dialog';
import ColumnCreateDialog from '@/components/kanban/column-create-dialog';
import BoardUsersDialog from '@/components/kanban/board-users-dialog';
import { Button } from '@/components/ui/button';

export default function Show({ board: initialBoard }: { board: BoardData }) {
    const { auth } = usePage<any>().props;
    const { board, columns, setBoard, updateColumns } = useBoardStore();

    useEffect(() => {
        setBoard(initialBoard);
    }, [initialBoard]);

    const [activeTask, setActiveTask] = useState<any | null>(null);
    const [isColumnDialogOpen, setIsColumnDialogOpen] = useState(false);
    const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
    const [isUsersDialogOpen, setIsUsersDialogOpen] = useState(false);
    const [currentColumnId, setCurrentColumnId] = useState<number | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const getColumnDndId = (id: number) => `column-${id}`;
    const getTaskDndId = (id: number) => `task-${id}`;
    const parseDndId = (id: string) => ({ type: id.split('-')[0], originalId: parseInt(id.split('-')[1]) });

    const isAdmin = board?.users?.find(u => u.id === auth.user.id)?.pivot?.role === 'admin';

    const handleDragStart = (event: DragStartEvent) => {
        const { type, originalId } = parseDndId(event.active.id as string);
        if (type === 'task') {
            const task = columns.flatMap(c => c.tasks).find(t => t.id === originalId);
            setActiveTask(task);
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;
        if (activeId === overId) return;

        const activeCol = columns.find(c => c.tasks.some(t => getTaskDndId(t.id) === activeId));
        const overCol = columns.find(c => getColumnDndId(c.id) === overId) ||
            columns.find(c => c.tasks.some(t => getTaskDndId(t.id) === overId));

        if (!activeCol || !overCol || activeCol.id === overCol.id) return;

        // Оптимистичное перемещение между колонками во время перетаскивания
        updateColumns(columns.map(col => {
            if (col.id === activeCol.id) {
                return { ...col, tasks: col.tasks.filter(t => getTaskDndId(t.id) !== activeId) };
            }
            if (col.id === overCol.id) {
                const overIndex = col.tasks.findIndex(t => getTaskDndId(t.id) === overId);
                const newIndex = overIndex === -1 ? col.tasks.length : overIndex;
                const newTasks = [...col.tasks];
                newTasks.splice(newIndex, 0, activeTask);
                return { ...col, tasks: newTasks };
            }
            return col;
        }));
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) {
            setActiveTask(null);
            return;
        }

        const activeId = active.id as string;
        const overId = over.id as string;
        const { originalId: taskId } = parseDndId(activeId);

        const overCol = columns.find(c => getColumnDndId(c.id) === overId) ||
            columns.find(c => c.tasks.some(t => getTaskDndId(t.id) === overId));

        if (overCol) {
            const tasksInCol = overCol.tasks;
            const oldIndex = tasksInCol.findIndex(t => getTaskDndId(t.id) === activeId);
            const newIndex = tasksInCol.findIndex(t => getTaskDndId(t.id) === overId);

            const reorderedTasks = arrayMove(tasksInCol, oldIndex, newIndex === -1 ? 0 : newIndex);

            updateColumns(columns.map(c => c.id === overCol.id ? { ...c, tasks: reorderedTasks } : c));

            router.patch(tasksRoute.move(taskId).url, {
                column_id: overCol.id,
                task_ids: reorderedTasks.map(t => t.id)
            }, {
                preserveScroll: true,
                onSuccess: (page: any) => setBoard(page.props.board as BoardData),
                onError: () => setBoard(initialBoard)
            });
        }
        setActiveTask(null);
    };

    if (!board) return null;

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: board.title, href: '#' }]}>
            <Head title={board.title} />
            <div className="flex h-full flex-col p-6 overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold tracking-tight">{board.title}</h1>

                    {isAdmin && (
                        <Button variant="outline" size="sm" onClick={() => setIsUsersDialogOpen(true)}>
                            <Users className="mr-2 h-4 w-4" /> Участники
                        </Button>
                    )}
                </div>

                <div className="flex-1 overflow-x-auto pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCorners}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="flex gap-4 h-full items-start">
                            <SortableContext items={columns.map(c => getColumnDndId(c.id))} strategy={horizontalListSortingStrategy}>
                                {columns.map(column => (
                                    <KanbanColumn
                                        key={column.id}
                                        column={column}
                                        tasks={column.tasks.filter(t => t.id !== activeTask?.id)}
                                        getTaskDndId={getTaskDndId}
                                        onAddTask={() => { setCurrentColumnId(column.id); setIsTaskDialogOpen(true); }}
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

                        <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }) }}>
                            {activeTask && <KanbanTask task={activeTask} />}
                        </DragOverlay>
                    </DndContext>
                </div>
            </div>

            {/* Модальные окна */}
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

            {isAdmin && (
                <BoardUsersDialog
                    boardId={board.id}
                    users={board.users as any}
                    open={isUsersDialogOpen}
                    onOpenChange={setIsUsersDialogOpen}
                />
            )}
        </AppLayout>
    );
}