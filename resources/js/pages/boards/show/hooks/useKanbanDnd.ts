import { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { router } from '@inertiajs/react';
import { useState } from 'react';

import tasksRoute from '@/routes/tasks';
import { useBoardStore } from '@/stores/use-board-store';
import { BoardData, Task } from '@/types';

import {
    getColumnDndId,
    getTaskDndId,
    isTaskSlotDndId,
    parseDndId,
    parseTaskSlotDndId,
} from '../utils/dndUtils';

type TaskDropPreview = {
    columnId: number;
    index: number;
};

export function useKanbanDnd(initialBoard: BoardData) {
    const { columns, setBoard, updateColumns, updateColumnOrder } =
        useBoardStore();

    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [activeColumnId, setActiveColumnId] = useState<number | null>(null);
    const [activeTaskOriginColumnId, setActiveTaskOriginColumnId] = useState<
        number | null
    >(null);
    const [taskDropPreview, setTaskDropPreview] =
        useState<TaskDropPreview | null>(null);

    const findColumnByTaskId = (taskId: number) =>
        columns.find((column) => column.tasks.some((task) => task.id === taskId));

    const findColumnByDropTarget = (targetId: string) =>
        (isTaskSlotDndId(targetId)
            ? columns.find(
                  (column) => column.id === parseTaskSlotDndId(targetId).columnId,
              )
            : null) ||
        columns.find((column) => getColumnDndId(column.id) === targetId) ||
        columns.find((column) =>
            column.tasks.some((task) => getTaskDndId(task.id) === targetId),
        );

    const getPreviewIndex = ({
        taskId,
        destinationColumnId,
        targetId,
        active,
        over,
        deltaY,
    }: {
        taskId: number;
        destinationColumnId: number;
        targetId: string;
        active?: DragOverEvent['active'];
        over?: DragOverEvent['over'];
        deltaY?: number;
    }) => {
        const destinationColumn = columns.find(
            (column) => column.id === destinationColumnId,
        );
        if (!destinationColumn) {
            return 0;
        }

        const visibleTasks = destinationColumn.tasks.filter(
            (task) => task.id !== taskId,
        );

        if (isTaskSlotDndId(targetId)) {
            return parseTaskSlotDndId(targetId).index;
        }

        if (getColumnDndId(destinationColumn.id) === targetId) {
            return visibleTasks.length;
        }

        const overSortable = over?.data.current?.sortable as
            | { index?: number }
            | undefined;
        const sortableIndex = overSortable?.index;
        const overIndex =
            typeof sortableIndex === 'number'
                ? sortableIndex
                : visibleTasks.findIndex(
                      (task) => getTaskDndId(task.id) === targetId,
                  );

        if (overIndex === -1) {
            return visibleTasks.length;
        }

        const translatedTop =
            active?.rect.current.translated?.top ??
            (active?.rect.current.initial?.top !== undefined &&
            deltaY !== undefined
                ? active.rect.current.initial.top + deltaY
                : undefined);
        const overMiddleY = over
            ? over.rect.top + over.rect.height / 2
            : undefined;
        const activeCenterY =
            translatedTop !== undefined
                ? translatedTop +
                  ((active?.rect.current.translated?.height ??
                      active?.rect.current.initial?.height ??
                      0) /
                      2)
                : undefined;
        const shouldInsertAfter =
            activeCenterY !== undefined &&
            overMiddleY !== undefined &&
            activeCenterY > overMiddleY;

        return overIndex + (shouldInsertAfter ? 1 : 0);
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { type, originalId } = parseDndId(event.active.id as string);

        if (type === 'task') {
            const task = columns.flatMap((column) => column.tasks).find((t) => t.id === originalId);
            const sourceColumn = findColumnByTaskId(originalId);

            setActiveTask(task || null);
            setActiveTaskOriginColumnId(sourceColumn?.id ?? null);
            if (sourceColumn && task) {
                setTaskDropPreview({
                    columnId: sourceColumn.id,
                    index: sourceColumn.tasks.findIndex((item) => item.id === task.id),
                });
            }
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

        const activeCol = findColumnByTaskId(activeTask.id);
        const overCol = findColumnByDropTarget(overId);

        if (!activeCol || !overCol) return;

        setTaskDropPreview({
            columnId: overCol.id,
            index: getPreviewIndex({
                taskId: activeTask.id,
                destinationColumnId: overCol.id,
                targetId: overId,
                active,
                over,
                deltaY: event.delta.y,
            }),
        });
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
        if (!activeTask || activeTaskOriginColumnId === null) return;

        const sourceColumn = columns.find(
            (column) => column.id === activeTaskOriginColumnId,
        );
        const destinationColumn =
            columns.find((column) => column.id === taskDropPreview?.columnId) ??
            findColumnByDropTarget(overId);

        if (!sourceColumn || !destinationColumn) return;

        const destinationTasks = destinationColumn.tasks.filter(
            (task) => task.id !== taskId,
        );
        const previewIndex =
            taskDropPreview?.columnId === destinationColumn.id
                ? taskDropPreview.index
                : getPreviewIndex({
                      taskId,
                      destinationColumnId: destinationColumn.id,
                      targetId: overId,
                  });
        const insertIndex = Math.max(
            0,
            Math.min(previewIndex, destinationTasks.length),
        );
        const movedTask = { ...activeTask, column_id: destinationColumn.id };

        if (sourceColumn.id === destinationColumn.id) {
            const reorderedTasks = arrayMove(
                sourceColumn.tasks,
                sourceColumn.tasks.findIndex((task) => task.id === taskId),
                insertIndex,
            );

            updateColumns(
                columns.map((column) =>
                    column.id === sourceColumn.id
                        ? { ...column, tasks: reorderedTasks }
                        : column,
                ),
            );

            router.patch(
                tasksRoute.move(taskId).url,
                {
                    column_id: destinationColumn.id,
                    task_ids: reorderedTasks.map((task) => task.id),
                },
                {
                    preserveScroll: true,
                    onSuccess: (page) => setBoard(page.props.board as BoardData),
                    onError: () => setBoard(initialBoard),
                },
            );

            return;
        }

        const sourceTasks = sourceColumn.tasks.filter((task) => task.id !== taskId);
        const reorderedDestinationTasks = [...destinationTasks];
        reorderedDestinationTasks.splice(insertIndex, 0, movedTask);

        updateColumns(
            columns.map((column) => {
                if (column.id === sourceColumn.id) {
                    return { ...column, tasks: sourceTasks };
                }

                if (column.id === destinationColumn.id) {
                    return {
                        ...column,
                        tasks: reorderedDestinationTasks,
                    };
                }

                return column;
            }),
        );

        router.patch(
            tasksRoute.move(taskId).url,
            {
                column_id: destinationColumn.id,
                task_ids: reorderedDestinationTasks.map((task) => task.id),
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
        setActiveTaskOriginColumnId(null);
        setTaskDropPreview(null);
    };

    return {
        activeTask,
        activeColumnId,
        taskDropPreview,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
    };
}
