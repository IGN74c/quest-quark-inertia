import { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { BoardUserPivot, SharedData, Task, User, type BoardData } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { useBoardStore } from '@/stores/use-board-store';

import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DndContext, DragOverlay, DragStartEvent, DragOverEvent, DragEndEvent,
    useSensor, useSensors, PointerSensor, KeyboardSensor, closestCorners, defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import KanbanColumn from '@/components/kanban/kanban-column';
import KanbanTask from '@/components/kanban/kanban-task';
import TaskCreateDialog from '@/components/kanban/task-create-dialog';
import ColumnCreateDialog from '@/components/kanban/column-create-dialog';
import BoardUsersDialog from '@/components/kanban/board-users-dialog';
import tasksRoute from '@/routes/tasks';

const getColumnDndId = (id: number) => `column-${id}`;
const getTaskDndId = (id: number) => `task-${id}`;
const parseDndId = (id: string) => ({
    type: id.split('-')[0],
    originalId: parseInt(id.split('-')[1])
});

type BoardUser = User & { pivot: BoardUserPivot };

function useKanbanDnd(initialBoard: BoardData) {
    const { board, columns, setBoard, updateColumns } = useBoardStore();
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { type, originalId } = parseDndId(event.active.id as string);
        if (type === 'task') {
            const task = columns.flatMap(c => c.tasks).find(t => t.id === originalId);
            setActiveTask(task || null);
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over || !activeTask) return;

        const activeId = active.id as string;
        const overId = over.id as string;
        if (activeId === overId) return;

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
                onSuccess: (page) => setBoard(page.props.board as BoardData),
                onError: () => setBoard(initialBoard)
            });
        }
        setActiveTask(null);
    };

    return { sensors, activeTask, handleDragStart, handleDragOver, handleDragEnd };
}


const BoardModals = ({
    board,
    currentColumnId,
    state: { isTaskOpen, isColumnOpen, isUsersOpen },
    actions: { setTaskOpen, setColumnOpen, setUsersOpen }
}: {
    board: BoardData;
    currentColumnId: number | null;
    state: { isTaskOpen: boolean; isColumnOpen: boolean; isUsersOpen: boolean };
    actions: { setTaskOpen: (v: boolean) => void; setColumnOpen: (v: boolean) => void; setUsersOpen: (v: boolean) => void };
}) => {
    const users = (board.users as BoardUser[]) || [];

    return (
        <>
            <TaskCreateDialog
                columnId={currentColumnId}
                open={isTaskOpen}
                onOpenChange={setTaskOpen}
            />
            <ColumnCreateDialog
                boardId={board.id}
                open={isColumnOpen}
                onOpenChange={setColumnOpen}
            />
            <BoardUsersDialog
                boardId={board.id}
                users={users}
                open={isUsersOpen}
                onOpenChange={setUsersOpen}
            />
        </>
    );
};

export default function Show({ board: initialBoard }: { board: BoardData }) {
    const { auth } = usePage<SharedData>().props;
    const { board, columns, setBoard } = useBoardStore();

    const [isColumnDialogOpen, setIsColumnDialogOpen] = useState(false);
    const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
    const [isUsersDialogOpen, setIsUsersDialogOpen] = useState(false);
    const [currentColumnId, setCurrentColumnId] = useState<number | null>(null);

    useEffect(() => { setBoard(initialBoard); }, [initialBoard]);

    const { sensors, activeTask, handleDragStart, handleDragOver, handleDragEnd } = useKanbanDnd(initialBoard);

    if (!board) return null;

    const isAdmin = board.users?.find(u => u.id === auth.user.id)?.pivot?.role === 'admin';

    const handleAddTask = (colId: number) => {
        setCurrentColumnId(colId);
        setIsTaskDialogOpen(true);
    };

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

                        <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }) }}>
                            {activeTask && <KanbanTask task={activeTask} />}
                        </DragOverlay>
                    </DndContext>
                </div>
            </div>

            <BoardModals
                board={board}
                currentColumnId={currentColumnId}
                state={{ isTaskOpen: isTaskDialogOpen, isColumnOpen: isColumnDialogOpen, isUsersOpen: isUsersDialogOpen }}
                actions={{ setTaskOpen: setIsTaskDialogOpen, setColumnOpen: setIsColumnDialogOpen, setUsersOpen: setIsUsersDialogOpen }}
            />
        </AppLayout>
    );
}