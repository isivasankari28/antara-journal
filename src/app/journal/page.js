'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Calendar, Sparkles, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const GUIDED_PROMPTS = [
    { category: 'Clarity', text: "What is the one thing I need to focus on today, and why?" },
    { category: 'Anxiety', text: "What is the evidence for and against the thought that is worrying me?" },
    { category: 'Gratitude', text: "What are three small things that brought me joy today?" },
    { category: 'Reflection', text: "What did I learn about myself recently?" },
];

export default function JournalPage() {
    const [entries, setEntries] = useState([]);
    const [newEntry, setNewEntry] = useState({ title: '', content: '' });
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('journal_entries');
        if (saved) {
            setEntries(JSON.parse(saved));
        }
    }, []);

    const saveEntry = () => {
        if (!newEntry.content.trim()) return;

        const entry = {
            id: Date.now(),
            title: newEntry.title || 'Untitled',
            content: newEntry.content,
            date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            timestamp: new Date().toISOString(),
        };

        const updated = [entry, ...entries];
        setEntries(updated);
        localStorage.setItem('journal_entries', JSON.stringify(updated));
        setNewEntry({ title: '', content: '' });
        setIsOpen(false);
    };

    const deleteEntry = (id) => {
        const updated = entries.filter(e => e.id !== id);
        setEntries(updated);
        localStorage.setItem('journal_entries', JSON.stringify(updated));
    };

    const insertPrompt = (text) => {
        setNewEntry(prev => ({
            ...prev,
            content: prev.content ? `${prev.content}\n\n**Prompt:** ${text}\n` : `**Prompt:** ${text}\n`
        }));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif text-foreground/90">Daily Journal</h1>
                    <p className="text-muted-foreground mt-1">Unburden your mind.</p>
                </div>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm">
                            <Plus className="w-4 h-4 mr-2" />
                            New Entry
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-md border border-border/50">
                        <DialogHeader>
                            <DialogTitle className="font-serif text-2xl font-normal text-center">Write</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <Input
                                placeholder="Title (Optional)"
                                value={newEntry.title}
                                onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                                className="bg-transparent border-none text-xl font-medium placeholder:text-muted-foreground/50 focus-visible:ring-0 px-0"
                            />

                            <div className="flex flex-wrap gap-2 pb-2">
                                {GUIDED_PROMPTS.map((prompt) => (
                                    <button
                                        key={prompt.category}
                                        onClick={() => insertPrompt(prompt.text)}
                                        className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full hover:bg-primary/20 transition-colors flex items-center gap-1"
                                    >
                                        <Sparkles className="w-3 h-3" /> {prompt.category}
                                    </button>
                                ))}
                            </div>

                            <Textarea
                                placeholder="Start writing..."
                                className="min-h-[350px] bg-transparent resize-none border-none focus-visible:ring-0 text-lg leading-relaxed p-0 placeholder:text-muted-foreground/30 scrollbar-hide"
                                value={newEntry.content}
                                onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                            />
                            <div className="flex justify-end gap-2 pt-4">
                                <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                                <Button onClick={saveEntry} className="rounded-full">
                                    <Save className="w-4 h-4 mr-2" /> Save
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                <AnimatePresence>
                    {entries.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full text-center py-20 text-muted-foreground font-light"
                        >
                            No entries yet. Start writing...
                        </motion.div>
                    ) : (
                        entries.map((entry) => (
                            <motion.div
                                key={entry.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                layout
                            >
                                <Card className="h-full bg-card/40 border-border/50 hover:border-primary/30 transition-colors group relative overflow-hidden flex flex-col">
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="font-serif font-normal text-lg line-clamp-1">{entry.title || 'Untitled'}</CardTitle>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{entry.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <p className="whitespace-pre-wrap leading-relaxed text-foreground/80 font-serif text-sm line-clamp-6">
                                            {typeof entry.content === 'string' ? entry.content : ''}
                                        </p>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteEntry(entry.id);
                                            }}
                                            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive h-8 w-8"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
