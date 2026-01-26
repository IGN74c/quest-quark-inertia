import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/home-layout';
import { dashboard, login, register } from '@/routes';
import { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Quote } from 'lucide-react';
import AppHeroImage from './welcome/components/hero-image';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout>
            <Head title="Quest Quark — Минималистичная канбан-доска для ясности и порядка">
                <meta
                    name="description"
                    content="Quest Quark — простая, быстрая и красивая канбан-доска для личных и командных проектов."
                />
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>

            {/* Главный герой */}
            <section className="flex min-h-screen items-center px-6 py-16 lg:py-24">
                <div className="mx-auto w-full max-w-7xl">
                    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                        {/* Текстовая часть — всегда сверху на мобильных */}
                        <div className="order-2 space-y-12 text-center lg:order-1 lg:text-left">
                            <div className="space-y-8">
                                <div className="flex items-center justify-center gap-4 lg:justify-start">
                                    <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                                        Quest Quark
                                    </h1>
                                </div>

                                <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl lg:mx-0 lg:text-2xl">
                                    Минималистичная канбан-доска для тех,
                                    <br className="hidden sm:inline" />
                                    кто хочет ясности, скорости и полного
                                    контроля над задачами.
                                </p>
                            </div>

                            {/* Кнопки */}
                            <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                                {auth.user ? (
                                    <Button
                                        asChild
                                        size="lg"
                                        className="px-8 py-6 text-lg"
                                    >
                                        <Link href={dashboard().url}>
                                            Перейти к доскам
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Link>
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            asChild
                                            size="lg"
                                            className="px-8 py-6 text-lg"
                                        >
                                            <Link href={login().url}>
                                                Войти
                                            </Link>
                                        </Button>
                                        {canRegister && (
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="lg"
                                                className="px-8 py-6 text-lg"
                                            >
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
                        <div className="order-1 flex justify-center lg:order-2">
                            <div className="w-full max-w-lg lg:max-w-xl">
                                <AppHeroImage />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Как это работает */}
            <section className="mb-56 px-6">
                <div className="mx-auto max-w-5xl">
                    <h2 className="mb-16 text-center text-3xl font-bold md:text-4xl">
                        Всё просто. Три шага — и вы в потоке.
                    </h2>
                    <div className="grid gap-12 md:grid-cols-3">
                        <div className="space-y-4 text-center">
                            <h3 className="text-xl font-semibold">
                                Создайте доску
                            </h3>
                            <p className="text-muted-foreground">
                                Одна доска — один проект. Или один поток жизни.
                                Как угодно.
                            </p>
                        </div>
                        <div className="space-y-4 text-center">
                            <h3 className="text-xl font-semibold">
                                Добавьте задачи
                            </h3>
                            <p className="text-muted-foreground">
                                Перетаскивайте, сортируйте, отмечайте. Всё
                                мгновенно.
                            </p>
                        </div>
                        <div className="space-y-4 text-center">
                            <h3 className="text-xl font-semibold">
                                Достигайте целей
                            </h3>
                            <p className="text-muted-foreground">
                                Чистое пространство. Чистые мысли. Чистые
                                результаты.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mb-48 rounded-xl bg-muted/30 px-6 py-12">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                            Всё, что нужно для продуктивности
                        </h2>
                    </div>

                    {/* Bento Grid */}
                    <div className="grid auto-rows-auto grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Карточка 1: Большая — Kanban в действии */}
                        <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-8 shadow-lg lg:col-span-2 lg:row-span-2">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-60" />
                            <div className="relative z-10">
                                <h3 className="mb-4 text-2xl font-bold">
                                    Перетаскивайте задачи
                                </h3>
                                <p className="mb-6 text-muted-foreground">
                                    Интуитивный drag-and-drop. Мгновенная
                                    синхронизация.
                                </p>
                                <div className="flex gap-4">
                                    <div className="flex h-40 w-32 items-center justify-center rounded-xl border-2 border-dashed border-primary/30 bg-primary/10">
                                        <span className="font-medium text-primary/60">
                                            Новая
                                        </span>
                                    </div>
                                    <div className="flex h-40 w-32 items-center justify-center rounded-xl bg-primary/20">
                                        <span className="font-bold">→</span>
                                    </div>
                                    <div className="flex h-40 w-32 items-center justify-center rounded-xl border-2 border-green-500/40 bg-green-500/20">
                                        <span className="font-medium text-green-600">
                                            Завершена
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Карточка 2: Статистика */}
                        <div className="rounded-2xl border border-border/50 bg-card p-8 shadow-lg">
                            <h4 className="mb-2 text-xl font-semibold">
                                Без ограничений
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                Доски, колонки, задачи — сколько угодно.
                            </p>
                        </div>

                        {/* Карточка 3: Скорость */}
                        <div className="rounded-2xl border border-border/50 bg-card p-8 shadow-lg">
                            <h4 className="mb-2 text-xl font-semibold">
                                Мгновенно
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                Изменения в реальном времени. Никаких задержек.
                            </p>
                        </div>

                        {/* Карточка 5: Команды */}
                        <div className="rounded-2xl border border-border/50 bg-card p-8 shadow-lg lg:col-span-2">
                            <h4 className="mb-4 text-xl font-semibold">
                                Работайте вместе
                            </h4>
                            <p className="mb-6 text-muted-foreground">
                                Приглашайте участников, назначайте задачи,
                                следите за прогрессом.
                            </p>
                            <div className="flex -space-x-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-background bg-muted text-sm font-medium">
                                    А
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-background bg-muted text-sm font-medium">
                                    М
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-background bg-muted text-sm font-medium">
                                    Д
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-background bg-muted/60 text-xs font-medium">
                                    +3
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Преимущества */}
            <section className="mb-48 px-6 py-24">
                <div className="mx-auto max-w-5xl">
                    <h2 className="mb-16 text-center text-3xl font-bold md:text-4xl">
                        Почему Quest Quark
                    </h2>
                    <div className="grid gap-12 md:grid-cols-3">
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">
                                Приватность превыше всего
                            </h3>
                            <p className="text-muted-foreground">
                                Никаких трекеров. Никакой рекламы. Ваши данные —
                                только ваши.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">
                                Молниеносная скорость
                            </h3>
                            <p className="text-muted-foreground">
                                Оптимизировано до последнего байта. Работает
                                даже на слабом соединении.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">
                                Для одного или для команды
                            </h3>
                            <p className="text-muted-foreground">
                                Работайте в одиночку или приглашайте коллег. Без
                                лишних сложностей.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Отзывы */}
            <section className="mb-12 rounded-xl bg-muted/30 px-6 py-24">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="mb-16 text-3xl font-bold md:text-4xl">
                        Что говорят пользователи
                    </h2>
                    <div className="grid gap-8 md:grid-cols-3">
                        <figure className="space-y-4">
                            <Quote className="mx-auto h-8 w-8 text-primary/30" />
                            <blockquote className="text-lg text-muted-foreground italic">
                                "Наконец-то инструмент, который не отвлекает.
                                Просто берёшь и делаешь."
                            </blockquote>
                            <figcaption className="text-sm font-medium">
                                — Алексей, разработчик
                            </figcaption>
                        </figure>
                        <figure className="space-y-4">
                            <Quote className="mx-auto h-8 w-8 text-primary/30" />
                            <blockquote className="text-lg text-muted-foreground italic">
                                "Перешёл с Trello. Не вернусь. Здесь всё быстрее
                                и чище."
                            </blockquote>
                            <figcaption className="text-sm font-medium">
                                — Марина, продакт-менеджер
                            </figcaption>
                        </figure>
                        <figure className="space-y-4">
                            <Quote className="mx-auto h-8 w-8 text-primary/30" />
                            <blockquote className="text-lg text-muted-foreground italic">
                                "Идеально для личных проектов. Никакого шума —
                                только задачи."
                            </blockquote>
                            <figcaption className="text-sm font-medium">
                                — Дмитрий, фрилансер
                            </figcaption>
                        </figure>
                    </div>
                </div>
            </section>

            {/* Финальный призыв к действию */}
            <section className="px-6 py-32 text-center">
                <div className="mx-auto max-w-3xl space-y-8">
                    <h2 className="text-4xl font-bold md:text-5xl">
                        Готовы к ясности?
                    </h2>
                    <p className="text-xl text-muted-foreground">
                        Присоединяйтесь к тем, кто уже упростил свою работу и
                        жизнь.
                    </p>
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        {auth.user ? (
                            <Button
                                asChild
                                size="lg"
                                className="px-10 py-7 text-lg"
                            >
                                <Link href={dashboard().url}>
                                    Открыть доски
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        ) : (
                            <>
                                <Button
                                    asChild
                                    size="lg"
                                    className="px-10 py-7 text-lg"
                                >
                                    <Link href={register().url}>
                                        Начать бесплатно
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    size="lg"
                                    className="px-10 py-7 text-lg"
                                >
                                    <Link href={login().url}>
                                        У меня уже есть аккаунт
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Футер */}
            <footer className="border-t px-6 py-12 text-center text-sm text-muted-foreground">
                © 2025 Quest Quark. Сделано с заботой о вашем внимании и
                времени.
            </footer>
        </AppLayout>
    );
}
