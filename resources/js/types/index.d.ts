import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

interface ColumnWithTasks {
    id: number;
    title: string;
    position: number;
    tasks: any[];
}

interface BoardData extends Board {
    columns: ColumnWithTasks[];
    users?: User[];
}

export interface Board {
    id: number;
    title: string;
}

export interface Auth {
    user: User;
    boards: Board[];
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface BoardUserPivot {
    role: 'admin' | 'editor' | 'viewer';
    board_id: number;
    user_id: number;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    created_at: string;
    updated_at: string;
    pivot?: BoardUserPivot;
    [key: string]: unknown;
}