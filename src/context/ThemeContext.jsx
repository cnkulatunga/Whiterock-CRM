import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ theme: 'light', mode: 'system', setMode: () => {}, toggleTheme: () => {} });

const getSystemTheme = () =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const resolveTheme = (mode) => mode === 'system' ? getSystemTheme() : mode;

export const ThemeProvider = ({ children }) => {
    const [mode, setModeState] = useState(() => {
        return localStorage.getItem('crm-theme-mode') || 'system';
    });

    const [theme, setTheme] = useState(() => resolveTheme(
        localStorage.getItem('crm-theme-mode') || 'system'
    ));

    // Apply theme to DOM + persist mode
    useEffect(() => {
        const resolved = resolveTheme(mode);
        setTheme(resolved);
        document.documentElement.setAttribute('data-theme', resolved);
        localStorage.setItem('crm-theme-mode', mode);
    }, [mode]);

    // Listen for OS preference changes when in system mode
    useEffect(() => {
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = () => {
            if (mode === 'system') {
                const resolved = getSystemTheme();
                setTheme(resolved);
                document.documentElement.setAttribute('data-theme', resolved);
            }
        };
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, [mode]);

    const setMode = (newMode) => setModeState(newMode);

    // Keep backward-compat toggle (light ↔ dark, skips system)
    const toggleTheme = () => setModeState(prev =>
        prev === 'dark' ? 'light' : 'dark'
    );

    return (
        <ThemeContext.Provider value={{ theme, mode, setMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
