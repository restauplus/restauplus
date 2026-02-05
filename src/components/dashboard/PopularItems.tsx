"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Trophy, TrendingUp, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/language-context";

interface PopularItemsProps {
    data: any[];
    currency: string;
}

export function PopularItems({ data, currency }: PopularItemsProps) {
    const maxCount = data.length > 0 ? Math.max(...data.map(i => i.count)) : 1;
    const { t, direction } = useLanguage();

    return (
        <Card className="h-full border-none bg-zinc-900 shadow-lg text-white flex flex-col overflow-hidden relative group">
            <div className={cn(
                "absolute top-0 p-6 opacity-5 rotate-12 group-hover:opacity-10 transition-opacity",
                direction === 'rtl' ? "left-0" : "right-0" // Flip icon position
            )}>
                <Trophy className="w-24 h-24 text-yellow-500" />
            </div>

            <CardHeader className="relative z-10 pb-2">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-teal-500" />
                    {t('overview.popularItems')}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto pr-2 rtl:pl-2 rtl:pr-0 relative z-10 flex flex-col">
                <div className="space-y-4 pt-2">
                    {data?.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: direction === 'rtl' ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group/item relative bg-zinc-800/30 hover:bg-zinc-800/80 border border-zinc-700/30 rounded-xl p-3 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10 hover:border-teal-500/30"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shadow-lg",
                                        i === 0 ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-yellow-500/20" :
                                            i === 1 ? "bg-gradient-to-br from-zinc-300 to-zinc-500 text-white shadow-zinc-500/20" :
                                                i === 2 ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-orange-500/20" :
                                                    "bg-zinc-800 text-zinc-500"
                                    )}>
                                        #{i + 1}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-zinc-100 group-hover/item:text-teal-400 transition-colors">
                                            {item.name}
                                        </h4>
                                        <p className="text-xs text-zinc-500 flex items-center gap-1">
                                            {item.count} {t('calendar.orders')}
                                        </p>
                                    </div>
                                </div>
                                <span className="font-bold text-zinc-200 bg-zinc-950/50 px-2 py-1 rounded-md border border-zinc-800">
                                    {currency}{item.revenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="relative h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(item.count / maxCount) * 100}%` }}
                                    className={cn(
                                        "absolute top-0 h-full rounded-full transition-all duration-1000",
                                        direction === 'rtl' ? "right-0" : "left-0", // Flip bar start position
                                        i === 0 ? "bg-gradient-to-r from-yellow-500 to-yellow-300" :
                                            i === 1 ? "bg-gradient-to-r from-zinc-400 to-zinc-200" :
                                                i === 2 ? "bg-gradient-to-r from-orange-500 to-orange-300" :
                                                    "bg-gradient-to-r from-teal-500 to-teal-300"
                                    )}
                                />
                            </div>
                        </motion.div>
                    ))}
                    {(!data || data.length === 0) && (
                        <div className="flex flex-col items-center justify-center h-40 opacity-40 text-sm text-zinc-500">
                            <p>{t('overview.noSalesData')}</p>
                        </div>
                    )}
                </div>

                <div className="mt-auto pt-6">
                    <Link href="/dashboard/owner/menu">
                        <Button className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold h-11 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition-all">
                            {t('overview.viewFullMenu')}
                            <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
