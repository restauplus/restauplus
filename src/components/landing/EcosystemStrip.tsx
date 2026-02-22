"use client";

import { Monitor, CreditCard, Laptop, Smartphone, Layers, QrCode, CalendarClock, TicketPercent, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";

export function EcosystemStrip() {
    const { t } = useLanguage();
    const features = [
        {
            icon: Monitor,
            title: t('landing.ecosystemStrip.pos')
        },
        {
            icon: Laptop,
            title: t('landing.ecosystemStrip.website')
        },
        {
            icon: Smartphone,
            title: t('landing.ecosystemStrip.ordering')
        },
        {
            icon: Layers,
            title: t('landing.ecosystemStrip.integrations')
        },
        {
            icon: QrCode,
            title: t('landing.ecosystemStrip.qr')
        },
        {
            icon: CalendarClock,
            title: t('landing.ecosystemStrip.reservations')
        },
        {
            icon: TicketPercent,
            title: t('landing.ecosystemStrip.loyalty')
        }
    ];

    return (
        <section className="bg-black relative z-20 py-12">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-y-8 gap-x-4 items-start">
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center text-center relative group">

                            {/* Icon Container */}
                            <div className="relative mb-4 z-10 transition-transform duration-300 group-hover:-translate-y-1">
                                <div className="w-16 h-16 rounded-2xl bg-zinc-900/50 border border-white/10 flex items-center justify-center shadow-lg group-hover:border-purple-500/50 group-hover:shadow-purple-500/20 group-hover:bg-zinc-800 transition-all duration-300 relative overflow-hidden">
                                    {/* Subtle shine effect */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <feature.icon className="w-8 h-8 text-zinc-400 group-hover:text-purple-400 transition-colors stroke-[1.5]" />
                                </div>
                            </div>

                            {/* Connecting Line (Desktop Only) - skipping for last item and grid breaks */}
                            <div className={cn(
                                "hidden lg:block absolute top-[2rem] rtl:right-[50%] ltr:left-[50%] w-full h-[2px] -z-0",
                                index === features.length - 1 ? "hidden" : ""
                            )}>
                                <div className="absolute inset-0 border-t-2 border-dotted border-zinc-800/50 w-[calc(100%-4rem)] ltr:translate-x-[2rem] rtl:-translate-x-[2rem]" />
                            </div>

                            {/* Text */}
                            <h3 className="text-sm font-medium text-zinc-400 group-hover:text-white transition-colors max-w-[140px] leading-tight">
                                {feature.title}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
