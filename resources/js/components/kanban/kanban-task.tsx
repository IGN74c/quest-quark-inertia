import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Calendar } from 'lucide-react';
import { useState } from 'react';
import TaskEditDialog from './task-edit-dialog';
import { Task } from '@/types';
import { useBoardStore } from '@/stores/use-board-store';

export default function KanbanTask({ task }: { task: Task }) {
    const board = useBoardStore((state) => state.board);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: `task-${task.id}`,
        data: { type: 'task', task }
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
                className="opacity-50 bg-accent/50 border-2 border-primary/20 border-dashed rounded-lg h-[100px]"
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
                className="group relative flex flex-col gap-3 rounded-lg border bg-card p-3 shadow-sm transition-all hover:shadow-md hover:border-primary/50 cursor-pointer"
            >
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                        #{task.id}
                    </span>
                    <button
                        {...listeners}
                        onClick={(e) => e.stopPropagation()}
                        className="-mr-1 -mt-1 p-1 text-muted-foreground/50 hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing rounded hover:bg-muted"
                    >
                        <GripVertical className="h-4 w-4" />
                    </button>
                </div>

                <div>
                    <p className="text-sm font-medium leading-snug text-card-foreground line-clamp-3">
                        {task.title}
                    </p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-border/40 mt-1">
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(task.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</span>
                    </div>

                    {task.assignee && (
                        <div 
                            className="flex items-center gap-1.5 pl-2 rounded-full bg-muted/50 pr-2 py-0.5 max-w-[120px]" 
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
                            <span className="text-[10px] font-medium truncate text-muted-foreground">
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