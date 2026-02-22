"use client";

import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    const handleLanguageChange = (lang: "en" | "ar") => {
        setLanguage(lang);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-neutral-300 hover:text-white hover:bg-white/10 rounded-full w-8 h-8">
                    <Globe className="h-4 w-4" />
                    <span className="sr-only">Toggle language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-black/90 border-white/10 text-white backdrop-blur-xl">
                <DropdownMenuItem
                    className={`cursor-pointer ${language === 'en' ? 'bg-white/10 text-teal-400 font-bold' : 'hover:bg-white/5'}`}
                    onClick={() => handleLanguageChange('en')}
                >
                    English
                </DropdownMenuItem>
                <DropdownMenuItem
                    className={`cursor-pointer ${language === 'ar' ? 'bg-white/10 text-teal-400 font-bold' : 'hover:bg-white/5'}`}
                    onClick={() => handleLanguageChange('ar')}
                >
                    العربية
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
