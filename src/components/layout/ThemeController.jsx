'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
    theme: 'light',
    font: 'serif',
    setTheme: () => { },
    setFont: () => { },
});

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('light'); // light (Morning), golden, midnight
    const [font, setFont] = useState('serif'); // serif (Playfair), sans (Geist)
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Load preferences
        const savedTheme = localStorage.getItem('theme') || 'light';
        const savedFont = localStorage.getItem('font') || 'serif';
        setTheme(savedTheme);
        setFont(savedFont);
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        // Apply Theme
        const root = window.document.documentElement;
        root.classList.remove('light', 'golden', 'midnight', 'dark'); // Cleanup legacy classes
        root.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Apply Font
        // We'll handle font application via a class on the body in layout.js primarily, 
        // but we can also set a variable if needed or toggle classes.
        // simpler to just manage state here and consume in layout or components.
        localStorage.setItem('font', font);

    }, [theme, font, mounted]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, font, setFont }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
