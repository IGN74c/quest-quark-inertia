import { Head, Link, usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import AppLayout from '@/layouts/home-layout';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Zap, Shield, Users, ChevronRight, Quote } from 'lucide-react';
import { dashboard, login, register } from '@/routes';
import AppHeroImage from '@/components/home/hero-image';

export default function Welcome({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout>
            <Head title="Quest Quark — Минималистичная канбан-доска для ясности и порядка">
                <meta name="description" content="Quest Quark — простая, быстрая и красивая канбан-доска для личных и командных проектов." />
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
            </Head>

            {/* Главный герой */}
            <section className="min-h-screen flex items-center px-6 py-16 lg:py-24">
                <div className="max-w-7xl mx-auto w-full">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                        {/* Текстовая часть — всегда сверху на мобильных */}
                        <div className="text-center lg:text-left space-y-12 order-2 lg:order-1">
                            <div className="space-y-8">
                                <div className="flex items-center justify-center lg:justify-start gap-4">
                                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                                        Quest Quark
                                    </h1>
                                </div>

                                <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                    Минималистичная канбан-доска для тех,<br className="hidden sm:inline" />
                                    кто хочет ясности, скорости и полного контроля над задачами.
                                </p>
                            </div>

                            {/* Кнопки */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                {auth.user ? (
                                    <Button asChild size="lg" className="text-lg px-8 py-6">
                                        <Link href={dashboard().url}>
                                            Перейти к доскам
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Link>
                                    </Button>
                                ) : (
                                    <>
                                        <Button asChild size="lg" className="text-lg px-8 py-6">
                                            <Link href={login().url}>Войти</Link>
                                        </Button>
                                        {canRegister && (
                                            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                                                <Link href={register().url}>
                                                    Зарегистрироваться
                                                    <ArrowRight className="ml-2 h-5 w-5" />
                                                </Link>
                                            </Button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Иллюстрация — снизу на мобильных, справа на десктопе */}
                        <div className="order-1 lg:order-2 flex justify-center">
                            <div className="w-full max-w-lg lg:max-w-xl">
                                <AppHeroImage />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Как это работает */}
            <section className="px-6 mb-56">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                        Всё просто. Три шага — и вы в потоке.
                    </h2>
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="text-center space-y-4">
                            <h3 className="text-xl font-semibold">Создайте доску</h3>
                            <p className="text-muted-foreground">
                                Одна доска — один проект. Или один поток жизни. Как угодно.
                            </p>
                        </div>
                        <div className="text-center space-y-4">
                            <h3 className="text-xl font-semibold">Добавьте задачи</h3>
                            <p className="text-muted-foreground">
                                Перетаскивайте, сортируйте, отмечайте. Всё мгновенно.
                            </p>
                        </div>
                        <div className="text-center space-y-4">
                            <h3 className="text-xl font-semibold">Достигайте целей</h3>
                            <p className="text-muted-foreground">
                                Чистое пространство. Чистые мысли. Чистые результаты.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 mb-48 px-6 bg-muted/30 rounded-xl">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Всё, что нужно для продуктивности
                        </h2>
                    </div>

                    {/* Bento Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-auto">
                        {/* Карточка 1: Большая — Kanban в действии */}
                        <div className="lg:col-span-2 lg:row-span-2 bg-card rounded-2xl p-8 shadow-lg border border-border/50 overflow-hidden relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-60" />
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold mb-4">Перетаскивайте задачи</h3>
                                <p className="text-muted-foreground mb-6">
                                    Интуитивный drag-and-drop. Мгновенная синхронизация.
                                </p>
                                <div className="flex gap-4">
                                    <div className="w-32 h-40 bg-primary/10 rounded-xl border-2 border-dashed border-primary/30 flex items-center justify-center">
                                        <span className="text-primary/60 font-medium">Новая</span>
                                    </div>
                                    <div className="w-32 h-40 bg-primary/20 rounded-xl flex items-center justify-center">
                                        <span className="font-bold">→</span>
                                    </div>
                                    <div className="w-32 h-40 bg-green-500/20 rounded-xl border-2 border-green-500/40 flex items-center justify-center">
                                        <span className="text-green-600 font-medium">Завершена</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Карточка 2: Статистика */}
                        <div className="bg-card rounded-2xl p-8 shadow-lg border border-border/50">
                            <h4 className="text-xl font-semibold mb-2">Без ограничений</h4>
                            <p className="text-sm text-muted-foreground">
                                Доски, колонки, задачи — сколько угодно.
                            </p>
                        </div>

                        {/* Карточка 3: Скорость */}
                        <div className="bg-card rounded-2xl p-8 shadow-lg border border-border/50">
                            <h4 className="text-xl font-semibold mb-2">Мгновенно</h4>
                            <p className="text-sm text-muted-foreground">
                                Изменения в реальном времени. Никаких задержек.
                            </p>
                        </div>

                        {/* Карточка 5: Команды */}
                        <div className="lg:col-span-2 bg-card rounded-2xl p-8 shadow-lg border border-border/50">
                            <h4 className="text-xl font-semibold mb-4">Работайте вместе</h4>
                            <p className="text-muted-foreground mb-6">
                                Приглашайте участников, назначайте задачи, следите за прогрессом.
                            </p>
                            <div className="flex -space-x-3">
                                <div className="w-12 h-12 rounded-full bg-muted border-2 border-background flex items-center justify-center text-sm font-medium">А</div>
                                <div className="w-12 h-12 rounded-full bg-muted border-2 border-background flex items-center justify-center text-sm font-medium">М</div>
                                <div className="w-12 h-12 rounded-full bg-muted border-2 border-background flex items-center justify-center text-sm font-medium">Д</div>
                                <div className="w-12 h-12 rounded-full bg-muted/60 border-2 border-background flex items-center justify-center text-xs font-medium">+3</div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Преимущества */}
            <section className="py-24 mb-48 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                        Почему Quest Quark
                    </h2>
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">Приватность превыше всего</h3>
                            <p className="text-muted-foreground">
                                Никаких трекеров. Никакой рекламы. Ваши данные — только ваши.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">Молниеносная скорость</h3>
                            <p className="text-muted-foreground">
                                Оптимизировано до последнего байта. Работает даже на слабом соединении.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">Для одного или для команды</h3>
                            <p className="text-muted-foreground">
                                Работайте в одиночку или приглашайте коллег. Без лишних сложностей.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Отзывы */}
            <section className="py-24 mb-12 px-6 bg-muted/30 rounded-xl">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-16">
                        Что говорят пользователи
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <figure className="space-y-4">
                            <Quote className="h-8 w-8 text-primary/30 mx-auto" />
                            <blockquote className="text-lg italic text-muted-foreground">
                                "Наконец-то инструмент, который не отвлекает. Просто берёшь и делаешь."
                            </blockquote>
                            <figcaption className="text-sm font-medium">— Алексей, разработчик</figcaption>
                        </figure>
                        <figure className="space-y-4">
                            <Quote className="h-8 w-8 text-primary/30 mx-auto" />
                            <blockquote className="text-lg italic text-muted-foreground">
                                "Перешёл с Trello. Не вернусь. Здесь всё быстрее и чище."
                            </blockquote>
                            <figcaption className="text-sm font-medium">— Марина, продакт-менеджер</figcaption>
                        </figure>
                        <figure className="space-y-4">
                            <Quote className="h-8 w-8 text-primary/30 mx-auto" />
                            <blockquote className="text-lg italic text-muted-foreground">
                                "Идеально для личных проектов. Никакого шума — только задачи."
                            </blockquote>
                            <figcaption className="text-sm font-medium">— Дмитрий, фрилансер</figcaption>
                        </figure>
                    </div>
                </div>
            </section>

            {/* Финальный призыв к действию */}
            <section className="py-32 px-6 text-center">
                <div className="max-w-3xl mx-auto space-y-8">
                    <h2 className="text-4xl md:text-5xl font-bold">
                        Готовы к ясности?
                    </h2>
                    <p className="text-xl text-muted-foreground">
                        Присоединяйтесь к тем, кто уже упростил свою работу и жизнь.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {auth.user ? (
                            <Button asChild size="lg" className="text-lg px-10 py-7">
                                <Link href={dashboard().url}>
                                    Открыть доски
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        ) : (
                            <>
                                <Button asChild size="lg" className="text-lg px-10 py-7">
                                    <Link href={register().url}>Начать бесплатно</Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="text-lg px-10 py-7">
                                    <Link href={login().url}>У меня уже есть аккаунт</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Футер */}
            <footer className="py-12 px-6 text-center text-sm text-muted-foreground border-t">
                © 2025 Quest Quark. Сделано с заботой о вашем внимании и времени.
            </footer>
        </AppLayout>
    );
}