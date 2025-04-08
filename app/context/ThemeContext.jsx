import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

const validThemes = ['light', 'dark', 'high-contrast'];

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light'); // Default theme

    useEffect(() => {
        const loadStoredTheme = async () => {
            const storedTheme = await AsyncStorage.getItem('theme');
            if (storedTheme && validThemes.includes(storedTheme)) {
                setTheme(storedTheme);
            }
        };

        loadStoredTheme();
    }, []);

    const toggleTheme = (mode) => {
        let newTheme;

        if (mode && validThemes.includes(mode)) {
            newTheme = mode;
        } else {
            newTheme = theme === 'light' ? 'dark' : 'light';
        }

        setTheme(newTheme);
        AsyncStorage.setItem('theme', newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);