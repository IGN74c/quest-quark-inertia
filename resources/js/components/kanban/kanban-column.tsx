import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Check, X } from 'lucide-react';
import KanbanTask from './kanban-task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useBoardStore } from '@/stores/use-board-store';
import { router, usePage } from '@inertiajs/react';

interface KanbanColumnProps {
    column: any;
    tasks: any[];
    getTaskDndId: (id: number) => string;
    onAddTask: () => void;
}

export default function KanbanColumn({ column, tasks, getTaskDndId, onAddTask }: KanbanColumnProps) {
    const { auth } = usePage<any>().props;
    const { board, updateColumnTitle } = useBoardStore();
    
    // Проверка прав админа
    const isAdmin = board?.users?.find(u => u.id === auth.user.id)?.pivot?.role === 'admin';

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(column.title);

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: `column-${column.id}`,
        data: { type: 'column' }
    });

    const handleSave = () => {
        if (title.trim() === '' || title === column.title) {
            setIsEditing(false);
            setTitle(column.title);
            return;
        }

        updateColumnTitle(column.id, title);
        setIsEditing(false);

        router.patch(`/columns/${column.id}`, { title }, {
            preserveScroll: true,
            onError: () => {
                updateColumnTitle(column.id, column.title);
                setTitle(column.title);
            }
        });
    };

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} className="w-80 shrink-0 h-full">
            <Card className="flex flex-col max-h-full bg-secondary/30 border-none shadow-none">
                <CardHeader className="p-4">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between gap-2">
                        <GripVertical
                            className="h-5 w-5 text-muted-foreground cursor-grab active:cursor-grabbing"
                            {...listeners}
                        />
                        
                        {isEditing && isAdmin ? (
                            <div className="flex flex-1 items-center gap-1">
                                <Input 
                                    className="h-7 py-0 px-2 text-sm" 
                                    value={title} 
                                    onChange={(e) => setTitle(e.target.value)}
                                    autoFocus
                                    onBlur={handleSave}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                />
                                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleSave}>
                                    <Check className="h-4 w-4 text-green-500" />
                                </Button>
                            </div>
                        ) : (
                            <span 
                                className={`flex-1 truncate ${isAdmin ? 'cursor-pointer hover:text-foreground transition-colors' : ''}`}
                                onClick={() => isAdmin && setIsEditing(true)}
                            >
                                {column.title}
                            </span>
                        )}
                        
                        <span className="bg-muted px-2 py-0.5 rounded-full text-[10px]">{tasks.length}</span>
                    </CardTitle>
                </CardHeader>
                
                <CardContent className="flex flex-col gap-2 p-2 overflow-y-auto flex-1">
                    <SortableContext items={tasks.map(t => getTaskDndId(t.id))} strategy={verticalListSortingStrategy}>
                        {tasks.map((task) => (
                            <KanbanTask key={task.id} task={task} />
                        ))}
                    </SortableContext>
                </CardContent>

                <div className="p-2">
                    <Button variant="ghost" className="w-full justify-start h-8 text-xs" onClick={onAddTask}>
                        + Добавить задачу
                    </Button>
                </div>
            </Card>
        </div>
    );
}