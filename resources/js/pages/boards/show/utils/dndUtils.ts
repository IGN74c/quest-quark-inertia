export const getColumnDndId = (id: number) => `column-${id}`;
export const getTaskDndId = (id: number) => `task-${id}`;
export const getTaskSlotDndId = (columnId: number, index: number) =>
    `task-slot-${columnId}-${index}`;

export const isTaskSlotDndId = (dndId: string) => dndId.startsWith('task-slot-');

export function parseTaskSlotDndId(dndId: string) {
    const [, , columnId, index] = dndId.split('-');

    return {
        columnId: parseInt(columnId, 10),
        index: parseInt(index, 10),
    };
}

export function parseDndId(dndId: string) {
    if (isTaskSlotDndId(dndId)) {
        const { columnId, index } = parseTaskSlotDndId(dndId);

        return {
            type: 'task-slot',
            originalId: columnId,
            index,
        };
    }

    const [type, idStr] = dndId.split('-');
    return {
        type,
        originalId: parseInt(idStr, 10),
    };
}
