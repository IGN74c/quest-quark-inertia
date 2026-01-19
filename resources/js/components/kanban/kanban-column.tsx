import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useBoardStore } from '@/stores/use-board-store';
import { Column, SharedData, Task } from '@/types';
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { router, usePage } from '@inertiajs/react';
import { Check, GripVertical } from 'lucide-react';
import { useState } from 'react';
import KanbanTask from './kanban-task';

interface KanbanColumnProps {
    column: Column;
    tasks: Task[];
    getTaskDndId: (id: number) => string;
    onAddTask: () => void;
}

export default function KanbanColumn({
    column,
    tasks,
    getTaskDndId,
    onAddTask,
}: KanbanColumnProps) {
    const { auth } = usePage<SharedData>().props;
    const { board, updateColumnTitle } = useBoardStore();

    const isAdmin =
        board?.users?.find((u) => u.id === auth.user.id)?.pivot?.role ===
        'admin';

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(column.title);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: `column-${column.id}`,
        data: { type: 'column' },
    });

    const handleSave = () => {
        if (title.trim() === '' || title === column.title) {
            setIsEditing(false);
            setTitle(column.title);
            return;
        }

        updateColumnTitle(column.id, title);
        setIsEditing(false);

        router.patch(
            `/columns/${column.id}`,
            { title },
            {
                preserveScroll: true,
                onError: () => {
                    updateColumnTitle(column.id, column.title);
                    setTitle(column.title);
                },
            },
        );
    };

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            className="h-full w-80 shrink-0"
        >
            <Card className="flex max-h-full flex-col border-none bg-secondary/30 shadow-none">
                <CardHeader className="p-4">
                    <CardTitle className="flex items-center justify-between gap-2 text-sm font-bold tracking-wider text-muted-foreground uppercase">
                        <GripVertical
                            className="h-5 w-5 cursor-grab text-muted-foreground active:cursor-grabbing"
                            {...listeners}
                        />

                        {isEditing && isAdmin ? (
                            <div className="flex flex-1 items-center gap-1">
                                <Input
                                    className="h-7 px-2 py-0 text-sm"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    autoFocus
                                    onBlur={handleSave}
                                    onKeyDown={(e) =>
                                        e.key === 'Enter' && handleSave()
                                    }
                                />
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7"
                                    onClick={handleSave}
                                >
                                    <Check className="h-4 w-4 text-green-500" />
                                </Button>
                            </div>
                        ) : (
                            <span
                                className={`flex-1 truncate ${isAdmin ? 'cursor-pointer transition-colors hover:text-foreground' : ''}`}
                                onClick={() => isAdmin && setIsEditing(true)}
                            >
                                {column.title}
                            </span>
                        )}

                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px]">
                            {tasks.length}
                        </span>
                    </CardTitle>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col gap-2 overflow-y-auto p-2">
                    <SortableContext
                        items={tasks.map((t) => getTaskDndId(t.id))}
                        strategy={verticalListSortingStrategy}
                    >
                        {tasks.map((task) => (
                            <KanbanTask key={task.id} task={task} />
                        ))}
                    </SortableContext>
                </CardContent>

                <div className="p-2">
                    <Button
                        variant="ghost"
                        className="h-8 w-full justify-start text-xs"
                        onClick={onAddTask}
                    >
                        + Добавить задачу
                    </Button>
                </div>
            </Card>
        </div>
    );
}
