import type { LucideIcon } from 'lucide-react';
import {
    Briefcase,
    Calendar,
    ClipboardList,
    Flame,
    LayoutGrid,
    Lightbulb,
    Monitor,
    Rocket,
    StickyNote,
    Target,
} from 'lucide-react';

export const boardIcons = [
    { value: 'layout-grid', label: 'Сетка', icon: LayoutGrid },
    { value: 'clipboard-list', label: 'Задачи', icon: ClipboardList },
    { value: 'sticky-note', label: 'Заметки', icon: StickyNote },
    { value: 'calendar', label: 'Календарь', icon: Calendar },
    { value: 'briefcase', label: 'Проекты', icon: Briefcase },
    { value: 'lightbulb', label: 'Идеи', icon: Lightbulb },
    { value: 'rocket', label: 'Запуск', icon: Rocket },
    { value: 'target', label: 'Цели', icon: Target },
    { value: 'flame', label: 'Спринт', icon: Flame },
    { value: 'monitor', label: 'Работа', icon: Monitor },
] as const;

export type BoardIconValue = (typeof boardIcons)[number]['value'];

const boardIconMap = boardIcons.reduce<Record<string, LucideIcon>>(
    (acc, item) => {
        acc[item.value] = item.icon;
        return acc;
    },
    {},
);

export function getBoardIcon(value?: string | null): LucideIcon {
    return boardIconMap[value ?? ''] ?? LayoutGrid;
}
