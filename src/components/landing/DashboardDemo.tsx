"use client";

import { motion } from "framer-motion";
import { TrendingUp, ArrowRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LaptopFrame } from "@/components/ui/laptop-frame";
import { useLanguage } from "@/context/language-context";

export function DashboardDemo() {
    const { t } = useLanguage();
    return (
        <section
            className="relative min-h-[90vh] flex flex-col justify-center pt-24 pb-20 overflow-hidden bg-black selection:bg-cyan-500/30"
        >
            {/* Optimized Background Glows - Reduced Blur & Opacity */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none opacity-50" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none opacity-50" />

            <div className="container mx-auto px-4 lg:px-8 z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* LEFT COLUMN: LAPTOP (Simple Fade In) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="order-2 lg:order-1 relative z-20"
                    >
                        <LaptopFrame>
                            <img
                                src="/dashboard-screen-8.png"
                                alt="RestauPro Dashboard"
                                className="w-full h-full object-fill"
                                loading="eager"
                            />
                        </LaptopFrame>
                    </motion.div>

                    {/* RIGHT COLUMN: TEXT CONTENT (Simple Stagger) */}
                    <div className="text-left space-y-8 order-1 lg:order-2 px-4 lg:px-0">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-widest uppercase"
                        >
                            {t('landing.dashboardDemo.badge')}
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-[1.1]"
                        >
                            {t('landing.dashboardDemo.titleLine1')}<br />
                            {t('landing.dashboardDemo.titleLine2')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">{t('landing.dashboardDemo.titleLineHighlight')}</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-xl text-zinc-400 max-w-lg font-medium leading-relaxed"
                        >
                            {t('landing.dashboardDemo.description')}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 pt-4"
                        >
                            <Link href="/register?plan=trial">
                                <Button className="h-14 md:h-16 px-8 md:px-10 text-lg rounded-full bg-cyan-400 text-black hover:bg-cyan-300 font-bold shadow-[0_0_40px_rgba(34,211,238,0.2)] hover:shadow-[0_0_60px_rgba(34,211,238,0.4)] transition-all">
                                    {t('landing.dashboardDemo.startTrial')}
                                    <ArrowRight className="w-5 h-5 ml-2 rtl:rotate-180" />
                                </Button>
                            </Link>
                            <Link href="/restaurant/fried">
                                <Button variant="outline" className="h-14 md:h-16 px-8 md:px-10 text-lg rounded-full border-white/10 hover:bg-white/10 text-white font-medium hover:border-white/20">
                                    <Play className="w-5 h-5 mr-3 rtl:mr-0 rtl:ml-3 fill-white rtl:rotate-180" />
                                    {t('landing.dashboardDemo.watchDemo')}
                                </Button>
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex items-center gap-8 pt-8 border-t border-white/5"
                        >
                            <div className="group">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-4xl font-black text-white tracking-tight group-hover:text-cyan-300 transition-colors duration-300">
                                        +56
                                    </h4>
                                    <TrendingUp className="w-6 h-6 text-cyan-500" />
                                </div>
                                <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest group-hover:text-zinc-300 transition-colors">{t('landing.dashboardDemo.scaled')}</p>
                            </div>

                            <div className="w-px h-16 bg-white/10" />

                            <div className="group">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-4xl font-black text-white tracking-tight group-hover:text-amber-400 transition-colors duration-300">
                                        5.0
                                    </h4>
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <svg key={star} className="w-5 h-5 text-yellow-500 fill-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest group-hover:text-zinc-300 transition-colors">{t('landing.dashboardDemo.rating')}</p>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
