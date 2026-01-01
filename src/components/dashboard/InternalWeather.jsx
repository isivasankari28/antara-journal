'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Cloud, CloudRain, Star, CloudFog } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const WEATHER_STATES = [
    { id: 'sunny', name: 'Sunny', icon: Sun, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { id: 'cloudy', name: 'Cloudy', icon: Cloud, color: 'text-gray-500', bg: 'bg-gray-500/10' },
    { id: 'rainy', name: 'Rainy', icon: CloudRain, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 'stormy', name: 'Stormy', icon: CloudFog, color: 'text-slate-700', bg: 'bg-slate-700/10' },
    { id: 'starlit', name: 'Starlit', icon: Star, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
];

export default function InternalWeather() {
    const [currentWeather, setCurrentWeather] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('antara_weather_today');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Check if it's still the same day
            if (new Date(parsed.date).toDateString() === new Date().toDateString()) {
                setCurrentWeather(parsed.weather);
            }
        }
    }, []);

    const setWeather = (weatherId) => {
        setCurrentWeather(weatherId);
        localStorage.setItem('antara_weather_today', JSON.stringify({
            date: new Date(),
            weather: weatherId
        }));
    };

    const activeState = WEATHER_STATES.find(w => w.id === currentWeather);

    return (
        <Card className="h-full bg-card/40 border-border/50 backdrop-blur-sm overflow-hidden relative group">
            <div className={cn(
                "absolute inset-0 transition-opacity duration-1000 pointer-events-none opacity-20",
                activeState ? activeState.bg : "bg-transparent"
            )} />

            <CardHeader className="pb-2">
                <CardTitle className="font-serif font-normal text-lg flex items-center gap-2">
                    Internal Weather
                    {activeState && (
                        <motion.span
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-muted-foreground text-sm font-sans"
                        >
                            is {activeState.name}
                        </motion.span>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-center gap-2">
                    {WEATHER_STATES.map((weather) => {
                        const Icon = weather.icon;
                        const isActive = currentWeather === weather.id;

                        return (
                            <button
                                key={weather.id}
                                onClick={() => setWeather(weather.id)}
                                className={cn(
                                    "p-3 rounded-full transition-all duration-500 relative hover:scale-110",
                                    isActive ? "scale-110 bg-background shadow-sm" : "hover:bg-muted/50 opacity-50 hover:opacity-100"
                                )}
                                title={weather.name}
                            >
                                <Icon className={cn(
                                    "w-6 h-6 transition-colors duration-300",
                                    isActive ? weather.color : "text-muted-foreground"
                                )} />
                                {isActive && (
                                    <motion.div
                                        layoutId="active-weather-ring"
                                        className="absolute inset-0 rounded-full border-2 border-primary/20"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>

                <AnimatePresence mode="wait">
                    {!currentWeather && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-xs text-center text-muted-foreground mt-4 italic"
                        >
                            How is the sky looking inside?
                        </motion.p>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}
