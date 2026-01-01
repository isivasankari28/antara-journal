'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Wind } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BreathworkWidget() {
    const [isActive, setIsActive] = useState(false);
    const [phase, setPhase] = useState('Idle'); // Idle, Inhale, Hold, Exhale
    const [instruction, setInstruction] = useState('Start Breathing');

    // 4-7-8 Breathing Technique
    // Inhale: 4s, Hold: 7s, Exhale: 8s
    useEffect(() => {
        if (!isActive) {
            setPhase('Idle');
            setInstruction('Start Breathing');
            return;
        }

        let timeout;

        const runCycle = () => {
            // Inhale (4s)
            setPhase('Inhale');
            setInstruction('Inhale deeply...');

            timeout = setTimeout(() => {
                // Hold (7s)
                setPhase('Hold');
                setInstruction('Hold...');

                timeout = setTimeout(() => {
                    // Exhale (8s)
                    setPhase('Exhale');
                    setInstruction('Exhale slowly...');

                    timeout = setTimeout(() => {
                        runCycle(); // Loop
                    }, 8000);
                }, 7000);
            }, 4000);
        };

        runCycle();

        return () => clearTimeout(timeout);
    }, [isActive]);

    const variants = {
        Idle: { scale: 1, opacity: 0.8 },
        Inhale: { scale: 1.5, opacity: 1, transition: { duration: 4, ease: "easeInOut" } },
        Hold: { scale: 1.5, opacity: 1, transition: { duration: 7, ease: "linear" } }, // Slight pulsate maybe?
        Exhale: { scale: 1, opacity: 0.6, transition: { duration: 8, ease: "easeInOut" } },
    };

    return (
        <div className="bg-card/40 rounded-2xl p-6 flex flex-col items-center justify-center gap-6 relative overflow-hidden backdrop-blur-sm border border-border/50">
            <div className="absolute top-4 left-4 flex items-center gap-2 text-muted-foreground text-sm">
                <Wind className="w-4 h-4" />
                <span className="font-serif">Breath</span>
            </div>

            <div className="relative w-48 h-48 flex items-center justify-center mt-4">
                {/* Outer glow rings */}
                <motion.div
                    animate={phase}
                    variants={variants}
                    className="absolute w-32 h-32 rounded-full bg-primary/20 blur-xl"
                />
                <motion.div
                    animate={phase}
                    variants={variants}
                    className="absolute w-24 h-24 rounded-full bg-primary/30 blur-md"
                />

                {/* Core circle */}
                <motion.div
                    animate={phase}
                    variants={variants}
                    className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg z-10"
                >
                    <Wind className="w-6 h-6" />
                </motion.div>
            </div>

            <div className="text-center z-10 space-y-2">
                <h3 className="text-lg font-serif tracking-wide transition-all duration-500 min-h-[1.75rem]">{instruction}</h3>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">4-7-8 Rhythm</p>
            </div>

            <Button
                variant="outline"
                size="sm"
                onClick={() => setIsActive(!isActive)}
                className="rounded-full px-6 hover:bg-primary hover:text-primary-foreground transition-all"
            >
                {isActive ? (
                    <><Pause className="w-3 h-3 mr-2" /> Pause</>
                ) : (
                    <><Play className="w-3 h-3 mr-2" /> Begin</>
                )}
            </Button>
        </div>
    );
}
