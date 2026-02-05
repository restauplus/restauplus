"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, X, Globe } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";

export function WelcomeSplash() {
    const [show, setShow] = useState(false);
    const [name, setName] = useState("");
    const [restaurantLogo, setRestaurantLogo] = useState<string | null>(null);
    const supabase = createClient();
    const { t, language, setLanguage } = useLanguage();

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            console.log("Welcome Splash - User ID:", user?.id);

            if (user) {
                // 1. Get Profile to find Restaurant ID
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*, restaurants:restaurant_id ( name, logo, logo_url )')
                    .eq('id', user.id)
                    .single();

                console.log("Welcome Splash - Profile with Restaurant:", profile);

                if (profile && profile.restaurants) {
                    // We found the restaurant via relation
                    // @ts-ignore
                    const r = profile.restaurants;
                    const rName = r.name || "Restaurant";
                    const rLogo = r.logo || r.logo_url;

                    setName(rName);
                    if (rLogo) setRestaurantLogo(rLogo);
                    setShow(true);
                } else {
                    // Fallback to searching by owner_id if relation failed
                    const { data: restaurant } = await supabase
                        .from('restaurants')
                        .select('*')
                        .eq('owner_id', user.id)
                        .single();

                    if (restaurant) {
                        setName(restaurant.name || "Restaurant");
                        setRestaurantLogo(restaurant.logo || restaurant.logo_url);
                        setShow(true);
                    } else {
                        // Ultimate fallback
                        setName(profile?.full_name || "Welcome");
                        setShow(true);
                    }
                }
            }
        };
        init();
    }, [supabase]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    key="welcome-splash"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] bg-[#000000] flex items-center justify-center overflow-hidden"
                >
                    {/* Background Ambience */}
                    <div className="absolute inset-0 opacity-40">
                        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_rgba(20,184,166,0.08)_0%,_transparent_50%)] animate-spin-slow duration-[60s]" />
                    </div>
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-6xl px-6">

                        {/* 1. Logos Section (Partnership) */}
                        <motion.div
                            initial={{ y: -30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="flex items-center gap-8 md:gap-12 mb-20"
                        >
                            {/* Restau+ Logo */}
                            <div className="relative group">
                                <div className="absolute inset-0 bg-teal-500/20 blur-[40px] rounded-full group-hover:bg-teal-500/30 transition-all duration-700" />
                                <img
                                    src="/restau-plus-white.png"
                                    alt="Restau+"
                                    className="h-12 md:h-16 w-auto relative z-10 drop-shadow-[0_0_20px_rgba(20,184,166,0.5)]"
                                />
                            </div>

                            {/* X Separator */}
                            {restaurantLogo && (
                                <div className="text-zinc-600 font-light text-2xl relative">
                                    <X className="w-6 h-6 opacity-50" />
                                </div>
                            )}

                            {/* Restaurant Logo (if exists) */}
                            {restaurantLogo && (
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-white/10 blur-[40px] rounded-full group-hover:bg-white/20 transition-all duration-700" />
                                    <img
                                        src={restaurantLogo}
                                        alt="Your Restaurant"
                                        className="h-16 md:h-20 w-auto max-w-[200px] object-contain relative z-10 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] grayscale group-hover:grayscale-0 transition-all duration-500"
                                    />
                                </div>
                            )}
                        </motion.div>

                        {/* 2. Text */}
                        <div className="text-center space-y-4 mb-20">
                            {/* Language Switcher */}
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.8 }}
                                className="flex justify-center mb-6"
                            >
                                <div dir="ltr" className="flex items-center p-1 bg-zinc-900/40 backdrop-blur-md rounded-full border border-white/5 shadow-2xl">
                                    <button
                                        onClick={() => setLanguage('en')}
                                        className={cn(
                                            "px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all duration-300",
                                            language === 'en'
                                                ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                                                : "text-zinc-500 hover:text-white"
                                        )}
                                    >
                                        ENGLISH
                                    </button>
                                    <button
                                        onClick={() => setLanguage('ar')}
                                        className={cn(
                                            "px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all duration-300",
                                            language === 'ar'
                                                ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                                                : "text-zinc-500 hover:text-white"
                                        )}
                                    >
                                        العربية
                                    </button>
                                </div>
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 0.5, y: 0 }}
                                transition={{ delay: 0.3, duration: 1 }}
                                className="text-white/60 text-sm md:text-base font-mono tracking-[0.4em] uppercase"
                            >
                                {t('welcome.secureAccess')}
                            </motion.p>

                            {/* CSS CAPITALIZE CLASS ADDED */}
                            <motion.h1
                                initial={{ scale: 0.9, opacity: 0, filter: "blur(10px)" }}
                                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                                transition={{ delay: 0.5, duration: 1.2, type: "spring", stiffness: 50 }}
                                className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-none capitalize"
                            >
                                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-zinc-200 to-zinc-600">
                                    {name}
                                </span>
                            </motion.h1>
                        </div>

                        {/* 3. Button */}
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1.2, duration: 1 }}
                            className="relative z-50 pointer-events-auto"
                        >
                            <button
                                onClick={() => {
                                    console.log("Closing splash screen...");
                                    setShow(false);
                                }}
                                className="group relative flex items-center gap-4 px-8 py-4 bg-zinc-900/40 hover:bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-full transition-all duration-500 hover:border-teal-500/40 hover:shadow-[0_0_30px_-5px_rgba(20,184,166,0.15)] cursor-pointer"
                            >
                                <span className="text-zinc-300 group-hover:text-white font-medium tracking-wide transition-colors">
                                    {t('welcome.enterDashboard')}
                                </span>
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-black transition-all duration-300">
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </button>
                        </motion.div>

                        {/* Emergency Close Button */}
                        <button
                            onClick={() => setShow(false)}
                            className="absolute top-10 right-10 text-zinc-500 hover:text-white transition-colors p-2 z-50 cursor-pointer"
                        >
                            <X className="w-6 h-6" />
                        </button>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
