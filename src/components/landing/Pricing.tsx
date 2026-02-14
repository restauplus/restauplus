"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, Zap, Star, Shield, Rocket, Flame, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Pricing() {
    return (
        <section id="pricing" className="relative py-12 bg-black overflow-hidden selection:bg-purple-500/30">
            {/* Background Effects - x9999 Dynamic */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[128px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[128px] animate-pulse-slow delay-1000" />
                <div className="absolute top-[40%] left-[-10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] animate-pulse-slow delay-500" />
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-8 space-y-8">

                {/* Hero Section */}
                <div className="text-center space-y-3 mb-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500/20 to-purple-500/20 border border-white/10 text-sm font-bold uppercase tracking-widest text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                    >
                        <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
                        Founders Launch Event
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-black tracking-tighter text-white"
                    >
                        Choose Your<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-zinc-400">Path to Dominance</span>
                    </motion.h2>
                </div>

                {/* Pricing Cards - 3 Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">

                    {/* 1. Monthly Plan (Left) */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="relative group h-full"
                    >
                        <div className="h-full bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-white/10 p-5 flex flex-col hover:border-white/20 transition-all duration-300">
                            <div className="mb-4">
                                <h3 className="text-lg font-bold text-zinc-400 mb-1">Monthly Pro</h3>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-black text-white">499 QAR</span>
                                    <span className="text-zinc-500 font-medium text-sm">/mo</span>
                                </div>
                                <div className="text-xs text-zinc-500 line-through mt-0.5">was 800 QAR</div>
                            </div>

                            <ul className="space-y-2 mb-6 flex-1">
                                {[
                                    "Real-time Dashboard",
                                    "Unlimited QR Scans",
                                    "Inventory & Stock",
                                    "Staff Management",
                                    "Standard Support"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                                        <Check className="w-4 h-4 text-zinc-500" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link href="/register?plan=monthly" className="w-full">
                                <Button className="w-full h-10 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-lg text-sm active:scale-95 transition-all">
                                    Select Monthly
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* 2. Free Trial (Center - THE STAR) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative z-20 transform scale-100 lg:scale-110"
                    >
                        {/* Animated Border/Glow - "Perfect Promo" */}
                        <div className="absolute -inset-[3px] bg-gradient-to-r from-orange-500 via-purple-600 to-orange-500 rounded-[26px] blur-sm bg-[length:200%_auto] animate-gradient-xy opacity-80" />
                        <div className="absolute -inset-[1px] bg-gradient-to-r from-orange-500 via-purple-600 to-orange-500 rounded-[24px] bg-[length:200%_auto] animate-gradient-xy" />

                        <div className="absolute top-0 inset-x-0 flex justify-center z-30">
                            <span className="bg-gradient-to-r from-orange-500 to-purple-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-b-xl shadow-lg shadow-orange-500/20">
                                Most Popular Choice
                            </span>
                        </div>

                        <div className="relative h-full bg-[#050505] rounded-[20px] p-5 flex flex-col shadow-2xl overflow-hidden">
                            {/* Floating Background Badge */}
                            <div className="absolute top-[-50px] right-[-50px] w-24 h-24 bg-orange-500/20 blur-[40px] rounded-full pointer-events-none" />

                            <div className="mt-4 mb-5 text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-purple-600 text-white mb-3 shadow-lg shadow-orange-500/30">
                                    <Crown className="w-6 h-6 fill-current" />
                                </div>
                                <h3 className="text-xl font-black text-white mb-1">Founders Launch</h3>
                                <div className="flex flex-col items-center">
                                    <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">
                                        FREE
                                    </div>
                                    <span className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] mt-0.5">For 10 Days</span>
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-lg p-3 mb-5 border border-white/10 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
                                <p className="text-xs font-medium text-zinc-300 text-center leading-relaxed">
                                    "Experience the full power of Restau Plus Pro with absolutely zero risk."
                                </p>
                            </div>

                            <ul className="space-y-2 mb-6">
                                {[
                                    "Access to ALL Pro Features",
                                    "Priority Onboarding Setup",
                                    "No Credit Card Required",
                                    "Valid for First 10 Restaurants",
                                    "Cancel Anytime"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-xs font-bold text-white">
                                        <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center shrink-0">
                                            <Check className="w-2.5 h-2.5 text-white stroke-[3px]" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link href="/register?plan=trial" className="w-full">
                                <Button className="w-full h-11 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-400 hover:to-purple-500 text-white font-black uppercase tracking-wider rounded-lg text-sm shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] active:scale-95 transition-all duration-300 group">
                                    Start Free Trial
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>

                            <div className="text-center mt-4">
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest animate-pulse">
                                    <span className="text-red-500 mr-2">●</span>
                                    Only 3 Spots Remaining
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* 3. Yearly Plan (Right) */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="relative group h-full"
                    >
                        <div className="h-full bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-white/10 p-5 flex flex-col hover:border-purple-500/30 hover:bg-purple-900/10 transition-all duration-300">
                            <div className="absolute top-0 right-0 p-4">
                                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                            </div>

                            <div className="mb-4">
                                <h3 className="text-lg font-bold text-purple-400 mb-1">Yearly Elite Pro</h3>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-black text-white">4850 QAR</span>
                                    <span className="text-zinc-500 font-medium text-sm">/yr</span>
                                </div>
                                <div className="inline-block mt-1 px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 text-[10px] font-bold">
                                    ~404 QAR/mo (Best Value)
                                </div>
                            </div>

                            <ul className="space-y-2 mb-6 flex-1">
                                {[
                                    "Everything in Monthly",
                                    "Locked-in Discount Rate",
                                    "Dedicated Account Manager",
                                    "Advanced Analytics Suite",
                                    "Custom Branding Options",
                                    "Save 1138 QAR Yearly"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                                        <Check className="w-3.5 h-3.5 text-purple-500" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link href="/register?plan=yearly" className="w-full">
                                <Button className="w-full h-10 bg-white/5 hover:bg-purple-600 hover:text-white border border-white/10 hover:border-purple-500 text-white font-bold rounded-lg text-sm active:scale-95 transition-all">
                                    Go Elite Yearly
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Secure Badge / Features */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-10 border-t border-white/5">
                    {[
                        { icon: Shield, title: "Secure Payment" },
                        { icon: Rocket, title: "Instant Activation" },
                        { icon: Zap, title: "Cancel Anytime" },
                        { icon: Star, title: "24/7 Priority Support" }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-center gap-3 opacity-50 hover:opacity-100 transition-opacity">
                            <item.icon className="w-5 h-5" />
                            <span className="font-bold text-sm tracking-wide uppercase">{item.title}</span>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
