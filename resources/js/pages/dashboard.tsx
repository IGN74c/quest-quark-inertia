import { Plus, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';
import boardsRoute from '@/routes/boards';

interface Board {
    id: number;
    title: string;
    pivot?: { role: string };
}

export default function Dashboard({ boards = [] }: { boards: Board[] }) {
    const [open, setOpen] = useState(false);
    const [inviteOpen, setInviteOpen] = useState(false);
    const [selectedBoard, setSelectedBoard] = useState<number | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({ title: '' });
    const inviteForm = useForm({ email: '' });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(boardsRoute.store().url, { 
            onSuccess: () => { 
                setOpen(false); 
                reset(); 
            } 
        });
    };

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBoard) return;
        
        inviteForm.post(boardsRoute.invite(selectedBoard).url, {
            onSuccess: () => { 
                setInviteOpen(false); 
                setSelectedBoard(null);
                inviteForm.reset(); 
            }
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Мои доски</h1>
                    <Button size="sm" onClick={() => setOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Создать
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {boards.map((board) => (
                        <div key={board.id} className="group relative aspect-video rounded-xl border bg-card p-4 hover:shadow-md transition-all">
                            {/* Добавлен .url */}
                            <Link href={boardsRoute.show(board.id).url} className="absolute inset-0" />
                            
                            <div className="flex justify-between items-start relative z-10">
                                <h3 className="font-bold">{board.title}</h3>
                                {board.pivot?.role === 'admin' && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 opacity-0 group-hover:opacity-100"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setSelectedBoard(board.id);
                                            setInviteOpen(true);
                                        }}
                                    >
                                        <UserPlus className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                            <div className="absolute bottom-4 left-4 text-[10px] uppercase tracking-wider text-muted-foreground">
                                {board.pivot?.role}
                            </div>
                        </div>
                    ))}

                    <button onClick={() => setOpen(true)} className="aspect-video flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/20 hover:bg-accent transition-all">
                        <Plus className="h-8 w-8 text-muted-foreground" />
                        <span className="mt-2 text-sm font-medium text-muted-foreground">Новая доска</span>
                    </button>
                </div>
            </div>

            {/* Модалка создания доски (УСЛОВИЕ УБРАНО) */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <form onSubmit={submit}>
                        <DialogHeader><DialogTitle>Новая доска</DialogTitle></DialogHeader>
                        <div className="py-4 space-y-2">
                            <Label>Название</Label>
                            <Input 
                                value={data.title} 
                                onChange={e => setData('title', e.target.value)} 
                                autoFocus
                            />
                            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={processing}>Создать</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Модалка приглашения пользователя */}
            <Dialog open={inviteOpen} onOpenChange={(val) => {
                setInviteOpen(val);
                if(!val) setSelectedBoard(null);
            }}>
                <DialogContent>
                    <form onSubmit={handleInvite}>
                        <DialogHeader><DialogTitle>Пригласить пользователя</DialogTitle></DialogHeader>
                        <div className="py-4 space-y-4">
                            <div className="space-y-2">
                                <Label>Email пользователя</Label>
                                <Input
                                    type="email"
                                    value={inviteForm.data.email}
                                    onChange={e => inviteForm.setData('email', e.target.value)}
                                    placeholder="user@example.com"
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={inviteForm.processing}>
                                Отправить приглашение
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}