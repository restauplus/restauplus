import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "../ui/bento-grid";
import {
    IconArrowWaveRightUp,
} from "@tabler/icons-react";
import { ChefHat, TrendingUp, Users, QrCode } from "lucide-react";

export function Features() {
    return (
        <section className="py-24 bg-black relative overflow-hidden">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />

            <div className="container mx-auto px-4 mb-16 text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                    More than just a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Digital Menu</span>
                </h2>
                <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
                    RESTAU PLUS provides a complete ecosystem to digitize your restaurant operations.
                </p>
            </div>

            <BentoGrid className="max-w-4xl mx-auto">
                {items.map((item, i) => (
                    <BentoGridItem
                        key={i}
                        title={item.title}
                        description={item.description}
                        header={item.header}
                        icon={item.icon}
                        className={i === 3 || i === 6 ? "md:col-span-2" : ""}
                    />
                ))}
            </BentoGrid>
        </section>
    );
}

const FeatureImage = ({ src, alt }: { src: string, alt: string }) => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden relative border border-white/5">
        <img
            src={src}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/bento:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 group-hover/bento:bg-black/0 transition-colors duration-500" />
    </div>
);

const items = [
    {
        title: "Instant QR Ordering",
        description: "Scan, order, and pay. No apps to download. Pure speed.",
        // Changed to a very stable "Person holding phone in cafe" image
        header: <FeatureImage src="https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80" alt="QR Ordering" />,
        icon: <QrCode className="h-4 w-4 text-neutral-500" />,
    },
    {
        title: "Smart Upselling",
        description: "AI-powered recommendations that boost check size by 20%.",
        header: <FeatureImage src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80" alt="Delicious Food" />,
        icon: <TrendingUp className="h-4 w-4 text-neutral-500" />,
    },
    {
        title: "Kitchen Display System",
        description: "Real-time order syncing directly to your kitchen.",
        // Changed to a working Kitchen image
        header: <FeatureImage src="https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?auto=format&fit=crop&w=800&q=80" alt="Kitchen Chef" />,
        icon: <ChefHat className="h-4 w-4 text-neutral-500" />,
    },
    {
        title: "Staff Management",
        description:
            "Track performance, manage shifts, and optimize your team's efficiency.",
        header: <FeatureImage src="https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&w=800&q=80" alt="Restaurant Staff" />,
        icon: <Users className="h-4 w-4 text-neutral-500" />,
    },
    {
        title: "Real-time Analytics",
        description: "Watch your revenue grow in real-time with our dashboard.",
        header: <FeatureImage src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" alt="Analytics" />,
        icon: <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500" />,
    },
];
