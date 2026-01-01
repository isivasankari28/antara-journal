'use client';

import { useTheme } from "@/components/layout/ThemeController";
import { cn } from "@/lib/utils";

export default function LayoutWrapper({ children, className }) {
    const { font } = useTheme();

    return (
        <div className={cn(
            className,
            font === 'serif' ? 'font-serif' : 'font-sans'
        )}>
            {children}
        </div>
    );
}
