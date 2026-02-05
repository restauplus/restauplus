"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "@/lib/i18n/translations";

type Language = "en" | "ar";
type Direction = "ltr" | "rtl";

interface LanguageContextType {
    language: Language;
    direction: Direction;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>("en");
    const [direction, setDirection] = useState<Direction>("ltr");

    // Load persisted language preference on mount
    useEffect(() => {
        const savedLang = localStorage.getItem("app-language") as Language;
        if (savedLang && (savedLang === "en" || savedLang === "ar")) {
            setLanguageState(savedLang);
            setDirection(savedLang === "ar" ? "rtl" : "ltr");
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        const newDir = lang === "ar" ? "rtl" : "ltr";
        setDirection(newDir);
        localStorage.setItem("app-language", lang);

        // Update document layout
        document.documentElement.dir = newDir;
        document.documentElement.lang = lang;
    };

    // Helper to get nested translation keys 'sidebar.overview'
    const t = (key: string): string => {
        const keys = key.split('.');
        let current: any = translations[language];

        for (const k of keys) {
            if (current[k] === undefined) {
                // Fallback to English if translation missing
                let fallback: any = translations['en'];
                for (const fk of keys) {
                    if (fallback[fk] === undefined) return key;
                    fallback = fallback[fk];
                }
                return fallback || key;
            }
            current = current[k];
        }
        return current;
    };

    return (
        <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
