"use client";

import { useState, useEffect } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { getDashboardStats } from "./actions";
import { DollarSign, Utensils, Users, ShoppingBag, Clock, TrendingUp, Settings, ExternalLink, Menu, RotateCcw } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AdvancedChart } from "@/components/dashboard/AdvancedChart";
import { ProfitCalendar } from "@/components/dashboard/ProfitCalendar";
import { PopularItems } from "@/components/dashboard/PopularItems";
import { useLanguage } from "@/context/language-context";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

interface DashboardStats {
    totalRevenue: number;
    dailyRevenue: number;
    weeklyTotalRevenue: number;
    monthlyTotalRevenue: number;
    yearlyTotalRevenue: number;
    activeOrders: number;
    pendingIncome: number;
    activeTables: number;
    totalOrdersToday: number;
    totalOrdersAllTime: number;
    chartData: any[];
    monthlyChartData: any[];
    yearlyChartData: any[];
    calendarData: any[];
    recentActivity: any[];
    topSelling: any[];
    currency: string;
}

export function DashboardUI({ stats: initialStats }: { stats: DashboardStats }) {
    const [mounted, setMounted] = useState(false);
    const [stats, setStats] = useState(initialStats);
    const [refreshing, setRefreshing] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            const newStats = await getDashboardStats();
            // @ts-ignore
            setStats(newStats);
        } catch (error) {
            console.error("Failed to refresh stats", error);
        } finally {
            setRefreshing(false);
        }
    };

    // ... Tooltip logic ...

    // ... Tooltip logic ...

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6 pt-4"
        >
            {/* QUICK ACTIONS */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-4">
                    <Link href="/dashboard/owner/orders">
                        <Button variant="outline" className="gap-2 h-10 border-dashed border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 hover:text-white">
                            <ShoppingBag className="w-4 h-4 text-teal-500" />
                            {t('overview.viewActiveOrders')}
                        </Button>
                    </Link>
                    <Link href="/dashboard/owner/menu">
                        <Button variant="outline" className="gap-2 h-10 border-dashed border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 hover:text-white">
                            <Menu className="w-4 h-4 text-indigo-500" />
                            {t('overview.editMenu')}
                        </Button>
                    </Link>
                    <Link href="/dashboard/owner/settings">
                        <Button variant="outline" className="gap-2 h-10 border-dashed border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 hover:text-white">
                            <Settings className="w-4 h-4 text-zinc-500" />
                            {t('sidebar.settings')}
                        </Button>
                    </Link>
                </div>

                <Button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    variant="outline"
                    className="gap-2 h-10 border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-teal-400 transition-colors"
                >
                    <RotateCcw className={cn("w-4 h-4", refreshing && "animate-spin")} />
                    {refreshing ? t('overview.refreshing') : t('overview.refresh')}
                </Button>
            </div>

            {/* MAIN STATS GRID - ULTRA PRO */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* 1. Total Revenue - Primary Gradient */}
                <motion.div variants={item} className="md:col-span-1 lg:col-span-1">
                    <div className="relative overflow-hidden rounded-[2rem] h-full bg-gradient-to-br from-teal-500 to-teal-600 shadow-2xl shadow-teal-500/20 group min-h-[160px]">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <DollarSign className="w-32 h-32 text-white transform rotate-12 -mr-8 -mt-8" />
                        </div>
                        <div className="relative p-6 h-full flex flex-col justify-between text-white">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4">
                                    <DollarSign className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-3xl font-black tracking-tight mb-1">
                                    {stats.currency}{stats.totalRevenue.toLocaleString()}
                                </h3>
                                <p className="text-teal-100 font-medium text-sm">{t('overview.totalRevenue')}</p>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-xs font-bold bg-white/10 w-fit px-3 py-1.5 rounded-full backdrop-blur-sm">
                                <TrendingUp className="w-3 h-3" />
                                <span>{t('overview.allTimeEarnings')}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* 2. Today's Revenue - Dark Card */}
                <motion.div variants={item} className="md:col-span-1 lg:col-span-1">
                    <div className="relative overflow-hidden rounded-[2rem] h-full bg-zinc-900 border border-zinc-800 shadow-xl group min-h-[160px]">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <TrendingUp className="w-32 h-32 text-white transform rotate-12 -mr-8 -mt-8" />
                        </div>
                        <div className="relative p-6 h-full flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center mb-4 group-hover:bg-zinc-700 transition-colors">
                                    <TrendingUp className="w-6 h-6 text-teal-500" />
                                </div>
                                <h3 className="text-3xl font-black tracking-tight mb-1 text-white">
                                    {stats.currency}{stats.dailyRevenue.toLocaleString()}
                                </h3>
                                <p className="text-zinc-400 font-medium text-sm">{t('overview.todaysRevenue')}</p>
                            </div>
                            <div className={cn(
                                "mt-4 flex items-center gap-2 text-xs font-bold w-fit px-3 py-1.5 rounded-full",
                                stats.dailyRevenue > 0 ? "bg-red-500/10 text-red-400" : "bg-zinc-800 text-zinc-500"
                            )}>
                                <div className={cn("w-1.5 h-1.5 rounded-full", stats.dailyRevenue > 0 ? "bg-red-500 animate-pulse" : "bg-zinc-500")} />
                                <span>{t('overview.performanceToday')}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* 3. Active Orders (Kitchen) */}
                <motion.div variants={item}>
                    <div className="relative overflow-hidden rounded-[2rem] h-full bg-zinc-900 border border-zinc-800 shadow-xl group min-h-[160px]">
                        <div className="relative p-6 h-full flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center mb-4 group-hover:bg-zinc-700 transition-colors">
                                    <ShoppingBag className="w-6 h-6 text-teal-500" />
                                </div>
                                <h3 className="text-3xl font-black tracking-tight mb-1 text-white">
                                    {stats.activeOrders}
                                </h3>
                                <p className="text-zinc-400 font-medium text-sm">{t('overview.activeOrders')}</p>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-xs font-bold bg-emerald-500/10 text-emerald-400 w-fit px-3 py-1.5 rounded-full">
                                <Utensils className="w-3 h-3" />
                                <span>{t('overview.ordersInKitchen')}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* 4. Pending Income */}
                <motion.div variants={item}>
                    <div className="relative overflow-hidden rounded-[2rem] h-full bg-zinc-900 border border-zinc-800 shadow-xl group min-h-[160px]">
                        <div className="relative p-6 h-full flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center mb-4 group-hover:bg-zinc-700 transition-colors">
                                    <DollarSign className="w-6 h-6 text-teal-500" />
                                </div>
                                <h3 className="text-3xl font-black tracking-tight mb-1 text-white">
                                    {stats.currency}{stats.pendingIncome.toLocaleString()}
                                </h3>
                                <p className="text-zinc-400 font-medium text-sm">{t('overview.pendingIncome')}</p>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-xs font-bold bg-zinc-800 text-zinc-400 w-fit px-3 py-1.5 rounded-full">
                                <Clock className="w-3 h-3" />
                                <span>{t('overview.unpaidOrders')}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ROW 2: Popular Items (Span 2) + Total Orders + Daily Orders */}

                {/* Popular Items - Moved Here */}
                <motion.div variants={item} className="col-span-1 md:col-span-2 row-span-2">
                    <PopularItems
                        data={stats.topSelling}
                        currency={stats.currency}
                    />
                </motion.div>

                {/* RIGHT SIDE STATS - Total & Daily Orders */}
                <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
                    {/* 5. Total Orders */}
                    <motion.div variants={item} className="h-full">
                        <div className="relative overflow-hidden rounded-[2rem] h-full bg-zinc-900 border border-zinc-800 shadow-xl group min-h-[160px]">
                            <div className="relative p-6 h-full flex flex-col justify-between">
                                <div>
                                    <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center mb-4 group-hover:bg-zinc-700 transition-colors">
                                        <ShoppingBag className="w-6 h-6 text-indigo-500" />
                                    </div>
                                    <h3 className="text-3xl font-black tracking-tight mb-1 text-white">
                                        {stats.totalOrdersAllTime}
                                    </h3>
                                    <p className="text-zinc-400 font-medium text-sm">{t('overview.totalOrders')}</p>
                                </div>
                                <div className="mt-4 flex items-center gap-2 text-xs font-bold bg-indigo-500/10 text-indigo-400 w-fit px-3 py-1.5 rounded-full">
                                    <span>{t('overview.allTimeOrders')}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* 6. Daily Orders */}
                    <motion.div variants={item} className="h-full">
                        <div className="relative overflow-hidden rounded-[2rem] h-full bg-zinc-900 border border-zinc-800 shadow-xl group min-h-[160px]">
                            <div className="relative p-6 h-full flex flex-col justify-between">
                                <div>
                                    <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center mb-4 group-hover:bg-zinc-700 transition-colors">
                                        <Clock className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <h3 className="text-3xl font-black tracking-tight mb-1 text-white">
                                        {stats.totalOrdersToday}
                                    </h3>
                                    <p className="text-zinc-400 font-medium text-sm">{t('overview.dailyOrders')}</p>
                                </div>
                                <div className="mt-4 flex items-center gap-2 text-xs font-bold bg-orange-500/10 text-orange-400 w-fit px-3 py-1.5 rounded-full">
                                    <span>{t('overview.ordersToday')}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ANALYTICS SECTION - ULTRA PRO */}
            <div className="flex flex-col lg:grid lg:grid-cols-7 gap-6 min-h-[500px] lg:h-[500px]">
                {/* Advanced Interactive Chart */}
                <motion.div variants={item} className="lg:col-span-5 h-[350px] sm:h-[450px] lg:h-full w-full">
                    <AdvancedChart
                        weeklyData={stats.chartData}
                        monthlyData={stats.monthlyChartData}
                        yearlyData={stats.yearlyChartData}
                        growth={{
                            weekly: stats.weeklyTotalRevenue,
                            monthly: stats.monthlyTotalRevenue,
                            yearly: stats.yearlyTotalRevenue
                        }}
                        currency={stats.currency}
                    />
                </motion.div>

                {/* Profit Calendar */}
                <motion.div variants={item} className="lg:col-span-2 w-full">
                    <ProfitCalendar
                        data={stats.calendarData}
                        currency={stats.currency}
                    />
                </motion.div>
            </div>


        </motion.div>
    );
}
