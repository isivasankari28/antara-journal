'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function LockScreen({ children }) {
    const [isLocked, setIsLocked] = useState(false); // Default unrelated to saved state initially
    const [pin, setPin] = useState('');
    const [savedPin, setSavedPin] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        // Check if a PIN is set in localStorage
        const storedPin = localStorage.getItem('antara_pin');
        if (storedPin) {
            setSavedPin(storedPin);
            setIsLocked(true); // Lock if pin exists
        }
    }, []);

    const handleNumClick = (num) => {
        if (pin.length < 4) {
            const newPin = pin + num;
            setPin(newPin);

            if (newPin.length === 4) {
                verifyPin(newPin);
            }
        }
    };

    const verifyPin = (inputPin) => {
        if (inputPin === savedPin) {
            setIsLocked(false);
            setPin('');
        } else {
            setError(true);
            setTimeout(() => {
                setPin('');
                setError(false);
            }, 500);
        }
    };

    if (!savedPin || !isLocked) {
        return <>{children}</>;
    }

    return (
        <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center space-y-8">
            <motion.div
                animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                className="flex flex-col items-center space-y-4"
            >
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <Lock className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-serif">Welcome Back</h2>
                <p className="text-muted-foreground text-sm">Enter your passcode to open your sanctuary.</p>

                <div className="flex gap-4 h-4 mt-4">
                    {[0, 1, 2, 3].map(i => (
                        <div
                            key={i}
                            className={cn(
                                "w-3 h-3 rounded-full transition-colors duration-300",
                                pin.length > i ? "bg-primary" : "bg-muted-foreground/30"
                            )}
                        />
                    ))}
                </div>
            </motion.div>

            <div className="grid grid-cols-3 gap-6 max-w-xs w-full">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <Button
                        key={num}
                        variant="outline"
                        className="w-16 h-16 rounded-full text-xl font-light border-border/50 hover:bg-primary/10 hover:border-primary/50 transition-all"
                        onClick={() => handleNumClick(num.toString())}
                    >
                        {num}
                    </Button>
                ))}
                <div className="col-start-2">
                    <Button
                        variant="outline"
                        className="w-16 h-16 rounded-full text-xl font-light border-border/50 hover:bg-primary/10 hover:border-primary/50 transition-all"
                        onClick={() => handleNumClick('0')}
                    >
                        0
                    </Button>
                </div>
            </div>
        </div>
    );
}
