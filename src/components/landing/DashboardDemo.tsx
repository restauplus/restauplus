"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { Users, TrendingUp, Menu, ChefHat, ArrowRight, Play, Search, Plus, MessageSquare, Truck, Network, Settings, LogOut, Headphones, ExternalLink, LayoutDashboard, UtensilsCrossed, ClipboardList, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LaptopFrame } from "@/components/ui/laptop-frame";

const menuItems = [
    { id: 1, name: "Mac cheese bowl", price: "QR 34.00", image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80", tag: "FRIED", category: "PLATES AND BOWLS" },
    { id: 2, name: "Chicken dish with fries", price: "QR 28.00", image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80", tag: "CRISPY", category: "PLATES AND BOWLS" },
    { id: 3, name: "Spicy Sandwich", price: "QR 24.00", image: "https://images.unsplash.com/photo-1606758064437-12fb278385bf?auto=format&fit=crop&w=800&q=80", tag: "SPICY", category: "SANDWICHES AND ZINGERS" },
    { id: 4, name: "Chicken Sandwich", price: "QR 27.00", image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80", tag: null, category: "SANDWICHES AND ZINGERS" },
    { id: 5, name: "Spicy Burger", price: "QR 25.00", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80", tag: "HOT", category: "BURGERS" },
    { id: 6, name: "Mango Burger", price: "QR 30.00", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80", tag: "NEW", category: "BURGERS" },
    { id: 7, name: "Tasty Burger", price: "QR 22.00", image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=800&q=80", tag: null, category: "BURGERS" },
    { id: 8, name: "Classic Burger", price: "QR 18.00", image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=800&q=80", tag: null, category: "BURGERS" },
];

export function DashboardDemo() {
    // 3D Mouse Follow Effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { damping: 15, stiffness: 100 });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), { damping: 15, stiffness: 100 });

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        mouseX.set((clientX - left) / width - 0.5);
        mouseY.set((clientY - top) / height - 0.5);
    }

    return (
        <section
            onMouseMove={handleMouseMove}
            className="relative min-h-[110vh] flex flex-col justify-center pt-24 pb-20 overflow-hidden bg-[#050505] selection:bg-cyan-500/30 perspective-1500"
        >
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="container mx-auto px-4 lg:px-8 z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* LEFT COLUMN: THE LAPTOP (Dynamic Menu Management) */}
                    <motion.div
                        style={{ perspective: 2000, rotateX, rotateY }}
                        initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
                        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="order-2 lg:order-1 relative z-20"
                    >
                        <motion.div
                            animate={{ y: [-10, 10, -10] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="transform hover:scale-[1.02] transition-transform duration-500"
                        >
                            <LaptopFrame>
                                <img
                                    src="/dashboard-screen-8.png"
                                    alt="RestauPro Dashboard"
                                    className="w-full h-full object-fill"
                                />
                            </LaptopFrame>
                        </motion.div>
                    </motion.div>

                    {/* RIGHT COLUMN: TEXT CONTENT */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        className="text-left space-y-8 order-1 lg:order-2 px-4 lg:px-0"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-widest uppercase"
                        >
                            The Future is Here
                        </motion.div>

                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-[1.1]">
                            Control Your<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Empire</span> With<br />
                            One Touch.
                        </h1>

                        <p className="text-xl text-zinc-400 max-w-lg font-medium leading-relaxed">
                            Replace 5 fragmented tools with one powerful operating system. Built for speed, designed for scale.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link href="/register?plan=trial">
                                <Button className="h-14 md:h-16 px-8 md:px-10 text-lg rounded-full bg-cyan-400 text-black hover:bg-cyan-300 font-bold shadow-[0_0_40px_rgba(34,211,238,0.3)] hover:shadow-[0_0_60px_rgba(34,211,238,0.5)] transition-all">
                                    Start Free Trial
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                            <Link href="/restaurant/fried">
                                <Button variant="outline" className="h-14 md:h-16 px-8 md:px-10 text-lg rounded-full border-white/10 hover:bg-white/10 text-white font-medium hover:border-white/20">
                                    <Play className="w-5 h-5 mr-3 fill-white" />
                                    Watch Demo
                                </Button>
                            </Link>
                        </div>

                        <div className="flex items-center gap-6 pt-8 border-t border-white/5">
                            <div>
                                <h4 className="text-3xl font-black text-white">500+</h4>
                                <p className="text-sm text-zinc-500">Restaurants Scaled</p>
                            </div>
                            <div className="w-px h-12 bg-white/10" />
                            <div>
                                <h4 className="text-3xl font-black text-white">$120M</h4>
                                <p className="text-sm text-zinc-500">Processed Yearly</p>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}

function MenuItem({ icon: Icon, label, active, badge, badgeColor = "bg-purple-500 text-white" }: any) {
    return (
        <div className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all group relative",
            active ? "bg-white/[0.03] text-white" : "text-zinc-400 hover:text-white hover:bg-white/5"
        )}>
            {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-cyan-400 rounded-r-full" />}
            <Icon className={cn("w-4 h-4 shrink-0", active && "text-cyan-400")} />
            <span className={cn("hidden md:block truncate text-[11px] font-medium", active && "text-cyan-400 font-bold")}>{label}</span>
            {badge && (
                <span className={cn("hidden md:block ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded", badgeColor)}>
                    {badge}
                </span>
            )}
        </div>
    );
}
