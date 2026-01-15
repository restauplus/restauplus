
"use client";

import React from 'react';
import Earth from '@/components/globe';
import { Sparkles } from '@/components/sparkles';
import { motion } from 'framer-motion';

export function GlobalHero() {
    return (
        <>
            <div className='w-full overflow-hidden bg-black text-white relative flex flex-col items-center justify-center py-10'>
                <article className='grid gap-4 text-center relative z-10 max-w-4xl mx-auto px-4'>
                    {/* Logo instead of badge */}
                    {/* Logo with Floating Animation */}
                    <motion.div
                        animate={{ y: [-5, 5, -5] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="w-24 h-24 mx-auto mb-6 relative z-10"
                    >
                        {/* Glow behind logo */}
                        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/ops-logo.png" alt="AI Operators Group" className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
                    </motion.div>

                    <h1 className='text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white bg-[length:200%_auto] animate-shimmer leading-[1.1] tracking-tighter'>
                        BY AI OPERATORS GROUP
                    </h1>
                    <div className="w-full max-w-[600px] mx-auto mt-8">
                        <Earth />
                    </div>
                </article>

                <div className='absolute bottom-0 inset-x-0 h-80 w-full overflow-hidden mask-radial pointer-events-none'>
                    <Sparkles
                        density={800}
                        speed={1.2}
                        size={1.2}
                        direction='top'
                        opacitySpeed={2}
                        color='#FFFFFF'
                        className='absolute inset-x-0 bottom-0 h-full w-full opacity-50'
                    />
                </div>
            </div>
        </>
    );
}
