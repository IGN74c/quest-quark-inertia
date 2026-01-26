import { useEcho } from '@laravel/echo-react';

import { useBoardStore } from '@/stores/use-board-store';
import { ColumnWithTasks, Task } from '@/types';

type TaskPayload = {
    task: Task;
    task_ids?: number[];
};

type TaskMovedPayload = {
    task: Task;
    from_column_id: number;
    to_column_id: number;
    from_task_ids?: number[];
    to_task_ids?: number[];
};

type TaskDeletedPayload = {
    task_id: number;
    column_id: number;
    task_ids?: number[];
};

type ColumnPayload = {
    column: ColumnWithTasks;
};

type ColumnDeletedPayload = {
    column_id: number;
    column_ids?: number[];
};

type ColumnMovedPayload = {
    column_ids: number[];
};

export function useBoardEvents(boardId: number) {
    const {
        addTask,
        applyTaskOrder,
        updateTask,
        removeTask,
        moveTask,
        addColumn,
        updateColumn,
        removeColumn,
        updateColumnOrder,
    } = useBoardStore();

    const channel = `board.${boardId}`;

    useEcho<TaskPayload>(
        channel,
        '.task.created',
        ({ task, task_ids }) => {
            addTask(task);
            if (task_ids && task_ids.length > 0) {
                applyTaskOrder(task.column_id, task_ids);
            }
        },
        [boardId],
        'private',
    );

    useEcho<TaskPayload>(
        channel,
        '.task.updated',
        ({ task }) => {
            updateTask(task);
        },
        [boardId],
        'private',
    );

    useEcho<TaskDeletedPayload>(
        channel,
        '.task.deleted',
        ({ task_id, column_id, task_ids }) => {
            removeTask(task_id, column_id, task_ids);
        },
        [boardId],
        'private',
    );

    useEcho<TaskMovedPayload>(
        channel,
        '.task.moved',
        ({ task, from_column_id, to_column_id, from_task_ids, to_task_ids }) => {
            moveTask({
                task,
                fromColumnId: from_column_id,
                toColumnId: to_column_id,
                fromTaskIds: from_task_ids,
                toTaskIds: to_task_ids,
            });
        },
        [boardId],
        'private',
    );

    useEcho<ColumnPayload>(
        channel,
        '.column.created',
        ({ column }) => {
            addColumn(column);
        },
        [boardId],
        'private',
    );

    useEcho<ColumnPayload>(
        channel,
        '.column.updated',
        ({ column }) => {
            updateColumn(column);
        },
        [boardId],
        'private',
    );

    useEcho<ColumnDeletedPayload>(
        channel,
        '.column.deleted',
        ({ column_id, column_ids }) => {
            removeColumn(column_id, column_ids);
        },
        [boardId],
        'private',
    );

    useEcho<ColumnMovedPayload>(
        channel,
        '.column.moved',
        ({ column_ids }) => {
            updateColumnOrder(column_ids);
        },
        [boardId],
        'private',
    );
}
