import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // ✅ Light mode is default now
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });

    // ✅ Toggle & persist theme
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    // ✅ Apply theme class to <body>
    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );

};

export const useTheme = () => useContext(ThemeContext);
