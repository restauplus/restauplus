"use client";

import React from 'react';
import { motion } from 'framer-motion';

const companies = [
    {
        name: "Al Falamanki",
        logo: (
            <img src="/partners/al-falamanki.png" alt="Al Falamanki" className="w-full h-full object-contain" />
        )
    },
    {
        name: "Qunvert",
        logo: (
            <img src="/partners/qunvert.png" alt="Qunvert" className="w-full h-full object-contain" />
        )
    },
    {
        name: "AI",
        logo: (
            <img src="/partners/ai.png" alt="AI" className="w-full h-full object-contain" />
        )
    },
    {
        name: "Kempinski",
        logo: (
            <img src="/partners/kempinski.png" alt="Kempinski" className="w-full h-full object-contain" />
        )
    }
];

export function TrustedBy() {
    return (
        <div className="relative flex flex-col items-center justify-center gap-10 py-12 md:py-24 bg-black overflow-hidden z-20">

            {/* Logos Marquee */}
            <div className="flex w-full overflow-hidden mask-linear-fade" dir="ltr">
                <motion.div
                    initial={{ x: 0 }}
                    animate={{ x: "-50%" }}
                    transition={{
                        duration: 30,
                        ease: "linear",
                        repeat: Infinity,
                    }}
                    className="flex flex-none gap-24 pr-24"
                >
                    {[...companies, ...companies, ...companies, ...companies].map((company, index) => (
                        <div
                            key={index}
                            className="h-16 w-auto min-w-[100px] relative grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100 flex items-center justify-center"
                            title={company.name}
                        >
                            {company.logo}
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Gradient Mask for Edges */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
        </div>
    );
}
