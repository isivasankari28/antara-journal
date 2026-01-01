'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

export default function ManifestationPage() {
    const [affirmations, setAffirmations] = useState([]);
    const [newAffirmation, setNewAffirmation] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('affirmations');
        if (saved) {
            setAffirmations(JSON.parse(saved));
        }
    }, []);

    const saveAffirmations = (updated) => {
        setAffirmations(updated);
        localStorage.setItem('affirmations', JSON.stringify(updated));
    };

    const addAffirmation = () => {
        if (!newAffirmation.trim()) return;
        const item = { id: Date.now(), text: newAffirmation };
        saveAffirmations([item, ...affirmations]);
        setNewAffirmation('');
        setIsOpen(false);
    };

    const removeAffirmation = (id) => {
        saveAffirmations(affirmations.filter(a => a.id !== id));
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif text-foreground/90">My Reality</h1>
                    <p className="text-muted-foreground">Speak it into existence.</p>
                </div>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80">
                            <Plus className="w-4 h-4 mr-2" />
                            Claim New
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="font-serif">I am...</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <Textarea
                                value={newAffirmation}
                                onChange={(e) => setNewAffirmation(e.target.value)}
                                placeholder="Write your affirmation in present tense..."
                                className="text-lg bg-transparent resize-none border-none focus-visible:ring-0"
                            />
                            <div className="flex justify-end">
                                <Button onClick={addAffirmation} className="rounded-full">Manifest</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {affirmations.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative group aspect-square rounded-2xl bg-gradient-to-br from-card to-card/50 p-8 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all duration-500"
                        >
                            <Sun className="w-8 h-8 text-primary/20 mb-4" />
                            <p className="font-serif text-xl md:text-2xl text-foreground/90 leading-relaxed max-w-xs">
                                {item.text}
                            </p>

                            <button
                                onClick={() => removeAffirmation(item.id)}
                                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {affirmations.length === 0 && (
                    <div className="col-span-full text-center py-20 text-muted-foreground/40 font-serif text-lg">
                        Your canvas is blank. What do you desire?
                    </div>
                )}
            </div>
        </div>
    );
}
