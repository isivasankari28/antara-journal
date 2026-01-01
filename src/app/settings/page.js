'use client';

import { useTheme } from '@/components/layout/ThemeController';
import { motion } from 'framer-motion';
import { Sun, Moon, Sunset, Type, Lock, Download, Upload, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useRef } from 'react';

export default function SettingsPage() {
    const { theme, setTheme, font, setFont } = useTheme();
    const [pin, setPin] = useState('');
    const [savedPin, setSavedPin] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const stored = localStorage.getItem('antara_pin');
        if (stored) setSavedPin(stored);
    }, []);

    const themes = [
        { id: 'light', name: 'Morning Light', icon: Sun, color: 'bg-[#f4f7f5] text-[#3d3d3d]' },
        { id: 'golden', name: 'Golden Hour', icon: Sunset, color: 'bg-[#fff5e6] text-[#5c4033]' },
        { id: 'midnight', name: 'Midnight Vigil', icon: Moon, color: 'bg-[#1a1b26] text-[#e0e1eb]' },
    ];

    const fonts = [
        { id: 'serif', name: 'Playfair Display (Elegant)', family: 'font-serif' },
        { id: 'sans', name: 'Geist Sans (Clean)', family: 'font-sans' },
    ];

    const handleSetPin = () => {
        if (pin.length === 4) {
            localStorage.setItem('antara_pin', pin);
            setSavedPin(pin);
            setPin('');
        }
    };

    const handleClearPin = () => {
        localStorage.removeItem('antara_pin');
        setSavedPin(null);
    };

    const handleExport = () => {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.includes('journal') || key.includes('gratitude') || key.includes('mood') || key.includes('theme')) {
                data[key] = localStorage.getItem(key);
            }
        }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `antara_backup_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
    };

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                Object.keys(data).forEach(key => {
                    localStorage.setItem(key, data[key]);
                });
                alert('Sanctuary restored. Please refresh.');
                window.location.reload();
            } catch (err) {
                alert('Invalid backup file.');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-12">
            <div className="space-y-2">
                <h1 className="text-3xl font-serif text-foreground/90">Personalize Your Space</h1>
                <p className="text-muted-foreground">Make it feel like home.</p>
            </div>

            {/* Theme Section */}
            <section className="space-y-6">
                <h2 className="text-xl font-medium flex items-center gap-2">
                    <Sun className="w-5 h-5" /> Theme
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {themes.map((t) => (
                        <motion.div
                            key={t.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setTheme(t.id)}
                            className={cn(
                                "cursor-pointer rounded-xl p-6 border-2 transition-all flex flex-col items-center gap-4",
                                theme === t.id ? "border-primary shadow-sm" : "border-transparent bg-muted/50 opacity-70 hover:opacity-100"
                            )}
                        >
                            <div className={cn("w-16 h-16 rounded-full flex items-center justify-center shadow-inner", t.color)}>
                                <t.icon className="w-8 h-8" />
                            </div>
                            <span className="font-medium">{t.name}</span>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Typography Section */}
            <section className="space-y-6">
                <h2 className="text-xl font-medium flex items-center gap-2">
                    <Type className="w-5 h-5" /> Typography
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {fonts.map((f) => (
                        <motion.div
                            key={f.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setFont(f.id)}
                            className={cn(
                                "cursor-pointer rounded-xl p-8 border-2 transition-all flex flex-col items-center gap-2 text-center",
                                font === f.id ? "border-primary shadow-sm" : "border-transparent bg-muted/50 opacity-70 hover:opacity-100"
                            )}
                        >
                            <span className={cn("text-3xl", f.family)}>Aa</span>
                            <span className="text-sm text-muted-foreground">{f.name}</span>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Privacy Section */}
            <section className="space-y-6 border-t border-border pt-8">
                <h2 className="text-xl font-medium flex items-center gap-2">
                    <Shield className="w-5 h-5" /> Privacy & Safety
                </h2>
                <div className="bg-card/40 border border-border/50 rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium">Passcode Protection</h3>
                            <p className="text-sm text-muted-foreground">Secure your journal with a 4-digit PIN.</p>
                        </div>
                        <Lock className="w-5 h-5 text-muted-foreground" />
                    </div>

                    {savedPin ? (
                        <div className="flex items-center gap-4">
                            <p className="text-sm text-primary font-medium">Secured</p>
                            <Button variant="destructive" size="sm" onClick={handleClearPin}>Remove PIN</Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 max-w-xs">
                            <Input
                                type="password"
                                placeholder="Enter 4 digits"
                                maxLength={4}
                                value={pin}
                                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                className="tracking-widest text-center"
                            />
                            <Button onClick={handleSetPin} disabled={pin.length !== 4}>Set</Button>
                        </div>
                    )}
                </div>
            </section>

            {/* Data Section */}
            <section className="space-y-6">
                <h2 className="text-xl font-medium flex items-center gap-2">
                    <Download className="w-5 h-5" /> Data Management
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-card/40 border border-border/50 rounded-xl p-6 flex flex-col gap-4">
                        <div>
                            <h3 className="font-medium">Backup Data</h3>
                            <p className="text-sm text-muted-foreground">Download a copy of your journal and settings.</p>
                        </div>
                        <Button variant="outline" onClick={handleExport} className="w-full">
                            <Download className="w-4 h-4 mr-2" /> Export JSON
                        </Button>
                    </div>

                    <div className="bg-card/40 border border-border/50 rounded-xl p-6 flex flex-col gap-4">
                        <div>
                            <h3 className="font-medium">Restore Data</h3>
                            <p className="text-sm text-muted-foreground">Import a previously saved backup file.</p>
                        </div>
                        <input
                            type="file"
                            accept=".json"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleImport}
                        />
                        <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
                            <Upload className="w-4 h-4 mr-2" /> Import JSON
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
