export const getColumnDndId = (id: number) => `column-${id}`;
export const getTaskDndId = (id: number) => `task-${id}`;

export function parseDndId(dndId: string) {
    const [type, idStr] = dndId.split('-');
    return {
        type,
        originalId: parseInt(idStr, 10),
    };
}
