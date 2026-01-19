import { BoardData, ColumnWithTasks } from '@/types';
import { create } from 'zustand';

interface BoardState {
    board: BoardData | null;
    columns: ColumnWithTasks[];
    setBoard: (board: BoardData) => void;
    updateColumns: (columns: ColumnWithTasks[]) => void;
    updateColumnTitle: (columnId: number, title: string) => void;
    updateColumnOrder: (columnIds: number[]) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
    board: null,
    columns: [],
    setBoard: (board) =>
        set({
            board,
            columns: [...board.columns]
                .sort((a, b) => a.position - b.position)
                .map((col) => ({
                    ...col,
                    tasks: [...col.tasks].sort(
                        (a, b) => a.position - b.position,
                    ),
                })),
        }),
    updateColumns: (columns) => set({ columns }),
    updateColumnTitle: (columnId: number, title: string) =>
        set((state) => ({
            columns: state.columns.map((col) =>
                col.id === columnId ? { ...col, title } : col,
            ),
        })),
    updateColumnOrder: (columnIds: number[]) =>
        set((state) => ({
            columns: columnIds
                .map((id) => state.columns.find((c) => c.id === id)!)
                .map((col, index) => ({ ...col, position: index })),
        })),
}));
