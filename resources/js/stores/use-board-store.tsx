import { create } from 'zustand';
import { BoardData, ColumnWithTasks } from '@/types';

interface BoardState {
    board: BoardData | null;
    columns: ColumnWithTasks[];
    setBoard: (board: BoardData) => void;
    updateColumns: (columns: ColumnWithTasks[]) => void;
    updateColumnTitle: (columnId: number, title: string) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
    board: null,
    columns: [],
    setBoard: (board) => set({
        board,
        columns: [...board.columns].sort((a, b) => a.position - b.position).map(col => ({
            ...col,
            tasks: [...col.tasks].sort((a, b) => a.position - b.position)
        }))
    }),
    updateColumns: (columns) => set({ columns }),
    updateColumnTitle: (columnId: number, title: string) => set((state) => ({
        columns: state.columns.map(col =>
            col.id === columnId ? { ...col, title } : col
        )
    })),
}));

