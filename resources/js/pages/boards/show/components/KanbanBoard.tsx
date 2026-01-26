import {
    DndContext,
    DragOverlay,
    MouseSensor,
    TouchSensor,
    closestCorners,
    defaultDropAnimationSideEffects,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable';

import { BoardData } from '@/types';

import KanbanColumn from '@/components/kanban/kanban-column';
import KanbanTask from '@/components/kanban/kanban-task';
import { useBoardStore } from '@/stores/use-board-store';

import { useKanbanDnd } from '../hooks/useKanbanDnd';
import { getColumnDndId, getTaskDndId } from '../utils/dndUtils';

type KanbanBoardProps = {
    initialBoard: BoardData;
    onAddColumn: () => void;
    onAddTask: (columnId: number) => void;
};

export function KanbanBoard({
    initialBoard,
    onAddColumn,
    onAddTask,
}: KanbanBoardProps) {
    const { columns } = useBoardStore();
    const { activeTask, handleDragStart, handleDragOver, handleDragEnd } =
        useKanbanDnd(initialBoard);

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, {
            activationConstraint: { delay: 240, tolerance: 8 },
        }),
    );

    return (
        <div className="flex-1 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex h-full items-start gap-4">
                    <SortableContext
                        items={columns.map((c) => getColumnDndId(c.id))}
                        strategy={horizontalListSortingStrategy}
                    >
                        {columns.map((column) => (
                            <KanbanColumn
                                key={column.id}
                                column={column}
                                tasks={column.tasks.filter(
                                    (t) => t.id !== activeTask?.id,
                                )}
                                getTaskDndId={getTaskDndId}
                                onAddTask={() => onAddTask(column.id)}
                            />
                        ))}
                    </SortableContext>

                    <button
                        onClick={onAddColumn}
                        className="flex h-12 w-80 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/20 text-sm font-medium text-muted-foreground transition-all hover:border-muted-foreground/50 hover:bg-accent/50"
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
    );
}
