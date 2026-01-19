import { useBoardStore } from '@/stores/use-board-store';
import { Task } from '@/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, GripVertical } from 'lucide-react';
import { useState } from 'react';
import TaskEditDialog from './task-edit-dialog';

export default function KanbanTask({ task }: { task: Task }) {
    const board = useBoardStore((state) => state.board);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: `task-${task.id}`,
        data: { type: 'task', task },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="h-[100px] rounded-lg border-2 border-dashed border-primary/20 bg-accent/50 opacity-50"
            />
        );
    }

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                onClick={() => setIsModalOpen(true)}
                className="group relative flex cursor-pointer flex-col gap-3 rounded-lg border bg-card p-3 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
            >
                <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase"></span>
                    <button
                        {...listeners}
                        onClick={(e) => e.stopPropagation()}
                        className="-mt-1 -mr-1 cursor-grab rounded p-1 text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted hover:text-foreground active:cursor-grabbing"
                    >
                        <GripVertical className="h-4 w-4" />
                    </button>
                </div>

                <div>
                    <p className="line-clamp-3 text-sm leading-snug font-medium text-card-foreground">
                        {task.title}
                    </p>
                </div>

                <div className="mt-1 flex items-center justify-between border-t border-border/40 pt-1">
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>
                            {new Date(task.created_at).toLocaleDateString(
                                'ru-RU',
                                { day: 'numeric', month: 'short' },
                            )}
                        </span>
                    </div>

                    {task.assignee && (
                        <div
                            className="flex max-w-[120px] items-center gap-1.5 rounded-full bg-muted/50 py-0.5 pr-2 pl-2"
                            title={task.assignee.name}
                        >
                            <div className="relative flex h-5 w-5 shrink-0 overflow-hidden rounded-full border border-background">
                                {task.assignee.avatar ? (
                                    <img
                                        src={task.assignee.avatar}
                                        alt={task.assignee.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-primary text-[9px] font-bold text-primary-foreground uppercase">
                                        {task.assignee.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <span className="truncate text-[10px] font-medium text-muted-foreground">
                                {task.assignee.name.split(' ')[0]}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <TaskEditDialog
                task={task}
                boardUsers={board?.users || []}
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
            />
        </>
    );
}
