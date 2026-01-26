import { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { router } from '@inertiajs/react';
import { useState } from 'react';

import tasksRoute from '@/routes/tasks';
import { useBoardStore } from '@/stores/use-board-store';
import { BoardData, Task } from '@/types';

import { getColumnDndId, getTaskDndId, parseDndId } from '../utils/dndUtils';

export function useKanbanDnd(initialBoard: BoardData) {
    const { columns, setBoard, updateColumns, updateColumnOrder } =
        useBoardStore();

    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [activeColumnId, setActiveColumnId] = useState<number | null>(null);

    const handleDragStart = (event: DragStartEvent) => {
        const { type, originalId } = parseDndId(event.active.id as string);

        if (type === 'task') {
            const task = columns
                .flatMap((c) => c.tasks)
                .find((t) => t.id === originalId);
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

        const activeCol = columns.find((c) =>
            c.tasks.some((t) => getTaskDndId(t.id) === activeId),
        );

        const overCol =
            columns.find((c) => getColumnDndId(c.id) === overId) ||
            columns.find((c) =>
                c.tasks.some((t) => getTaskDndId(t.id) === overId),
            );

        if (!activeCol || !overCol || activeCol.id === overCol.id) return;

        updateColumns(
            columns.map((col) => {
                if (col.id === activeCol.id) {
                    return {
                        ...col,
                        tasks: col.tasks.filter(
                            (t) => getTaskDndId(t.id) !== activeId,
                        ),
                    };
                }
                if (col.id === overCol.id) {
                    const overIndex = col.tasks.findIndex(
                        (t) => getTaskDndId(t.id) === overId,
                    );
                    const newIndex =
                        overIndex === -1 ? col.tasks.length : overIndex;
                    const newTasks = [...col.tasks];
                    newTasks.splice(newIndex, 0, activeTask!);
                    return { ...col, tasks: newTasks };
                }
                return col;
            }),
        );
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) {
            cleanup();
            return;
        }

        const activeId = active.id as string;
        const overId = over.id as string;
        const { type, originalId } = parseDndId(activeId);

        if (type === 'task') {
            handleTaskDragEnd(originalId, overId);
        } else if (type === 'column') {
            handleColumnDragEnd(originalId, overId);
        }

        cleanup();
    };

    const handleTaskDragEnd = (taskId: number, overId: string) => {
        const overCol =
            columns.find((c) => getColumnDndId(c.id) === overId) ||
            columns.find((c) =>
                c.tasks.some((t) => getTaskDndId(t.id) === overId),
            );

        if (!overCol) return;

        const tasksInCol = overCol.tasks;
        const oldIndex = tasksInCol.findIndex(
            (t) => getTaskDndId(t.id) === `task-${taskId}`,
        );
        const newIndex = tasksInCol.findIndex(
            (t) => getTaskDndId(t.id) === overId,
        );

        const reorderedTasks = arrayMove(
            tasksInCol,
            oldIndex,
            newIndex === -1 ? tasksInCol.length : newIndex,
        );

        // optimistic update
        updateColumns(
            columns.map((c) =>
                c.id === overCol.id ? { ...c, tasks: reorderedTasks } : c,
            ),
        );

        // server sync
        router.patch(
            tasksRoute.move(taskId).url,
            {
                column_id: overCol.id,
                task_ids: reorderedTasks.map((t) => t.id),
            },
            {
                preserveScroll: true,
                onSuccess: (page) => setBoard(page.props.board as BoardData),
                onError: () => setBoard(initialBoard),
            },
        );
    };

    const handleColumnDragEnd = (columnId: number, overId: string) => {
        const oldIndex = columns.findIndex((c) => c.id === columnId);
        const newIndex = columns.findIndex(
            (c) => c.id === parseDndId(overId).originalId,
        );

        if (oldIndex === newIndex || newIndex === -1) return;

        const reorderedColumns = arrayMove(columns, oldIndex, newIndex);
        updateColumnOrder(reorderedColumns.map((c) => c.id));

        router.patch(
            `/columns/${columnId}/move`,
            { position: newIndex },
            {
                preserveScroll: true,
                onSuccess: (page) => setBoard(page.props.board as BoardData),
                onError: () => setBoard(initialBoard),
            },
        );
    };

    const cleanup = () => {
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
