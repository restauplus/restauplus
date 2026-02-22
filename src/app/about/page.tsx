"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/landing/Footer";
import Image from "next/image";
// import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { ChefHat, Globe, TrendingUp, Users, Cpu, Rocket, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";

export default function AboutPage() {
    const { t } = useLanguage();
    return (
        <main className="min-h-screen bg-black text-white selection:bg-cyan-500/30 overflow-hidden">
            <Navbar />

            {/* Content Container */}
            <div className="relative z-10 pt-32 pb-24 space-y-32">

                {/* Founder Section - Hero Style */}
                <section className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                        {/* Left: Image (Full impact) */}
                        <div
                            className="relative group mx-auto md:mx-0 order-first w-full"
                        >
                            <div className="relative w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-cyan-500/10">

                                <Image
                                    src="/WhatsApp Image 2026-02-19 at 23.51.29.jpeg"
                                    alt="Bader Bensalah - Founder & CEO"
                                    fill
                                    className="object-cover object-top transition-transform duration-1000 group-hover:scale-105"
                                    priority
                                />
                                <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-black via-black/60 to-transparent z-10">
                                    <h3 className="text-3xl font-bold text-white mb-1">Bader Bensalah</h3>
                                    <p className="text-cyan-400 font-medium tracking-wide">{t('landing.about.founderRole')}</p>
                                </div>
                            </div>

                            {/* Decorative elements behind image */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl blur-2xl opacity-20 -z-10 group-hover:opacity-30 transition-opacity duration-700" />
                        </div>

                        {/* Right: Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                            className="space-y-8 text-center md:text-left rtl:md:text-right"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                                <span className="text-xs font-medium text-cyan-100 uppercase tracking-widest">{t('landing.about.visionaryBadge')}</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/50">
                                {t('landing.about.titleLine1')} <br />
                                {t('landing.about.titleLine2')}
                            </h1>

                            <div className="space-y-6 text-lg md:text-xl text-neutral-400 leading-relaxed font-light">
                                <p>
                                    {t('landing.about.desc1')}
                                </p>
                                <p>
                                    {t('landing.about.desc2')}
                                </p>
                            </div>

                            <div className="pt-4 flex flex-wrap gap-4 justify-center md:justify-start rtl:md:justify-start">
                                <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-default">
                                    <Rocket className="w-5 h-5 text-purple-400" />
                                    <span className="text-sm font-semibold text-white">{t('landing.about.innovationBadge')}</span>
                                </div>
                                <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-default">
                                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                                    <span className="text-sm font-semibold text-white">{t('landing.about.enterpriseBadge')}</span>
                                </div>
                            </div>
                        </motion.div>


                    </div>
                </section>

                {/* Our Mission / Goals - Bento Grid */}

            </div>

            <Footer />
        </main>
    );
}
