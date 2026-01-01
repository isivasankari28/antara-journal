'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BookOpen, PenTool, CheckSquare, Sparkles, Home, Settings, Heart, Flame, Sprout, Library, Hourglass } from 'lucide-react';

const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Journal', href: '/journal', icon: BookOpen },
    { name: 'Intentions', href: '/intentions', icon: Sprout },
    { name: 'Library', href: '/library', icon: Library },
    { name: 'Capsules', href: '/capsules', icon: Hourglass },
    { name: 'Letters', href: '/letters', icon: PenTool },
    { name: 'To-do', href: '/todos', icon: CheckSquare },
    { name: 'Manifest', href: '/manifestation', icon: Sparkles },
    { name: 'Gratitude', href: '/gratitude', icon: Heart },
    { name: 'Burn', href: '/burn', icon: Flame },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export function AppSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-20 md:w-64 border-r border-sidebar-border bg-sidebar/50 backdrop-blur-sm p-4 hidden md:flex flex-col gap-6 transition-all duration-300">
            <div className="flex items-center justify-center md:justify-start gap-2 px-2 py-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-serif text-primary text-xl">A</span>
                </div>
                <span className="font-serif text-xl tracking-wide hidden md:block text-sidebar-foreground">Antara</span>
            </div>

            <nav className="flex flex-col gap-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group",
                                isActive
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                            )}
                        >
                            <Icon className={cn("w-5 h-5 transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")} />
                            <span className="hidden md:block font-medium tracking-wide text-sm">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto px-4 py-4 text-xs text-muted-foreground hidden md:block text-center">
                <p>Silence & Safety</p>
            </div>
        </aside>
    );
}
