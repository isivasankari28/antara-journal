'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Target, ChevronRight, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// Labels/Areas of Life
const AREAS = [
    { id: 'personal', name: 'Personal', color: 'bg-emerald-500/20 text-emerald-600' },
    { id: 'career', name: 'Career', color: 'bg-blue-500/20 text-blue-600' },
    { id: 'devotional', name: 'Devotional', color: 'bg-violet-500/20 text-violet-600' },
    { id: 'hobby', name: 'Hobby', color: 'bg-rose-500/20 text-rose-600' },
];

export default function IntentionsPage() {
    const [intentions, setIntentions] = useState([]);
    const [newIntention, setNewIntention] = useState({ text: '', area: 'personal' });
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('weekly');

    useEffect(() => {
        const saved = localStorage.getItem('antara_intentions');
        if (saved) setIntentions(JSON.parse(saved));
    }, []);

    const saveIntention = () => {
        if (!newIntention.text.trim()) return;
        const newItem = {
            id: Date.now(),
            text: newIntention.text,
            area: newIntention.area,
            cycle: activeTab, // weekly, monthly, yearly
            completed: false,
            createdAt: new Date().toISOString()
        };
        const updated = [...intentions, newItem];
        setIntentions(updated);
        localStorage.setItem('antara_intentions', JSON.stringify(updated));
        setNewIntention({ text: '', area: 'personal' });
        setIsOpen(false);
    };

    const toggleComplete = (id) => {
        const updated = intentions.map(i =>
            i.id === id ? { ...i, completed: !i.completed } : i
        );
        setIntentions(updated);
        localStorage.setItem('antara_intentions', JSON.stringify(updated));
    };

    const deleteIntention = (id) => {
        const updated = intentions.filter(i => i.id !== id);
        setIntentions(updated);
        localStorage.setItem('antara_intentions', JSON.stringify(updated));
    };

    const filteredIntentions = intentions.filter(i => i.cycle === activeTab);

    return (
        <div className="max-w-4xl mx-auto space-y-8 h-full flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-foreground/90">The Garden</h1>
                    <p className="text-muted-foreground mt-1">Plant seeds, not deadlines.</p>
                </div>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-full shadow-sm">
                            <Plus className="w-4 h-4 mr-2" /> Plant Intention
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card">
                        <DialogHeader>
                            <DialogTitle className="font-serif text-xl">New Intention ({activeTab})</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <Input
                                placeholder="What do you wish to grow?"
                                value={newIntention.text}
                                onChange={(e) => setNewIntention({ ...newIntention, text: e.target.value })}
                                className="text-lg"
                            />
                            <div className="flex gap-2 flex-wrap">
                                {AREAS.map(area => (
                                    <button
                                        key={area.id}
                                        onClick={() => setNewIntention({ ...newIntention, area: area.id })}
                                        className={cn(
                                            "px-3 py-1 rounded-full text-xs font-medium transition-all border",
                                            newIntention.area === area.id
                                                ? area.color + " border-current"
                                                : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
                                        )}
                                    >
                                        {area.name}
                                    </button>
                                ))}
                            </div>
                            <Button onClick={saveIntention} className="w-full">Plant</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Tabs defaultValue="weekly" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted/30 p-1 rounded-full">
                    <TabsTrigger value="weekly" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm">Monthly</TabsTrigger>
                    <TabsTrigger value="yearly" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm">Yearly</TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                    <TabsContent value={activeTab} className="space-y-4 mt-0">
                        {filteredIntentions.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="text-center py-20 text-muted-foreground font-light bg-card/20 rounded-2xl border border-dashed border-border"
                            >
                                No seeds planted for this cycle yet.
                            </motion.div>
                        ) : (
                            <div className="grid gap-4">
                                {filteredIntentions.map((intention) => {
                                    const area = AREAS.find(a => a.id === intention.area);
                                    return (
                                        <motion.div
                                            key={intention.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className={cn(
                                                "group flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card/40 transition-all hover:bg-card/60",
                                                intention.completed && "opacity-60 bg-muted/20"
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => toggleComplete(intention.id)}
                                                    className={cn(
                                                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                                                        intention.completed ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/30 hover:border-primary"
                                                    )}
                                                >
                                                    {intention.completed && <Check className="w-3 h-3" />}
                                                </button>
                                                <div>
                                                    <p className={cn(
                                                        "font-serif text-lg leading-tight transition-all",
                                                        intention.completed && "line-through text-muted-foreground"
                                                    )}>
                                                        {intention.text}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className={cn("text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold", area?.color)}>
                                                            {area?.name}
                                                        </span>
                                                        {intention.completed && (
                                                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                                <Target className="w-3 h-3" /> Harvested
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => deleteIntention(intention.id)}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10 hover:text-destructive"
                                            >
                                                Remove
                                            </Button>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </TabsContent>
                </AnimatePresence>
            </Tabs>
        </div>
    );
}
