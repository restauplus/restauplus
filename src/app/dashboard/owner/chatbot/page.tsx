"use client";

import { motion } from "framer-motion";
import { MessageCircle, Bot, Sparkles, CheckCircle, ArrowRight, Zap, Globe, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { cn } from "@/lib/utils";

export default function ChatbotPage() {
    return (
        <div className="flex-1 h-full relative overflow-hidden bg-black selection:bg-emerald-500/30">
            {/* Ultra Pro Background */}
            <div className="absolute inset-0 z-0">
                <StarsBackground />
                <ShootingStars />
            </div>

            {/* Ambient Glows */}
            <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[150px] pointer-events-none animate-pulse delay-1000" />

            <div className="relative z-10 h-full overflow-y-auto custom-scrollbar p-6 md:p-12">
                <div className="max-w-7xl mx-auto space-y-20 pb-20">

                    {/* Header Section */}
                    <div className="space-y-6 text-center max-w-3xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/80 border border-white/10 text-emerald-400 text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-md shadow-lg shadow-emerald-500/10"
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Next-Gen AI Automation</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight"
                        >
                            Automate Support. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 animate-gradient-x">
                                Boost Orders.
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
                        >
                            Empower your restaurant with an AI agent that lives on WhatsApp.
                            Handle thousands of customers simultaneously without lifting a finger.
                        </motion.p>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

                        {/* Features Column */}
                        <div className="space-y-8">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="grid gap-4"
                            >
                                <FeatureCard
                                    icon={Smartphone}
                                    title="24/7 Order Taking"
                                    description="Never miss an order. The AI handles menus, customizations, and checkout seamlessly."
                                />
                                <FeatureCard
                                    icon={Zap}
                                    title="Instant Responses"
                                    description="Zero wait time. Customers get immediate answers to FAQs, location, and hours."
                                />
                                <FeatureCard
                                    icon={Globe}
                                    title="Multi-Language Native"
                                    description="Fluently speaks Arabic, English, and French to cater to all your customers."
                                />
                                <FeatureCard
                                    icon={Bot}
                                    title="Smart Upselling"
                                    description="Intelligently suggests add-ons and drinks to increase average order value."
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="pt-8"
                            >
                                <div className="p-[1px] rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500">
                                    <div className="bg-black/80 rounded-full p-2 backdrop-blur-xl">
                                        <a
                                            href="https://wa.me/97451704550"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block"
                                        >
                                            <Button className="w-full h-16 rounded-full bg-[#25D366] hover:bg-[#1ebc57] text-white text-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_-10px_rgba(37,211,102,0.5)] group relative overflow-hidden">
                                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 transform skew-y-12" />
                                                <div className="relative flex items-center justify-center gap-3">
                                                    <MessageCircle className="w-7 h-7 fill-current" />
                                                    <span>Connect AI Agent</span>
                                                    <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                                                </div>
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                                <p className="text-zinc-500 text-xs text-center mt-4">
                                    Exclusive access for Restau Plus partners. Setup takes less than 24h.
                                </p>
                            </motion.div>
                        </div>

                        {/* Interactive Phone Mockup */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotate: 6 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                            className="relative mx-auto lg:mr-0 lg:ml-auto"
                        >
                            {/* Phone Frame */}
                            <div className="relative w-[340px] h-[680px] bg-zinc-900 rounded-[3.5rem] border-[8px] border-zinc-800 shadow-[0_0_80px_-20px_rgba(16,185,129,0.3)] overflow-hidden ring-1 ring-white/10 z-10">
                                {/* Dynamic Island / Notch */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-32 bg-black rounded-b-2xl z-20" />

                                {/* Screen Content */}
                                <div className="w-full h-full bg-[#0b141a] flex flex-col relative">
                                    {/* WA Header */}
                                    <div className="h-24 bg-[#202c33] flex items-end px-4 py-3 gap-3 border-b border-[#2f3b43]">
                                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">R</div>
                                        <div className="flex-1 mb-1">
                                            <div className="text-gray-100 font-bold text-sm">Restau+ AI</div>
                                            <div className="text-emerald-500 text-xs">online</div>
                                        </div>
                                    </div>

                                    {/* Chat Area */}
                                    <div className="flex-1 p-4 space-y-4 overflow-hidden relative">
                                        {/* Chat Background Pattern */}
                                        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-[length:400px_400px]" />

                                        <div className="relative z-10 space-y-4">
                                            <ChatBubble delay={0.8} text="Hi! I'm hungry 😋" isUser />
                                            <ChatBubble
                                                delay={1.5}
                                                text="Welcome back, Alex! 👋 We have a special on **Wagyu Burgers** today. Interested?"
                                                isAi
                                            />
                                            <ChatBubble delay={2.5} text="Yes please! Add cheese." isUser />
                                            <ChatBubble
                                                delay={3.5}
                                                text="Excellent choice! 🍔 Wagyu Burger with extra cheese has been added to your cart."
                                                isAi
                                            />
                                            <ChatBubble
                                                delay={4.5}
                                                text="Would you like to add a Coke Zero for just 5 QAR?"
                                                isAi
                                            />

                                            {/* Typing Indicator */}
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 5.5 }}
                                                className="bg-[#202c33] rounded-2xl rounded-tl-none p-3 w-16 flex gap-1 items-center"
                                            >
                                                <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                                                <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                                                <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                                            </motion.div>
                                        </div>
                                    </div>

                                    {/* Input Area */}
                                    <div className="h-16 bg-[#202c33] flex items-center px-4 gap-3">
                                        <div className="flex-1 h-10 bg-[#2a3942] rounded-full" />
                                        <div className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center">
                                            <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Elements behind phone */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] bg-emerald-500/20 blur-[100px] -z-10 rounded-full" />
                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function FeatureCard({ icon: Icon, title, description }: any) {
    return (
        <div className="group relative p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center shrink-0 border border-emerald-500/20 group-hover:scale-110 transition-transform duration-500">
                    <Icon className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                    <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
                </div>
            </div>
        </div>
    );
}

function ChatBubble({ text, isUser, isAi, delay }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay, type: "spring" }}
            className={cn(
                "p-3 rounded-2xl text-sm max-w-[85%] shadow-sm",
                isUser ? "bg-[#005c4b] text-[#e9edef] ml-auto rounded-tr-none" : "bg-[#202c33] text-[#e9edef] mr-auto rounded-tl-none"
            )}
        >
            {text}
            <div className={cn(
                "text-[10px] mt-1 text-right opacity-70 flex justify-end gap-1",
                isUser ? "text-emerald-200" : "text-zinc-400"
            )}>
                <span>12:0{Math.floor(delay) + 1}</span>
                {isUser && <span className="text-[#53bdeb]">✓✓</span>}
            </div>
        </motion.div>
    );
}
