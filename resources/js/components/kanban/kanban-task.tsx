import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { useState } from 'react';
import TaskEditDialog from './task-edit-dialog';
import { User } from '@/types';
import { useBoardStore } from '@/stores/use-board-store';

export default function KanbanTask({ task }: { task: any }) {

    const board = useBoardStore((state) => state.board);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: `task-${task.id}`,
        data: { type: 'task', task }
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                onClick={() => setIsModalOpen(true)}
                className="rounded-md border bg-card p-3 shadow-sm hover:ring-1 hover:ring-primary/50 transition-all cursor-pointer group"
            >
                <div className="flex items-start gap-2">
                    <GripVertical
                        className="h-5 w-5 text-muted-foreground cursor-grab active:cursor-grabbing mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        {...listeners}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1">
                        <p className="text-sm font-medium">{task.title}</p>
                        {task.assignee && (
                            <div className="mt-2 flex items-center gap-2">
                                <div className="h-5 w-5 rounded-full bg-primary/10 text-[10px] flex items-center justify-center font-bold">
                                    {task.assignee.name.charAt(0)}
                                </div>
                                <span className="text-[10px] text-muted-foreground">{task.assignee.name}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Вызов диалога здесь */}
            <TaskEditDialog
                task={task}
                boardUsers={board?.users || []}
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
            />
        </>
    );
}