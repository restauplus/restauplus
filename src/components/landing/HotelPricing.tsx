"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, Zap, Star, Shield, Rocket, Flame, Crown, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";

export function HotelPricing() {
    const { t } = useLanguage();
    return (
        <section id="hotel-pricing" className="relative pb-24 bg-black overflow-hidden selection:bg-amber-500/30">
            {/* Background Effects - Hotel Theme (Amber/Orange) */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[128px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[128px] animate-pulse-slow delay-1000" />
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-8 space-y-8 mt-12">

                {/* Hero Section */}
                <div className="text-center space-y-3 mb-8 pt-12 border-t border-white/5">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-white/10 text-sm font-bold uppercase tracking-widest text-white shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                    >
                        <Building2 className="w-4 h-4 text-amber-500" />
                        {t('landing.hotelPricing.badge')}
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-black tracking-tighter text-white"
                    >
                        {t('landing.hotelPricing.titleLine1')} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-zinc-400">{t('landing.hotelPricing.titleLine2')}</span>
                    </motion.h2>
                </div>

                {/* Pricing Cards - 3 Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">

                    {/* 1. Monthly Plan (Left) */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="relative group h-full"
                    >
                        <div className="h-full bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-white/10 p-5 flex flex-col hover:border-white/20 transition-all duration-300">
                            <div className="mb-4">
                                <h3 className="text-lg font-bold text-zinc-400 mb-1">{t('landing.hotelPricing.monthly.title')}</h3>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-black text-white">{t('landing.hotelPricing.monthly.price')}</span>
                                    <span className="text-zinc-500 font-medium text-sm">{t('landing.hotelPricing.monthly.period')}</span>
                                </div>
                            </div>

                            <ul className="space-y-2 mb-6 flex-1">
                                {(t('landing.hotelPricing.monthly.features') as unknown as string[]).map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-zinc-300 leading-tight">
                                        <Check className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link href="/register?plan=hotel-monthly" className="w-full">
                                <Button className="w-full h-10 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-lg text-sm active:scale-95 transition-all">
                                    {t('landing.hotelPricing.monthly.button')}
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* 2. Free Trial (Center - THE STAR) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative z-20 transform scale-100 lg:scale-110"
                    >
                        {/* Animated Border/Glow - "Perfect Promo" */}
                        <div className="absolute -inset-[3px] bg-gradient-to-r from-amber-500 via-orange-600 to-amber-500 rounded-[26px] blur-sm bg-[length:200%_auto] animate-gradient-xy opacity-80" />
                        <div className="absolute -inset-[1px] bg-gradient-to-r from-amber-500 via-orange-600 to-amber-500 rounded-[24px] bg-[length:200%_auto] animate-gradient-xy" />

                        <div className="absolute top-0 inset-x-0 flex justify-center z-30">
                            <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-b-xl shadow-lg shadow-amber-500/20">
                                {t('landing.hotelPricing.sixMonths.popularBadge')}
                            </span>
                        </div>

                        <div className="relative h-full bg-[#050505] rounded-[20px] p-5 flex flex-col shadow-2xl overflow-hidden">
                            {/* Floating Background Badge */}
                            <div className="absolute top-[-50px] right-[-50px] w-24 h-24 bg-amber-500/20 blur-[40px] rounded-full pointer-events-none" />

                            <div className="mt-4 mb-5 text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white mb-3 shadow-lg shadow-amber-500/30">
                                    <Building2 className="w-6 h-6 fill-current" />
                                </div>
                                <h3 className="text-xl font-black text-white mb-1">{t('landing.hotelPricing.sixMonths.title')}</h3>
                                <div className="flex flex-col items-center">
                                    <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                                        {t('landing.hotelPricing.sixMonths.price')}
                                    </div>
                                    <span className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] mt-0.5">{t('landing.hotelPricing.sixMonths.period')}</span>
                                </div>
                                <div className="text-xs text-zinc-500 line-through mt-2">{t('landing.hotelPricing.sixMonths.was')}</div>
                            </div>

                            <div className="bg-white/5 rounded-lg p-3 mb-5 border border-white/10 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 rtl:right-0 rtl:left-auto" />
                                <p className="text-xs font-medium text-zinc-300 text-center leading-relaxed">
                                    {t('landing.hotelPricing.sixMonths.quote')}
                                </p>
                            </div>

                            <ul className="space-y-2 mb-6">
                                {(t('landing.hotelPricing.sixMonths.features') as unknown as string[]).map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-xs font-bold text-white">
                                        <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
                                            <Check className="w-2.5 h-2.5 text-black stroke-[3px]" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link href="/register?plan=hotel-6months" className="w-full">
                                <Button className="w-full h-11 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-black uppercase tracking-wider rounded-lg text-sm shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] active:scale-95 transition-all duration-300 group">
                                    {t('landing.hotelPricing.sixMonths.button')}
                                    <ArrowRight className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform rtl:rotate-180" />
                                </Button>
                            </Link>

                            <div className="text-center mt-4">
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest animate-pulse">
                                    <span className="text-red-500 mr-2 rtl:mr-0 rtl:ml-2">●</span>
                                    {t('landing.hotelPricing.sixMonths.availability')}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* 3. Yearly Plan (Right) */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="relative group h-full"
                    >
                        <div className="h-full bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-white/10 p-5 flex flex-col hover:border-amber-500/30 hover:bg-amber-900/10 transition-all duration-300">
                            <div className="absolute top-0 right-0 p-4">
                                <Star className="w-5 h-5 text-amber-400 fill-current" />
                            </div>

                            <div className="mb-4">
                                <h3 className="text-lg font-bold text-amber-500 mb-1">{t('landing.hotelPricing.yearly.title')}</h3>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-black text-white">{t('landing.hotelPricing.yearly.price')}</span>
                                    <span className="text-zinc-500 font-medium text-sm">{t('landing.hotelPricing.yearly.period')}</span>
                                </div>
                                <div className="text-xs text-zinc-500 line-through mt-0.5">{t('landing.hotelPricing.yearly.was')}</div>
                                <div className="inline-block mt-1.5 px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 text-[10px] font-bold">
                                    {t('landing.hotelPricing.yearly.bestValue')}
                                </div>
                            </div>

                            <ul className="space-y-2 mb-6 flex-1">
                                {(t('landing.hotelPricing.yearly.features') as unknown as string[]).map((feature, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs text-zinc-300 leading-tight">
                                        <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link href="/register?plan=hotel-yearly" className="w-full">
                                <Button className="w-full h-10 bg-white/5 hover:bg-amber-600 hover:text-white border border-white/10 hover:border-amber-500 text-white font-bold rounded-lg text-sm active:scale-95 transition-all">
                                    {t('landing.hotelPricing.yearly.button')}
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>

            </div>
        </section>
    );
}
