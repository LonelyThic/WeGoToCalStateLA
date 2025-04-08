import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState("light");

    const toggleTheme = (mode) => {
        const validThemes = ["light", "dark", "high-contrast"];

        if (typeof mode === "string" && validThemes.includes(mode)) {
            setTheme(mode);
            AsyncStorage.setItem("theme", mode); // safe string
        } else {
            const next = theme === "light" ? "dark" : "light";
            setTheme(next);
            AsyncStorage.setItem("theme", next); // also safe
        }
    };

    useEffect(() => {
        AsyncStorage.getItem("theme").then((storedTheme) => {
            const validThemes = ["light", "dark", "high-contrast"];
            if (storedTheme && validThemes.includes(storedTheme)) {
                setTheme(storedTheme);
            } else {
                setTheme("light"); // default fallback
            }
        });
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);