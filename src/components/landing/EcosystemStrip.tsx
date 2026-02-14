"use client";

import { Monitor, CreditCard, Laptop, Smartphone, Layers, QrCode, CalendarClock, TicketPercent, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";

export function EcosystemStrip() {
    const features = [
        {
            icon: Monitor,
            title: "Point of Sale (POS)"
        },
        {
            icon: Laptop,
            title: "Branded Website and App"
        },
        {
            icon: Smartphone,
            title: "Online Ordering"
        },
        {
            icon: Layers,
            title: "Integrations"
        },
        {
            icon: QrCode,
            title: "QR Code Table Ordering"
        },
        {
            icon: CalendarClock,
            title: "Table Reservations"
        },
        {
            icon: TicketPercent,
            title: "Loyalty Program"
        }
    ];

    return (
        <section className="bg-black/80 backdrop-blur-sm border-t border-b border-white/5 relative z-20 py-12">
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
                                "hidden lg:block absolute top-[2rem] left-[50%] w-full h-[2px] -z-0",
                                index === features.length - 1 ? "hidden" : ""
                            )}>
                                <div className="absolute inset-0 border-t-2 border-dotted border-zinc-800/50 w-[calc(100%-4rem)] translate-x-[2rem]" />
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
