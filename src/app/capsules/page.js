'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hourglass, Lock, Unlock, Plus, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

export default function CapsulesPage() {
    const [capsules, setCapsules] = useState([]);
    const [newCapsule, setNewCapsule] = useState({ title: '', message: '', revealDate: '' });
    const [isOpen, setIsOpen] = useState(false);
    const [viewingCapsule, setViewingCapsule] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('antara_capsules');
        if (saved) setCapsules(JSON.parse(saved));

        // Refresh every minute to check for unlocked capsules
        const timer = setInterval(() => {
            setCapsules(prev => [...prev]);
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    const saveCapsule = () => {
        if (!newCapsule.title.trim() || !newCapsule.message.trim() || !newCapsule.revealDate) return;

        const capsule = {
            id: Date.now(),
            ...newCapsule,
            createdAt: new Date().toISOString(),
            isRead: false
        };

        const updated = [...capsules, capsule];
        setCapsules(updated);
        localStorage.setItem('antara_capsules', JSON.stringify(updated));
        setNewCapsule({ title: '', message: '', revealDate: '' });
        setIsOpen(false);
    };

    const deleteCapsule = (id) => {
        const updated = capsules.filter(c => c.id !== id);
        setCapsules(updated);
        localStorage.setItem('antara_capsules', JSON.stringify(updated));
        if (viewingCapsule?.id === id) setViewingCapsule(null);
    };

    const isUnlocked = (dateString) => {
        return new Date() >= new Date(dateString);
    };

    const getTimeRemaining = (dateString) => {
        const total = Date.parse(dateString) - Date.now();
        const days = Math.floor(total / (1000 * 60 * 60 * 24));
        const hours = Math.floor((total / (1000 * 60 * 60)) % 24);

        if (days > 0) return `${days} days left`;
        if (hours > 0) return `${hours} hours left`;
        return "Opening soon...";
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif text-foreground/90">Time Vault</h1>
                    <p className="text-muted-foreground mt-1">Send a whisper to your future self.</p>
                </div>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-full shadow-sm">
                            <Plus className="w-4 h-4 mr-2" /> Bury Capsule
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card">
                        <DialogHeader>
                            <DialogTitle className="font-serif text-xl">Create Time Capsule</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <Input
                                placeholder="Title (e.g., On my 30th Birthday)"
                                value={newCapsule.title}
                                onChange={(e) => setNewCapsule({ ...newCapsule, title: e.target.value })}
                            />
                            <Textarea
                                placeholder="Message to the future..."
                                value={newCapsule.message}
                                onChange={(e) => setNewCapsule({ ...newCapsule, message: e.target.value })}
                                className="min-h-[150px]"
                            />
                            <div className="space-y-2">
                                <label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Unlock Date</label>
                                <Input
                                    type="datetime-local"
                                    value={newCapsule.revealDate}
                                    onChange={(e) => setNewCapsule({ ...newCapsule, revealDate: e.target.value })}
                                    min={new Date().toISOString().slice(0, 16)}
                                />
                            </div>
                            <Button onClick={saveCapsule} className="w-full">Seal & Bury</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {capsules.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full py-20 text-center text-muted-foreground italic bg-muted/10 rounded-xl border border-dashed border-border/50"
                        >
                            The vault is empty. No echoes from the past yet.
                        </motion.div>
                    )}
                    {capsules.sort((a, b) => new Date(a.revealDate) - new Date(b.revealDate)).map((capsule) => {
                        const unlocked = isUnlocked(capsule.revealDate);

                        return (
                            <motion.div
                                key={capsule.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => unlocked && setViewingCapsule(capsule)}
                                className={cn(
                                    "relative p-6 rounded-xl border transition-all cursor-pointer overflow-hidden flex flex-col justify-between h-56 group",
                                    unlocked
                                        ? "bg-card/60 border-primary/20 hover:border-primary hover:shadow-md"
                                        : "bg-muted/30 border-border/50 opacity-80"
                                )}
                            >
                                <div className="space-y-2 relative z-10">
                                    <div className="flex justify-between items-start">
                                        <div className={cn(
                                            "p-2 rounded-full w-fit",
                                            unlocked ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                                        )}>
                                            {unlocked ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                                        </div>
                                        {!unlocked && (
                                            <span className="text-xs font-mono text-muted-foreground flex items-center gap-1 bg-background/50 px-2 py-1 rounded-md">
                                                <Hourglass className="w-3 h-3" /> {getTimeRemaining(capsule.revealDate)}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className={cn(
                                        "font-serif text-xl line-clamp-2",
                                        !unlocked && "blur-[2px] select-none"
                                    )}>
                                        {capsule.title}
                                    </h3>
                                    {unlocked && (
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {capsule.message}
                                        </p>
                                    )}
                                </div>

                                <div className="text-xs text-muted-foreground mt-4 flex items-center gap-2">
                                    <CalendarIcon className="w-3 h-3" />
                                    <span>Opens {new Date(capsule.revealDate).toLocaleDateString()}</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* View Capsule Modal */}
            <Dialog open={!!viewingCapsule} onOpenChange={(open) => !open && setViewingCapsule(null)}>
                <DialogContent className="max-w-2xl bg-card border-primary/20">
                    <DialogHeader>
                        <div className="flex items-center gap-2 text-primary mb-2">
                            <Unlock className="w-4 h-4" />
                            <span className="text-xs font-medium uppercase tracking-widest">Capsule Unsealed</span>
                        </div>
                        <DialogTitle className="font-serif text-3xl">{viewingCapsule?.title}</DialogTitle>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Buried on {viewingCapsule && new Date(viewingCapsule.createdAt).toLocaleDateString()}
                        </p>
                    </DialogHeader>
                    <div className="py-6 max-h-[60vh] overflow-y-auto">
                        <p className="text-lg leading-relaxed whitespace-pre-wrap font-serif text-foreground/90">
                            {viewingCapsule?.message}
                        </p>
                    </div>
                    <div className="flex justify-end gap-2 pt-4 border-t border-border/50">
                        <Button variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => deleteCapsule(viewingCapsule.id)}>
                            <Trash2 className="w-4 h-4 mr-2" /> Discard Memory
                        </Button>
                        <Button onClick={() => setViewingCapsule(null)}>Close</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function Trash2({ className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            <line x1="10" x2="10" y1="11" y2="17" />
            <line x1="14" x2="14" y1="11" y2="17" />
        </svg>
    )
}
