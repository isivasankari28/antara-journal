'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Palette } from 'lucide-react';

const moods = [
    { color: 'bg-red-400', value: 'red' },      // Passion/Energy
    { color: 'bg-orange-400', value: 'orange' }, // Creativity
    { color: 'bg-yellow-400', value: 'yellow' }, // Joy
    { color: 'bg-green-400', value: 'green' },   // Balance
    { color: 'bg-blue-400', value: 'blue' },     // Peace
    { color: 'bg-purple-400', value: 'purple' }, // Insight
    { color: 'bg-pink-400', value: 'pink' },     // Love
];

export function MoodMandala() {
    const [todayMood, setTodayMood] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('daily_mood');
        const today = new Date().toDateString();

        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.date === today) {
                setTodayMood(parsed.value);
            }
        }
    }, []);

    const selectMood = (moodValue) => {
        setTodayMood(moodValue);
        localStorage.setItem('daily_mood', JSON.stringify({
            date: new Date().toDateString(),
            value: moodValue
        }));
    };

    return (
        <div className="bg-card/40 rounded-2xl p-6 flex flex-col items-center justify-center gap-6 relative overflow-hidden backdrop-blur-sm border border-border/50">
            <div className="absolute top-4 right-4 flex items-center gap-2 text-muted-foreground text-sm">
                <span className="font-serif">Mood</span>
                <Palette className="w-4 h-4" />
            </div>

            <div className="relative w-48 h-48 flex items-center justify-center mt-4">
                {/* Mandala layers */}
                {[0, 15, 30, 45, 60, 75].map((rotation, i) => (
                    <motion.div
                        key={i}
                        className={`absolute w-32 h-32 border border-primary/20 rounded-full`}
                        style={{ rotate: rotation }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, rotate: rotation + 180 }}
                        transition={{ duration: 1.5, delay: i * 0.1 }}
                    />
                ))}

                {/* Core Mood Circle */}
                <motion.div
                    className={`w-20 h-20 rounded-full shadow-lg transition-colors duration-500 flex items-center justify-center ${todayMood
                            ? moods.find(m => m.value === todayMood)?.color
                            : 'bg-muted'
                        }`}
                    animate={todayMood ? { scale: [1, 1.1, 1], rotate: 360 } : {}}
                >
                    {!todayMood && <span className="text-xs text-muted-foreground">Log Mood</span>}
                </motion.div>
            </div>

            <div className="flex gap-2">
                {moods.map((m) => (
                    <button
                        key={m.value}
                        onClick={() => selectMood(m.value)}
                        className={`w-6 h-6 rounded-full ${m.color} hover:scale-125 transition-transform ${todayMood === m.value ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                    />
                ))}
            </div>
        </div>
    );
}
