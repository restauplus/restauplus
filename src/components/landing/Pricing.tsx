"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, Zap, Star, Shield, Rocket, Flame, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Pricing() {
    return (
        <section id="pricing" className="relative py-24 bg-black overflow-hidden selection:bg-orange-500/30">
            {/* Background Effects - Ultra Dynamic */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[20%] w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[128px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[128px] animate-pulse-slow delay-1000" />
                <div className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] animate-pulse-slow delay-500" />
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-8 space-y-16">

                {/* Hero Section */}
                <div className="text-center space-y-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-gradient-to-r from-orange-500/10 to-purple-500/10 border border-orange-500/20 text-xs font-bold uppercase tracking-widest text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.1)] backdrop-blur-md"
                    >
                        <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-pulse" />
                        Founders Launch Event
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black tracking-tighter text-white"
                    >
                        Choose Your<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-200 to-purple-200">Path to Dominance</span>
                    </motion.h2>
                </div>

                {/* Pricing Cards - 3 Column Layout - COMPACT */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center max-w-6xl mx-auto">

                    {/* 1. Monthly Plan (Left) */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="relative group h-full"
                    >
                        <div className="h-full bg-zinc-900/40 backdrop-blur-xl rounded-2xl border border-white/5 p-6 flex flex-col hover:border-orange-500/30 hover:bg-zinc-900/60 transition-all duration-500 group-hover:shadow-[0_0_40px_rgba(249,115,22,0.05)]">
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-zinc-400 mb-2">Monthly Pro</h3>
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-4xl font-black text-white tracking-tight">499 QAR</span>
                                    <span className="text-zinc-500 font-medium text-sm">/mo</span>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs text-zinc-600 line-through font-medium">was 800 QAR</span>
                                    <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">Save 37%</span>
                                </div>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "Real-time Dashboard",
                                    "Unlimited QR Scans",
                                    "Inventory & Stock",
                                    "Staff Management",
                                    "Standard Support"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2.5 text-xs text-zinc-300 group-hover:text-white transition-colors">
                                        <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700 group-hover:border-orange-500/50 transition-colors">
                                            <Check className="w-3 h-3 text-zinc-400 group-hover:text-orange-400" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link href="/register?plan=monthly" className="w-full">
                                <Button className="w-full h-12 bg-white/5 hover:bg-orange-600/10 border border-white/10 hover:border-orange-500/50 text-white hover:text-orange-400 font-bold rounded-xl active:scale-95 transition-all duration-300 text-sm">
                                    Select Monthly
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* 2. Free Trial (Center - THE STAR) - COMPACT */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative z-20 transform scale-100 lg:scale-105"
                    >
                        {/* Animated Border/Glow - "Perfect Promo" */}
                        <div className="absolute -inset-[2px] bg-gradient-to-r from-orange-500 via-purple-600 to-orange-500 rounded-[22px] blur-lg opacity-40 animate-pulse-slow" />
                        <div className="absolute -inset-[1px] bg-gradient-to-r from-orange-500 via-purple-600 to-orange-500 rounded-[20px]" />

                        <div className="absolute top-0 inset-x-0 flex justify-center z-30 -translate-y-1/2">
                            <span className="bg-gradient-to-r from-orange-500 to-purple-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg shadow-orange-500/40 border border-white/20">
                                Most Popular
                            </span>
                        </div>

                        <div className="relative h-full bg-[#080808] rounded-[19px] p-6 flex flex-col shadow-2xl overflow-hidden">
                            {/* Floating Background Badge */}
                            <div className="absolute top-[-80px] right-[-80px] w-48 h-48 bg-gradient-to-br from-orange-500/10 to-purple-600/10 blur-[60px] rounded-full pointer-events-none" />

                            <div className="mt-4 mb-6 text-center relative">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-purple-600 text-white mb-4 shadow-2xl shadow-orange-500/20 group">
                                    <Crown className="w-8 h-8 fill-white/20 stroke-white drop-shadow-lg" />
                                </div>
                                <h3 className="text-xl font-black text-white mb-1">Founders Launch</h3>
                                <div className="flex flex-col items-center">
                                    <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-white to-purple-400 drop-shadow-sm">
                                        FREE
                                    </div>
                                    <span className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] mt-1 border border-white/10 px-2 py-0.5 rounded-full bg-white/5">For 10 Days</span>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-orange-500/10 to-purple-500/10 rounded-lg p-3 mb-6 border border-white/10 relative overflow-hidden backdrop-blur-sm">
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-500 to-purple-600" />
                                <p className="text-xs font-medium text-white/90 text-center leading-relaxed">
                                    "Experience the full power of Restau Plus Pro with absolutely zero risk."
                                </p>
                            </div>

                            <ul className="space-y-3 mb-6">
                                {[
                                    "Access to ALL Pro Features",
                                    "Priority Onboarding Setup",
                                    "No Credit Card Required",
                                    "Valid for First 10 Restaurants",
                                    "Cancel Anytime"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2.5 text-xs font-bold text-white">
                                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20">
                                            <Check className="w-3 h-3 text-white stroke-[3px]" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link href="/register?plan=trial" className="w-full mt-auto">
                                <Button className="w-full h-12 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-400 hover:to-purple-500 text-white font-black uppercase tracking-wider rounded-xl shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:shadow-[0_0_50px_rgba(168,85,247,0.5)] active:scale-95 transition-all duration-300 group text-sm">
                                    Start Free Trial
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>

                            <div className="text-center mt-4">
                                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest animate-pulse flex items-center justify-center gap-2">
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                                    </span>
                                    Only 3 Spots Remaining
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* 3. Yearly Plan (Right) - COMPACT */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="relative group h-full"
                    >
                        <div className="h-full bg-zinc-900/40 backdrop-blur-xl rounded-2xl border border-white/5 p-6 flex flex-col hover:border-purple-500/30 hover:bg-zinc-900/60 transition-all duration-500 group-hover:shadow-[0_0_40px_rgba(168,85,247,0.05)] relative overflow-hidden">
                            {/* Best Seller Badge */}
                            <div className="absolute top-5 right-5">
                                <span className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.2)]">
                                    Best Seller
                                </span>
                            </div>

                            <div className="mb-6 mt-2">
                                <h3 className="text-lg font-bold text-purple-400 mb-2">Yearly Elite</h3>
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-4xl font-black text-white tracking-tight">4850 QAR</span>
                                    <span className="text-zinc-500 font-medium text-sm">/yr</span>
                                </div>
                                <div className="flex flex-col gap-1 mt-2">
                                    <span className="text-xs text-zinc-600 line-through font-medium">was 8000 QAR</span>
                                    <div className="inline-flex items-center gap-1.5">
                                        <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/20">
                                            Equiv. 404 QAR/mo
                                        </span>
                                        <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-full">Save ~3,150 QAR</span>
                                    </div>
                                </div>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {[
                                    "Everything in Monthly",
                                    "Locked-in Discount Rate",
                                    "Dedicated Account Manager",
                                    "Advanced Analytics Suite",
                                    "Custom Branding Options",
                                    "Priority Feature Access"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2.5 text-xs text-zinc-300 group-hover:text-white transition-colors">
                                        <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700 group-hover:border-purple-500/50 transition-colors">
                                            <Check className="w-3 h-3 text-zinc-400 group-hover:text-purple-400" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link href="/register?plan=yearly" className="w-full">
                                <Button className="w-full h-12 bg-white/5 hover:bg-purple-600 hover:text-white border border-white/10 hover:border-purple-500 text-white font-bold rounded-xl active:scale-95 transition-all duration-300 text-sm">
                                    Go Elite Yearly
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Secure Badge / Features */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-8 border-t border-white/5 max-w-5xl mx-auto">
                    {[
                        { icon: Shield, title: "Secure Payment" },
                        { icon: Rocket, title: "Instant Activation" },
                        { icon: Zap, title: "Cancel Anytime" },
                        { icon: Star, title: "24/7 Priority Support" }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-center gap-2 opacity-50 hover:opacity-100 transition-opacity duration-300 group cursor-default">
                            <item.icon className="w-4 h-4 group-hover:text-orange-500 transition-colors" />
                            <span className="font-bold text-xs tracking-wide uppercase">{item.title}</span>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
