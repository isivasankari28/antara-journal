'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export default function BurnPage() {
    const [text, setText] = useState('');
    const [isBurning, setIsBurning] = useState(false);
    const [isAsh, setIsAsh] = useState(false);

    const handleBurn = () => {
        if (!text.trim()) return;
        setIsBurning(true);

        // Simulate burning process
        setTimeout(() => {
            setText('');
            setIsBurning(false);
            setIsAsh(true);
            setTimeout(() => setIsAsh(false), 3000); // Reset after 3s
        }, 2500);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 flex flex-col items-center justify-center min-h-[80vh]">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-serif text-foreground/90 flex items-center justify-center gap-2">
                    <Flame className="w-6 h-6 text-orange-500/80" /> Burn Ritual
                </h1>
                <p className="text-muted-foreground text-sm max-w-md">
                    Write down what is heavy on your heart. Watch it burn away.
                    <br />Nothing is saved. This is for release.
                </p>
            </div>

            <div className="relative w-full">
                <AnimatePresence mode="wait">
                    {!isAsh ? (
                        <motion.div
                            key="paper"
                            exit={{
                                opacity: 0,
                                scale: 0.8,
                                filter: "blur(10px) brightness(0)",
                                transition: { duration: 1.5 }
                            }}
                            className="relative"
                        >
                            <div className={cn(
                                "absolute inset-0 bg-red-500/10 -z-10 rounded-xl blur-xl transition-opacity duration-1000",
                                isBurning ? "opacity-100" : "opacity-0"
                            )} />

                            <Textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="I release..."
                                className={cn(
                                    "min-h-[300px] bg-card/50 backdrop-blur-sm border-2 border-border/50 p-6 text-lg tracking-wide resize-none focus:border-red-500/30 transition-all duration-500",
                                    isBurning && "text-red-900/50 bg-red-950/10 border-red-500/50"
                                )}
                                disabled={isBurning}
                            />

                            {/* Flames Overlay */}
                            {isBurning && (
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: -20 }}
                                    className="absolute inset-0 flex items-end justify-center pointer-events-none overflow-hidden rounded-xl"
                                >
                                    <div className="w-full h-full bg-gradient-to-t from-orange-600/20 via-red-500/10 to-transparent" />
                                    {/* Replaced generic flame div with CSS illustration later or simple placeholder now */}
                                    <motion.div
                                        className="absolute bottom-0 w-32 h-32 bg-orange-500 blur-2xl rounded-full opacity-60"
                                        animate={{ scale: [1, 1.5, 1.2], opacity: [0.4, 0.8, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                </motion.div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="ash"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="min-h-[300px] flex items-center justify-center text-center text-muted-foreground"
                        >
                            <div>
                                <p className="font-serif italic text-xl">It is gone.</p>
                                <p className="text-xs uppercase tracking-widest mt-2 opacity-50">Released</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Button
                onClick={handleBurn}
                disabled={!text.trim() || isBurning}
                variant="destructive"
                className={cn(
                    "w-full md:w-auto px-8 rounded-full transition-all duration-500",
                    isBurning ? "bg-orange-700 hover:bg-orange-700" : "hover:bg-red-600/90"
                )}
            >
                {isBurning ? "Releasing..." : "Burn Away"}
                {!isBurning && <Flame className="w-4 h-4 ml-2" />}
            </Button>
        </div>
    );
}
