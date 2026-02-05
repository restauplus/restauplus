"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLanguage } from "@/context/language-context";

interface ProfitCalendarProps {
    data: { date: string; profit: number; count: number }[];
    currency: string;
}

export function ProfitCalendar({ data, currency }: ProfitCalendarProps) {
    const { t, language } = useLanguage();
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay(); // 0 is Sunday

    // Create grid cells (offset by starting day)
    const blanks = Array.from({ length: firstDayOfMonth });
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Helpers
    const getIntensity = (profit: number) => {
        if (profit === 0) return "bg-zinc-800/50";
        if (profit < 100) return "bg-teal-900/40";
        if (profit < 500) return "bg-teal-700/60";
        if (profit < 1000) return "bg-teal-500/80";
        return "bg-teal-400";
    };

    // Generate localized weekdays (Sun-Sat)
    const weekdays = Array.from({ length: 7 }, (_, i) => {
        // Jan 7, 2024 is a Sunday
        const d = new Date(2024, 0, 7 + i);
        return d.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'short' });
    });

    const locale = language === 'ar' ? 'ar-EG' : 'default';

    return (
        <Card className="h-full border-none bg-zinc-900 shadow-lg text-white overflow-hidden">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span className="text-lg font-bold">{t('calendar.profitCalendar')}</span>
                    <span className="text-sm text-zinc-400">{today.toLocaleString(locale, { month: 'long', year: 'numeric' })}</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-zinc-500 mb-2">
                    {weekdays.map(d => (
                        <div key={d}>{d}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {blanks.map((_, i) => (
                        <div key={`blank-${i}`} className="aspect-square" />
                    ))}
                    {days.map((day) => {
                        const dayData = data.find(d => new Date(d.date).getDate() === day);
                        const profit = dayData?.profit || 0;
                        const count = dayData?.count || 0;

                        return (
                            <TooltipProvider key={day}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            className={cn(
                                                "aspect-square rounded-md flex items-center justify-center text-xs cursor-pointer transition-colors relative group",
                                                getIntensity(profit),
                                                profit > 0 ? "text-white font-bold" : "text-zinc-600"
                                            )}
                                        >
                                            {day}
                                            {/* Glow effect on hover */}
                                            {profit > 0 && <div className="absolute inset-0 bg-teal-400/20 blur-md rounded-md opacity-0 group-hover:opacity-100 transition-opacity" />}
                                        </motion.div>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-zinc-950 border-zinc-800 text-white">
                                        <div className="text-center">
                                            <p className="font-bold text-teal-400">{currency}{profit.toLocaleString()}</p>
                                            <p className="text-xs text-zinc-400">{count} {t('calendar.orders')}</p>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-end gap-2 mt-4 text-[10px] text-zinc-500">
                    <span>{language === 'ar' ? 'أقل' : 'Less'}</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-sm bg-zinc-800/50" />
                        <div className="w-3 h-3 rounded-sm bg-teal-900/40" />
                        <div className="w-3 h-3 rounded-sm bg-teal-700/60" />
                        <div className="w-3 h-3 rounded-sm bg-teal-500/80" />
                        <div className="w-3 h-3 rounded-sm bg-teal-400" />
                    </div>
                    <span>{language === 'ar' ? 'أكثر' : 'More'}</span>
                </div>
            </CardContent>
        </Card>
    );
}
