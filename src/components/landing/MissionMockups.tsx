"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, DollarSign, ShoppingBag, Pizza, Coffee, Utensils, Globe, Clock, CheckCircle2 } from "lucide-react";

export const AnalyticsMockup = () => {
    return (
        <div className="w-full h-full bg-neutral-900 p-6 flex flex-col gap-4 relative overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <div className="space-y-1">
                    <div className="h-2 w-24 bg-neutral-800 rounded-full" />
                    <div className="h-2 w-16 bg-neutral-800 rounded-full" />
                </div>
                <div className="h-8 w-8 rounded-full bg-neutral-800/50 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-cyan-400" />
                </div>
            </div>

            {/* Main Chart Area */}
            <div className="flex items-end justify-between h-32 gap-2 mt-auto">
                {[40, 70, 45, 90, 60, 80, 50].map((h, i) => (
                    <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className="w-full bg-gradient-to-t from-cyan-900/40 to-cyan-400 rounded-t-sm opacity-80"
                    />
                ))}
            </div>

            {/* Floating Stats */}
            <div className="absolute top-4 right-4 bg-neutral-800/90 backdrop-blur border border-white/5 p-3 rounded-lg shadow-xl">
                <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    <span className="text-xs text-emerald-400 font-bold">+24.5%</span>
                </div>
                <div className="text-lg font-bold text-white">$12,450</div>
            </div>
        </div>
    );
};

export const MenuMockup = () => {
    return (
        <div className="w-full h-full bg-neutral-900 p-4 grid grid-cols-2 gap-3 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-900/80 pointer-events-none z-10" />
            {[
                { icon: Pizza, color: "text-orange-400", bg: "bg-orange-400/10" },
                { icon: Coffee, color: "text-amber-400", bg: "bg-amber-400/10" },
                { icon: Utensils, color: "text-blue-400", bg: "bg-blue-400/10" },
                { icon: ShoppingBag, color: "text-purple-400", bg: "bg-purple-400/10" },
            ].map((item, i) => (
                <div key={i} className="bg-neutral-800/50 border border-white/5 rounded-lg p-3 flex flex-col gap-2 group hover:bg-neutral-800 transition-colors">
                    <div className={`w-full aspect-video rounded-md ${item.bg} flex items-center justify-center mb-1`}>
                        <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <div className="h-2 w-3/4 bg-neutral-700 rounded-full" />
                    <div className="flex justify-between items-center">
                        <div className="h-2 w-1/3 bg-neutral-700 rounded-full" />
                        <div className="h-4 w-12 bg-cyan-500/20 rounded text-[10px] text-cyan-400 flex items-center justify-center font-medium">
                            $12.99
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const OrdersMockup = () => {
    return (
        <div className="w-full h-full bg-neutral-900 p-5 flex flex-col gap-3 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Live Orders</span>
                <Clock className="w-3 h-3 text-neutral-500 animate-pulse" />
            </div>

            {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center justify-between bg-neutral-800/40 border border-white/5 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-xs font-bold text-neutral-300">
                            #{240 + i}
                        </div>
                        <div className="space-y-1">
                            <div className="h-2 w-16 bg-neutral-700 rounded-full" />
                            <div className="h-1.5 w-10 bg-neutral-800 rounded-full" />
                        </div>
                    </div>
                    <div className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        Ready
                    </div>
                </div>
            ))}
        </div>
    );
};
