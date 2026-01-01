'use client';

import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, CloudRain, TreePine, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const sounds = [
    { id: 'rain', name: 'Soft Rain', icon: CloudRain, src: 'https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3' }, // Rain
    { id: 'forest', name: 'Forest Wind', icon: TreePine, src: 'https://assets.mixkit.co/active_storage/sfx/2432/2432-preview.mp3' }, // Forest birds
    { id: 'temple', name: 'Temple Bells', icon: Bell, src: 'https://assets.mixkit.co/active_storage/sfx/2606/2606-preview.mp3' }, // Bells
];

export function AmbientPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSound, setCurrentSound] = useState(sounds[0]);
    const [volume, setVolume] = useState(0.5);
    const [isExpanded, setIsExpanded] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
        if (isPlaying) {
            audioRef.current?.play().catch(e => console.log("Audio play failed:", e));
        } else {
            audioRef.current?.pause();
        }
    }, [isPlaying, currentSound]);

    const toggleSameSound = () => setIsPlaying(!isPlaying);

    const changeSound = (sound) => {
        if (currentSound.id === sound.id) {
            // Toggle if same sound
            setIsPlaying(!isPlaying);
        } else {
            // Change and play if different
            setCurrentSound(sound);
            setIsPlaying(true);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
            <audio
                ref={audioRef}
                src={currentSound.src}
                loop
            />

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="bg-card/90 backdrop-blur-md border border-border p-4 rounded-2xl shadow-lg mb-2 flex flex-col gap-3 min-w-[200px]"
                    >
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest pl-1">Soundscapes</p>
                        <div className="space-y-1">
                            {sounds.map((sound) => (
                                <button
                                    key={sound.id}
                                    onClick={() => changeSound(sound)}
                                    className={cn(
                                        "w-full flex items-center gap-3 p-2 rounded-lg text-sm transition-colors",
                                        currentSound.id === sound.id
                                            ? "bg-primary/20 text-primary"
                                            : "hover:bg-muted text-muted-foreground"
                                    )}
                                >
                                    <sound.icon className="w-4 h-4" />
                                    <span className="flex-1 text-left">{sound.name}</span>
                                    {currentSound.id === sound.id && isPlaying && (
                                        <div className="flex gap-0.5 items-end h-3">
                                            <motion.div animate={{ height: [3, 12, 3] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-0.5 bg-primary" />
                                            <motion.div animate={{ height: [6, 12, 6] }} transition={{ repeat: Infinity, duration: 1.1 }} className="w-0.5 bg-primary" />
                                            <motion.div animate={{ height: [2, 12, 2] }} transition={{ repeat: Infinity, duration: 0.9 }} className="w-0.5 bg-primary" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                            <Volume2 className="w-3 h-3 text-muted-foreground" />
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={(e) => setVolume(e.target.value)}
                                className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Button
                onClick={() => setIsExpanded(!isExpanded)}
                size="icon"
                className={cn(
                    "rounded-full h-12 w-12 shadow-md transition-all duration-300",
                    isPlaying ? "bg-primary text-primary-foreground animate-pulse-slow" : "bg-card text-foreground border border-border"
                )}
            >
                {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-muted-foreground" />}
            </Button>
        </div>
    );
}
