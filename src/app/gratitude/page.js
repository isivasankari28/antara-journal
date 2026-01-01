'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function GratitudePage() {
    const [gratitudes, setGratitudes] = useState([]);
    const [note, setNote] = useState('');
    const [isDropping, setIsDropping] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('gratitude_jar');
        if (saved) {
            setGratitudes(JSON.parse(saved));
        }
    }, []);

    const addGratitude = () => {
        if (!note.trim()) return;

        setIsDropping(true);

        setTimeout(() => {
            const item = { id: Date.now(), text: note, date: new Date().toLocaleDateString() };
            const updated = [item, ...gratitudes];
            setGratitudes(updated);
            localStorage.setItem('gratitude_jar', JSON.stringify(updated));
            setNote('');
            setIsDropping(false);
        }, 1200); // Animation duration
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 h-[80vh] flex flex-col md:flex-row gap-8 items-center">

            {/* Interaction Side */}
            <div className="flex-1 space-y-6 w-full">
                <div className="space-y-2">
                    <h1 className="text-3xl font-serif text-foreground/90">Gratitude Jar</h1>
                    <p className="text-muted-foreground">Drop a moment of thanks.</p>
                </div>

                <div className="relative">
                    <Textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="I am thankful for..."
                        className="min-h-[150px] bg-card/60 backdrop-blur-sm resize-none border-border/50 text-lg p-4 rounded-xl"
                    />
                    <Button
                        onClick={addGratitude}
                        disabled={!note.trim() || isDropping}
                        className="absolute bottom-4 right-4 rounded-full"
                    >
                        Drop Note <Heart className="w-4 h-4 ml-2 fill-current" />
                    </Button>
                </div>
            </div>

            {/* Visual Jar Side */}
            <div className="flex-1 h-full w-full flex flex-col items-center justify-end relative bg-muted/20 rounded-t-full border-x-2 border-b-2 border-primary/20 pb-4 overflow-hidden min-h-[400px]">
                {/* Jar Rim */}
                <div className="absolute top-0 w-32 h-4 bg-primary/10 border border-primary/20 rounded-full" />

                <AnimatePresence>
                    {/* Dropping Animation */}
                    {isDropping && (
                        <motion.div
                            initial={{ y: -50, opacity: 1, rotate: 0 }}
                            animate={{ y: 200, opacity: 0, rotate: 360 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }}
                            className="absolute top-10 z-10"
                        >
                            <div className="bg-card px-4 py-2 rounded-lg shadow-md border border-primary/20 text-xs">
                                {note.slice(0, 15)}...
                            </div>
                        </motion.div>
                    )}

                    {/* Notes in Jar */}
                    <div className="w-full px-8 flex flex-wrap-reverse justify-center gap-2 max-h-[400px] overflow-hidden">
                        {gratitudes.map((g, i) => (
                            <motion.div
                                key={g.id}
                                initial={{ opacity: 0, y: -20, rotate: Math.random() * 20 - 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-paper bg-card text-card-foreground p-3 rounded-lg shadow-sm border border-border/60 text-xs max-w-[120px] truncate cursor-help hover:scale-110 transition-transform"
                                title={g.text}
                                style={{ rotate: (i % 2 === 0 ? 5 : -5) }}
                            >
                                {g.text}
                            </motion.div>
                        ))}
                    </div>
                </AnimatePresence>
            </div>

        </div>
    );
}
