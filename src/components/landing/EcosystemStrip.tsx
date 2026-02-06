"use client";

import { motion } from "framer-motion";
import {
    Monitor,
    Smartphone,
    ShoppingBag,
    Layers,
    QrCode,
    UtensilsCrossed,
    Award
} from "lucide-react";

const features = [
    { icon: Monitor, label: "Point of Sale" },
    { icon: Smartphone, label: "Branded Website and App" },
    { icon: ShoppingBag, label: "Online Ordering" },
    { icon: Layers, label: "Integrations" },
    { icon: QrCode, label: "QR Code Table Ordering" },
    { icon: UtensilsCrossed, label: "Table Reservations" },
    { icon: Award, label: "Loyalty Program" }
];

export function EcosystemStrip() {
    return (
        <section className="py-20 bg-black border-y border-white/5 relative overflow-hidden">
            <div className="container mx-auto px-4">

                {/* Horizontal Scrolling for smaller screens, Grid/Flex for larger */}
                <div className="flex flex-wrap lg:flex-nowrap justify-center items-start gap-8 lg:gap-0 relative">

                    {features.map((feature, index) => (
                        <div key={index} className="flex-1 min-w-[140px] flex flex-col items-center group relative z-10">

                            {/* Icon Container using Gradient Border Trick */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="w-16 h-16 mb-6 relative flex items-center justify-center"
                            >
                                <div className="absolute inset-0 bg-white/5 rounded-2xl rotate-3 group-hover:rotate-6 transition-transform duration-300 border border-white/5" />
                                <div className="absolute inset-0 bg-black rounded-2xl -rotate-3 group-hover:-rotate-6 transition-transform duration-300 border border-white/10 group-hover:border-primary/50" />

                                <feature.icon className="w-8 h-8 text-white relative z-10 group-hover:text-primary transition-colors duration-300 stroke-[1.5]" />
                            </motion.div>

                            {/* Label */}
                            <motion.h3
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 + (index * 0.1) }}
                                className="text-sm font-bold text-white text-center max-w-[120px] leading-tight group-hover:text-primary/90 transition-colors"
                            >
                                {feature.label}
                            </motion.h3>

                            {/* Connecting Line (Hidden on last item and mobile) */}
                            {index !== features.length - 1 && (
                                <div className="hidden lg:block absolute top-8 left-1/2 w-full h-[2px]">
                                    <div className="absolute top-0 left-8 right-[-32px] border-t-2 border-dashed border-white/10" />
                                </div>
                            )}
                        </div>
                    ))}

                </div>
            </div>
        </section>
    );
}
