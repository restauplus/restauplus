"use client";

import { useState } from "react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";

interface AdvancedChartProps {
    weeklyData: any[];
    monthlyData: any[];
    yearlyData: any[];
    growth: {
        weekly: number;
        monthly: number;
        yearly: number;
    };
    currency: string;
}

type Period = "week" | "month" | "year";

export function AdvancedChart({ weeklyData, monthlyData, yearlyData, growth, currency }: AdvancedChartProps) {
    const [period, setPeriod] = useState<Period>("week");
    const { t } = useLanguage();

    const data = period === "week" ? weeklyData : period === "month" ? monthlyData : yearlyData;
    const currentGrowth = period === "week" ? growth.weekly : period === "month" ? growth.monthly : growth.yearly;

    // Map internal keys to translated display labels
    const periodLabels: Record<Period, string> = {
        week: t('charts.weekly'),
        month: t('charts.monthly'),
        year: t('charts.yearly')
    };

    return (
        <Card className="h-full border-none bg-zinc-900 shadow-lg text-white overflow-hidden relative group">
            {/* Glossy Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

            <CardHeader>
                <CardTitle className="flex items-center justify-between relative z-10">
                    <div className="flex flex-col gap-1">
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={period}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-500"
                            >
                                {currency}{currentGrowth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </motion.span>
                        </AnimatePresence>
                        <span className="text-sm font-medium text-zinc-400">{t('charts.totalGrowth')} ({periodLabels[period]})</span>
                    </div>
                    <div className="flex gap-1 bg-zinc-800/50 p-1 rounded-lg backdrop-blur-sm border border-zinc-700/50">
                        {(["week", "month", "year"] as Period[]).map((p) => (
                            <Button
                                key={p}
                                size="sm"
                                variant="ghost"
                                onClick={() => setPeriod(p)}
                                className={cn(
                                    "capitalize h-8 px-3 rounded-md transition-all duration-300",
                                    period === p
                                        ? "bg-teal-500 text-white shadow-lg shadow-teal-500/20"
                                        : "text-zinc-400 hover:text-white hover:bg-zinc-700/50"
                                )}
                            >
                                {periodLabels[p]}
                            </Button>
                        ))}
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="h-[80%] pt-4 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                        <XAxis
                            dataKey="name"
                            stroke="#71717a"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                            interval="preserveStartEnd" // Can be problematic with Arabic if text overlaps, but English/Arabic nums are small
                        />
                        <YAxis
                            stroke="#71717a"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${currency}${value}`}
                            dx={-10}
                        />
                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                        <div className="bg-zinc-900/90 border border-zinc-700/50 backdrop-blur-xl p-3 rounded-xl shadow-2xl text-left rtl:text-right">
                                            <p className="text-zinc-400 text-xs mb-1 font-medium">{label}</p>
                                            <div className="flex flex-col gap-0.5">
                                                <p className="text-teal-400 font-bold text-lg">
                                                    {currency}{Number(data.total).toLocaleString()}
                                                </p>
                                                {data.count !== undefined && (
                                                    <p className="text-zinc-500 text-xs font-medium">
                                                        {data.count} {t('calendar.orders')}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                            cursor={{ stroke: '#14b8a6', strokeWidth: 1, strokeDasharray: '5 5' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="total"
                            stroke="#14b8a6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorTotal)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
