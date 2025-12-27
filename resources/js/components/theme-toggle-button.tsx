import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Moon, Sun } from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';

export function ThemeToggleButton() {
    const { appearance, updateAppearance } = useAppearance();

    const isDark = appearance === 'dark' ||
        (appearance === 'system' && 
         (typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false));

    const toggleTheme = () => {
        const next = isDark ? 'light' : 'dark';
        updateAppearance(next);
    };

    const getIcon = () => {
        return isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />;
    };

    const getTooltip = () => {
        return isDark ? 'Светлая тема' : 'Тёмная тема';
    };

    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-10 rounded-full"
                        onClick={toggleTheme}
                        aria-label={getTooltip()}
                    >
                        {getIcon()}
                        <span className="sr-only">{getTooltip()}</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{getTooltip()}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}