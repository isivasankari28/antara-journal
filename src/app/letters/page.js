'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export default function LettersPage() {
    const [letter, setLetter] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSend = () => {
        if (!letter.trim()) return;

        setIsSending(true);

        // Simulate a ritual/sending delay
        setTimeout(() => {
            setIsSending(false);
            setIsSent(true);
            setLetter('');

            // Reset after a moment
            setTimeout(() => {
                setIsSent(false);
            }, 3000);
        }, 2000);
    };

    return (
        <div className="max-w-2xl mx-auto min-h-[80vh] flex flex-col items-center justify-center space-y-8">
            <AnimatePresence mode="wait">
                {isSent ? (
                    <motion.div
                        key="sent-message"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="text-center space-y-4"
                    >
                        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                            <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                        </div>
                        <h2 className="text-3xl font-serif text-foreground/80">Message Received</h2>
                        <p className="text-muted-foreground">Your heart has been heard.</p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="compose-form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full space-y-6"
                    >
                        <div className="text-center space-y-2">
                            <h1 className="text-3xl font-serif text-foreground/90">Letter to Krishna</h1>
                            <p className="text-sm text-muted-foreground tracking-wide uppercase">Offer your thoughts</p>
                        </div>

                        <div className="relative">
                            <Textarea
                                value={letter}
                                onChange={(e) => setLetter(e.target.value)}
                                placeholder="Dear Krishna..."
                                className="min-h-[400px] p-8 bg-card/30 border-none shadow-sm resize-none focus-visible:ring-0 text-lg leading-relaxed font-serif placeholder:font-sans placeholder:opacity-40 rounded-xl"
                            />
                            {/* Decorative corner elements could go here */}
                        </div>

                        <div className="flex justify-center">
                            <Button
                                onClick={handleSend}
                                disabled={isSending || !letter.trim()}
                                className={cn(
                                    "rounded-full px-8 py-6 text-lg transition-all duration-700",
                                    isSending ? "w-16 h-16 rounded-full p-0" : "w-auto"
                                )}
                            >
                                {isSending ? (
                                    <Sparkles className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>
                                        <span>Offer Letter</span>
                                        <Send className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
