
"use client";

import React from 'react';
import { Sparkles } from '@/components/sparkles';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { Star } from 'lucide-react';
import { partners } from '@/lib/data';
import { Great_Vibes } from 'next/font/google';
import { cn } from '@/lib/utils';

const greatVibes = Great_Vibes({
    subsets: ['latin'],
    weight: ['400'],
    variable: '--font-great-vibes',
});

// Helper to get color classes based on theme config
const getThemeClasses = (theme: any) => {
    // This is a simplified mapper. In a real scenario, you might pass these directly if they align with Tailwind classes
    // or map them more robustly. For now, we use the strings from data.ts directly where safe.
    return {
        wrapperBorder: theme.border,
        glow: theme.glow,
        gradientText: theme.gradient,
        primary: theme.primary
    };
};

// Helper to get gradient colors based on theme
const getBorderGradient = (theme: string) => {
    if (theme.includes('amber')) return 'from-[#ff8c00] via-[#fbbf24] to-[#ff8c00]';
    return 'from-white via-slate-300 to-white';
};

export function TrustedBy() {
    return (
        <section className={cn("relative overflow-hidden bg-black py-24", greatVibes.variable)}>
            {/* Background Sparkles */}
            <div className='absolute inset-0 w-full h-full'>
                <Sparkles
                    density={800}
                    speed={0.2}
                    size={0.6}
                    color='#fbbf24'
                    className='opacity-30'
                />
            </div>

            <div className='mx-auto max-w-6xl px-4 relative z-10'>
                {/* Section Title */}
                <div className='text-center mb-16'>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500 text-xs font-medium mb-4 backdrop-blur-sm"
                    >
                        <Star className="w-3 h-3 fill-amber-500" />
                        <span>Elite Partners</span>
                    </motion.div>

                    <h2 className='text-3xl md:text-5xl font-bold text-white tracking-tight mb-4'>
                        Luxury <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600">Circle</span>
                    </h2>
                </div>

                {/* Partners Grid - Side by Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-4xl mx-auto">
                    {partners.map((partner, index) => {
                        return (
                            <motion.div
                                key={partner.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                whileHover={{ scale: 1.02 }}
                                className="group relative"
                            >
                                {/* "x1000" Animated Rotating Border */}
                                <div className="absolute -inset-[1px] rounded-3xl overflow-hidden opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className={cn(
                                        "absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#0000_0%,#0000_50%,transparent_100%)]",
                                        partner.theme.primary === 'amber'
                                            ? "bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#b45309_50%,#fbbf24_100%)]"
                                            : "bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#94a3b8_50%,#ffffff_100%)]"
                                    )} />
                                </div>

                                {/* Main Card Content */}
                                <div className="relative h-full bg-zinc-950/90 backdrop-blur-xl rounded-3xl p-8 flex flex-col items-center text-center border border-white/5 shadow-2xl">
                                    {/* Logo Area */}
                                    <div className="h-32 flex items-center justify-center mb-6 w-full relative z-10 transform transition-transform duration-500 group-hover:scale-105">
                                        {partner.type === 'image' ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={partner.src}
                                                alt={partner.name}
                                                className="w-48 h-auto object-contain drop-shadow-[0_0_15px_rgba(251,191,36,0.2)]"
                                            />
                                        ) : (
                                            <h3 className={cn(
                                                "text-5xl font-normal leading-none",
                                                "font-great-vibes text-transparent bg-clip-text bg-gradient-to-br",
                                                partner.theme.gradient
                                            )}
                                                style={{ fontFamily: 'var(--font-great-vibes)' }}
                                            >
                                                {partner.name}
                                            </h3>
                                        )}
                                    </div>

                                    {/* Quote */}
                                    <div className="relative">
                                        <p className="text-sm md:text-base text-zinc-400 font-light leading-relaxed italic border-t border-white/10 pt-4">
                                            "{partner.description}"
                                        </p>
                                    </div>

                                    {/* Footer Dots */}
                                    <div className="mt-6 flex justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className={cn("w-1.5 h-1.5 rounded-full", partner.theme.primary === 'amber' ? "bg-amber-500" : "bg-white")}></div>
                                        <div className={cn("w-1.5 h-1.5 rounded-full opacity-50", partner.theme.primary === 'amber' ? "bg-amber-500" : "bg-white")}></div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
