
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, QrCode, Smartphone } from "lucide-react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from "framer-motion";
import { useRef } from "react";
import { Spotlight } from "@/components/ui/spotlight";

export function Hero() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    // 3D Tilt Logic
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const x = (clientX - left) / width - 0.5;
        const y = (clientY - top) / height - 0.5;

        mouseX.set(x);
        mouseY.set(y);
    }

    return (
        <section ref={ref} className="relative overflow-hidden pt-24 pb-10 md:pt-40 md:pb-20 perspective-1000">
            {/* Dynamic Background with Spotlight */}
            <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

            <div className="container mx-auto px-4 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col items-center"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="mb-8 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-md shadow-lg shadow-primary/10 hover:shadow-primary/30 transition-shadow cursor-default"
                    >
                        <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-ping"></span>
                        The Future of Dining
                    </motion.div>

                    <h1 className="max-w-5xl text-5xl font-extrabold tracking-tight text-foreground sm:text-7xl mb-8 leading-tight">
                        <StaggerText text="Scan. Order." delay={0.1} /> <br className="hidden sm:block" />
                        <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent inline-block">
                            <StaggerText text="Relax." delay={0.5} />
                        </span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="max-w-2xl text-xl text-muted-foreground mb-12 leading-relaxed"
                    >
                        Revolutionize your restaurant with our seamless QR ordering system.
                        Reduce wait times, increase table turnover, and delight your customers.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0, duration: 0.8 }}
                        className="flex flex-col sm:flex-row gap-6 w-full justify-center"
                    >
                        <Link href="/register">
                            <Button size="lg" className="group gap-2 h-14 px-8 text-lg shadow-xl shadow-primary/25 hover:shadow-primary/50 transition-all hover:-translate-y-1">
                                <QrCode className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                Start Free Trial
                                <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button size="lg" variant="outline" className="gap-2 h-14 px-8 text-lg backdrop-blur-sm bg-background/50 hover:bg-background/80 hover:-translate-y-1 transition-transform border-primary/20">
                                <Smartphone className="w-5 h-5" />
                                Login
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* 3D Tilt Phone Mockup */}
            <div className="mt-24 flex justify-center perspective-1000" onMouseMove={handleMouseMove}>
                <TiltCard mouseX={mouseX} mouseY={mouseY}>
                    <motion.div
                        animate={{
                            rotateY: [-5, 5, -5],
                            rotateX: [2, -2, 2],
                            y: [-10, 10, -10]
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-900 border-[14px] rounded-[2.5rem] h-[650px] w-[320px] shadow-2xl flex flex-col items-center justify-start overflow-hidden ring-1 ring-white/10"
                    >
                        <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
                        <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                        <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
                        <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
                        <div className="rounded-[2rem] overflow-hidden w-[292px] h-[622px] bg-white dark:bg-zinc-950 relative">
                            {/* Fake Screen Content */}
                            <div className="absolute inset-0 flex flex-col">
                                <div className="h-16 bg-background/80 backdrop-blur-md flex items-center justify-center border-b z-20 sticky top-0">
                                    <span className="font-bold text-lg">Burger & Co.</span>
                                </div>
                                <div className="flex-1 p-4 grid gap-4 overflow-hidden relative">
                                    {/* Featured Item */}
                                    <motion.div
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="h-40 rounded-xl shadow-lg relative overflow-hidden group"
                                    >
                                        <img
                                            src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80"
                                            alt="Featured Burger"
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                                            <span className="text-white font-bold">Special Beef Burger</span>
                                        </div>
                                    </motion.div>

                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-sm">Popular Items</h3>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80",
                                            "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80",
                                            "https://images.unsplash.com/photo-1606131731446-5568d87113aa?auto=format&fit=crop&w=400&q=80",
                                            "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=400&q=80"
                                        ].map((img, i) => (
                                            <motion.div
                                                key={i}
                                                whileHover={{ scale: 1.05 }}
                                                className="h-32 rounded-xl border border-white/5 relative overflow-hidden"
                                            >
                                                <img
                                                    src={img}
                                                    alt={`Item ${i}`}
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-4 bg-background/80 backdrop-blur z-20">
                                    <div className="h-14 bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95 cursor-pointer">
                                        View Cart (2)
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </TiltCard>
            </div>
        </section>
    );
}

function StaggerText({ text, delay = 0 }: { text: string, delay?: number }) {
    return (
        <motion.span
            initial="hidden"
            animate="visible"
            variants={{
                visible: { transition: { staggerChildren: 0.05, delayChildren: delay } },
                hidden: {},
            }}
        >
            {text.split("").map((char, index) => (
                <motion.span
                    key={index}
                    variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                    }}
                    className="inline-block"
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </motion.span>
    );
}

function TiltCard({ children, mouseX, mouseY }: { children: React.ReactNode, mouseX: any, mouseY: any }) {
    const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);

    const springConfig = { damping: 25, stiffness: 150 };
    const springRotateX = useSpring(rotateX, springConfig);
    const springRotateY = useSpring(rotateY, springConfig);

    return (
        <motion.div
            style={{
                rotateX: springRotateX,
                rotateY: springRotateY,
                transformStyle: "preserve-3d",
            }}
        >
            {children}
        </motion.div>
    );
}
