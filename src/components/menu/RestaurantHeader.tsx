
"use client";

import { CartDrawer } from "./CartDrawer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function RestaurantHeader({ restaurant }: { restaurant: any }) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-xl border-b shadow-sm py-2" : "bg-transparent py-4"}`}>
            <div className="container mx-auto px-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-background/50">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    {scrolled && (
                        <h1 className="font-bold text-lg truncate max-w-[150px] sm:max-w-xs animate-in fade-in slide-in-from-left-4">
                            {restaurant.name}
                        </h1>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-background/50">
                        <Share2 className="h-5 w-5" />
                    </Button>
                    <CartDrawer />
                </div>
            </div>
        </header>
    );
}
