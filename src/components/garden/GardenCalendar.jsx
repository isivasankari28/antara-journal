'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Dot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function GardenCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [journalDates, setJournalDates] = useState([]);
    const [moodDates, setMoodDates] = useState({});
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        // Load Journal Entries to mark days
        const entries = JSON.parse(localStorage.getItem('journal_entries') || '[]');
        const jDates = entries.map(e => new Date(e.timestamp || e.date).toDateString());
        setJournalDates(jDates);

        // Load Weather/Moods to mark days (using the new weather format)
        // We need to store weather history for this to fully work, 
        // current implementation only stores "today". 
        // For now, we'll just check today.
        const todayWeather = JSON.parse(localStorage.getItem('antara_weather_today') || 'null');
        if (todayWeather) {
            setMoodDates({ [new Date(todayWeather.date).toDateString()]: todayWeather.weather });
        }
    }, []);

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    const traverseMonth = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + direction);
        setCurrentDate(newDate);
    };

    const renderCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        const days = [];

        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
        }

        // Days
        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(year, month, d);
            const dateString = date.toDateString();
            const isJournaled = journalDates.includes(dateString);
            const mood = moodDates[dateString]; // 'sunny', 'rainy', etc.
            const isSelected = selectedDate.toDateString() === dateString;
            const isToday = new Date().toDateString() === dateString;

            let moodColor = 'transparent';
            if (mood === 'sunny') moodColor = 'bg-yellow-500/20';
            if (mood === 'rainy') moodColor = 'bg-blue-500/20';
            if (mood === 'stormy') moodColor = 'bg-slate-700/20';
            if (mood === 'cloudy') moodColor = 'bg-gray-500/20';
            if (mood === 'starlit') moodColor = 'bg-indigo-500/20';

            days.push(
                <motion.button
                    key={d}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setSelectedDate(date)}
                    className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center relative transition-all text-sm font-serif",
                        isSelected ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-muted/50",
                        isToday && !isSelected ? "border border-primary text-primary" : ""
                    )}
                >
                    {/* Mood Halo */}
                    {mood && !isSelected && (
                        <div className={cn("absolute inset-0 rounded-full blur-sm", moodColor)} />
                    )}

                    <span className="relative z-10">{d}</span>

                    {/* Journal Dot */}
                    {isJournaled && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={cn(
                                "absolute bottom-1 w-1 h-1 rounded-full",
                                isSelected ? "bg-primary-foreground" : "bg-primary"
                            )}
                        />
                    )}
                </motion.button>
            );
        }
        return days;
    };

    return (
        <div className="md:col-span-1 h-full">
            <Card className="h-full bg-card/40 border-border/50 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="font-serif font-normal text-lg">Garden Calendar</CardTitle>
                        <div className="flex gap-2">
                            <button onClick={() => traverseMonth(-1)} className="p-1 hover:bg-muted rounded-full">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-medium w-24 text-center">
                                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </span>
                            <button onClick={() => traverseMonth(1)} className="p-1 hover:bg-muted rounded-full">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-7 text-center text-xs text-muted-foreground mb-2 font-medium">
                        {DAYS.map(day => <div key={day}>{day}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-y-2 justify-items-center">
                        {renderCalendarDays()}
                    </div>

                    <div className="mt-8 pt-6 border-t border-border/50 text-center">
                        <h4 className="font-serif text-lg mb-2">
                            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </h4>
                        <p className="text-sm text-muted-foreground italic">
                            {journalDates.includes(selectedDate.toDateString())
                                ? "A memory was planted this day."
                                : "Quiet soil. No entries yet."}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
