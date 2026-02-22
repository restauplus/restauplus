"use client";

import { Card } from "@/components/ui/card";
import { Clock, ChefHat, BellRing, UtensilsCrossed, Store, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/context/language-context";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function KitchenMetrics({ orders, totalDailyDineIn, totalDailyTakeAway }: { orders: any[], totalDailyDineIn: number, totalDailyTakeAway: number }) {
    const { t } = useLanguage();
    const [dineInCount, setDineInCount] = useState(totalDailyDineIn);
    const [takeAwayCount, setTakeAwayCount] = useState(totalDailyTakeAway);
    const supabase = createClient();

    useEffect(() => {
        // Sync with props if they change (e.g. initial load or revalidation)
        setDineInCount(totalDailyDineIn);
        setTakeAwayCount(totalDailyTakeAway);
    }, [totalDailyDineIn, totalDailyTakeAway]);

    useEffect(() => {
        const channel = supabase
            .channel('kitchen_metrics_realtime')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'orders'
                },
                (payload) => {
                    const newOrder = payload.new;
                    // Check if order is for today (optional, but good practice)
                    // We assume all new inserts are for "today"
                    if (!newOrder.order_type || newOrder.order_type === 'dine_in') {
                        setDineInCount(prev => prev + 1);
                    } else if (newOrder.order_type === 'takeaway') {
                        setTakeAwayCount(prev => prev + 1);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const calculateAvgDiff = (startField: string, endField: string) => {
        let totalMins = 0;
        let count = 0;

        orders?.forEach(order => {
            const start = order[startField] ? new Date(order[startField]).getTime() : null;
            const end = order[endField] ? new Date(order[endField]).getTime() : null;

            if (start && end && end > start) {
                const diffMins = (end - start) / (1000 * 60); // minutes
                // Filter anomalies (>12h) but keep quick actions (>0)
                if (diffMins > 0 && diffMins < 720) {
                    totalMins += diffMins;
                    count++;
                }
            }
        });

        // Ceil to ensure 0 becomes 1 if there's any duration at all
        return count > 0 ? Math.ceil(totalMins / count) : 0;
    };

    // 1. Placed -> Preparing
    const avgResponseTime = calculateAvgDiff('created_at', 'preparing_at');

    // 2. Preparing -> Ready
    const avgCookTime = calculateAvgDiff('preparing_at', 'ready_at');

    // 3. Ready -> Served
    const avgServiceTime = calculateAvgDiff('ready_at', 'served_at');

    return (
        <>
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:grid md:grid-cols-3 mb-6 no-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
                {/* Responsiveness / Start Time */}
                <div className="min-w-[85vw] sm:min-w-[400px] md:min-w-0 snap-center bg-zinc-900/50 border border-white/5 p-5 rounded-2xl flex items-center justify-between group hover:border-orange-500/30 transition-all">
                    <div>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">{t('ordersPage.metrics.responseTime')}</p>
                        <p className="text-[10px] text-zinc-600 mb-2">{t('ordersPage.metrics.placedToPreparing')}</p>
                        <p className="text-4xl font-black text-white tracking-tight">{avgResponseTime} <span className="text-sm font-bold text-zinc-500 tracking-normal">{t('ordersPage.metrics.min')}</span></p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20 shadow-[0_0_20px_-5px_rgba(249,115,22,0.3)]">
                        <BellRing className="w-6 h-6" />
                    </div>
                </div>

                {/* Cook Time */}
                <div className="min-w-[85vw] sm:min-w-[400px] md:min-w-0 snap-center bg-zinc-900/50 border border-white/5 p-5 rounded-2xl flex items-center justify-between group hover:border-emerald-500/30 transition-all">
                    <div>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">{t('ordersPage.metrics.cookTime')}</p>
                        <p className="text-[10px] text-zinc-600 mb-2">{t('ordersPage.metrics.preparingToReady')}</p>
                        <p className="text-4xl font-black text-white tracking-tight">{avgCookTime} <span className="text-sm font-bold text-zinc-500 tracking-normal">{t('ordersPage.metrics.min')}</span></p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]">
                        <ChefHat className="w-6 h-6" />
                    </div>
                </div>

                {/* Service Lag */}
                <div className="min-w-[85vw] sm:min-w-[400px] md:min-w-0 snap-center bg-zinc-900/50 border border-white/5 p-5 rounded-2xl flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                    <div>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">{t('ordersPage.metrics.serviceSpeed')}</p>
                        <p className="text-[10px] text-zinc-600 mb-2">{t('ordersPage.metrics.readyToServed')}</p>
                        <p className="text-4xl font-black text-white tracking-tight">{avgServiceTime} <span className="text-sm font-bold text-zinc-500 tracking-normal">{t('ordersPage.metrics.min')}</span></p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20 shadow-[0_0_20px_-5px_rgba(99,102,241,0.3)]">
                        <UtensilsCrossed className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* VOLUME METRICS (Dine In vs Take Away) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {/* Total Dine In */}
                <div className="bg-zinc-900/50 border border-white/5 p-5 rounded-2xl flex items-center justify-between group hover:border-purple-500/30 transition-all relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                            {t('ordersPage.metrics.totalDineIn')}
                        </p>
                        <p className="text-4xl font-black text-white tracking-tight mt-2">
                            {dineInCount}
                        </p>
                    </div>
                    <div className="relative z-10 w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 border border-purple-500/20 shadow-[0_0_30px_-10px_rgba(168,85,247,0.4)] group-hover:scale-110 transition-transform duration-500">
                        <Store className="w-7 h-7" />
                    </div>
                </div>

                {/* Total Take Away */}
                <div className="bg-zinc-900/50 border border-white/5 p-5 rounded-2xl flex items-center justify-between group hover:border-blue-500/30 transition-all relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            {t('ordersPage.metrics.totalTakeAway')}
                        </p>
                        <p className="text-4xl font-black text-white tracking-tight mt-2">
                            {takeAwayCount}
                        </p>
                    </div>
                    <div className="relative z-10 w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 shadow-[0_0_30px_-10px_rgba(59,130,246,0.4)] group-hover:scale-110 transition-transform duration-500">
                        <ShoppingBag className="w-7 h-7" />
                    </div>
                </div>
            </div>
        </>
    );
}
