"use client";

import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { BentoGrid, BentoGridItem } from "../ui/bento-grid";
import {
    IconArrowWaveRightUp,
    IconBoxAlignRightFilled,
    IconBoxAlignTopLeft,
    IconClipboardCopy,
    IconFileBroken,
    IconSignature,
    IconTableColumn,
} from "@tabler/icons-react";
import { ChefHat, TrendingUp, Users, QrCode, ArrowUpRight, Sparkles } from "lucide-react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { useLanguage } from "@/context/language-context";

export function Features() {
    const { t } = useLanguage();
    return (
        <section className="py-32 bg-black relative overflow-hidden">
            {/* Cinematic Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-500/10 rounded-[100%] blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-cyan-500/5 rounded-[100%] blur-[100px] pointer-events-none" />

            {/* Grid Pattern with Fade */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

            <div className="container mx-auto px-4 mb-20 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-indigo-300 mb-6 uppercase tracking-widest">
                        <Sparkles className="w-3 h-3" />
                        <span>{t('landing.features.badge')}</span>
                    </div>

                    <h2 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tight leading-tight">
                        {t('landing.features.titleLine1')} <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">{t('landing.features.titleLine2')}</span>
                    </h2>

                    <p className="text-zinc-400 max-w-2xl mx-auto text-xl leading-relaxed font-light">
                        {t('landing.features.descriptionLine1')} <br />
                        <span className="text-zinc-500">{t('landing.features.descriptionLine2')}</span>
                    </p>
                </motion.div>
            </div>

            <BentoGrid className="max-w-6xl mx-auto px-4 relative z-10">
                {getItems(t).map((item, i) => (
                    <BentoGridItem
                        key={i}
                        title={item.title}
                        description={item.description}
                        header={item.header}
                        icon={item.icon}
                        className={cn(
                            i === 0 || i === 3 ? "md:col-span-2" : "",
                            "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/80 transition-all duration-300 group"
                        )}
                    />
                ))}
            </BentoGrid>
        </section>
    );
}

const FeatureImage = ({ src, alt, overlayColor = "from-black/60" }: { src: string, alt: string, overlayColor?: string }) => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden relative border border-white/5 group-hover:border-white/10 transition-colors">
        <div className="absolute inset-0 z-10 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />

        <img
            src={src}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
    </div>
);

const getItems = (t: any) => [
    {
        title: <span className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">{t('landing.features.items.qr.title')}</span>,
        description: <span className="text-zinc-400 text-sm leading-relaxed">{t('landing.features.items.qr.desc')}</span>,
        header: <FeatureImage src="https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80" alt="QR Ordering" overlayColor="from-cyan-500/20" />,
        icon: <QrCode className="h-6 w-6 text-cyan-500 group-hover:scale-110 transition-transform" />,
    },
    {
        title: <span className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">{t('landing.features.items.upsell.title')}</span>,
        description: <span className="text-zinc-400 text-sm">{t('landing.features.items.upsell.desc')}</span>,
        header: <FeatureImage src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80" alt="Smart Upselling" overlayColor="from-emerald-500/20" />,
        icon: <TrendingUp className="h-5 w-5 text-emerald-500 group-hover:scale-110 transition-transform" />,
    },
    {
        title: <span className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">{t('landing.features.items.kds.title')}</span>,
        description: <span className="text-zinc-400 text-sm">{t('landing.features.items.kds.desc')}</span>,
        header: <FeatureImage src="https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?auto=format&fit=crop&w=800&q=80" alt="KDS" overlayColor="from-orange-500/20" />,
        icon: <ChefHat className="h-5 w-5 text-orange-500 group-hover:scale-110 transition-transform" />,
    },
    {
        title: <span className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors">{t('landing.features.items.analytics.title')}</span>,
        description: <span className="text-zinc-400 text-sm leading-relaxed">{t('landing.features.items.analytics.desc')}</span>,
        header: <FeatureImage src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" alt="Analytics" overlayColor="from-indigo-500/20" />,
        icon: <IconArrowWaveRightUp className="h-6 w-6 text-indigo-500 group-hover:scale-110 transition-transform" />,
    },
    {
        title: <span className="text-xl font-bold text-white group-hover:text-rose-400 transition-colors">{t('landing.features.items.staff.title')}</span>,
        description: <span className="text-zinc-400 text-sm">{t('landing.features.items.staff.desc')}</span>,
        header: <FeatureImage src="https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&w=800&q=80" alt="Staff Management" overlayColor="from-rose-500/20" />,
        icon: <Users className="h-5 w-5 text-rose-500 group-hover:scale-110 transition-transform" />,
    },
];
