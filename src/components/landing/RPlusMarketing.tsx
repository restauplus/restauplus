"use client";

import { motion } from "framer-motion";
import { Users2, Target, TrendingUp, Sparkles, ArrowRight, Database, Radar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";

export function RPlusMarketing() {
    const { t } = useLanguage();
    return (
        <section id="rplus-marketing" className="relative py-24 bg-black overflow-hidden selection:bg-purple-500/30 border-y border-white/5">
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[128px] animate-pulse-slow" />
                <div className="absolute bottom-[20%] left-[10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[128px] animate-pulse-slow delay-1000" />

                {/* Subtle Grid overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-8 max-w-7xl">

                {/* Header Section */}
                <div className="flex flex-col items-center text-center space-y-6 mb-16 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-white/10 text-sm font-bold uppercase tracking-widest text-white shadow-[0_0_20px_rgba(99,102,241,0.2)] backdrop-blur-sm"
                    >
                        <Radar className="w-4 h-4 text-indigo-400 animate-pulse" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                            {t('landing.rplusMarketing.badge')}
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-tight"
                    >
                        {t('landing.rplusMarketing.titleLine1')} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">{t('landing.rplusMarketing.titleLine2')}</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-zinc-400 font-medium leading-relaxed"
                    >
                        {t('landing.rplusMarketing.description')}
                    </motion.p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

                    {/* Left Side - Values/Steps */}
                    <div className="lg:col-span-5 space-y-6">
                        {[
                            {
                                icon: Database,
                                title: t('landing.rplusMarketing.steps.s1.title'),
                                desc: t('landing.rplusMarketing.steps.s1.desc'),
                                color: "text-indigo-400",
                                bg: "bg-indigo-500/10",
                                border: "border-indigo-500/20",
                                shadow: "shadow-indigo-500/10"
                            },
                            {
                                icon: Target,
                                title: t('landing.rplusMarketing.steps.s2.title'),
                                desc: t('landing.rplusMarketing.steps.s2.desc'),
                                color: "text-purple-400",
                                bg: "bg-purple-500/10",
                                border: "border-purple-500/20",
                                shadow: "shadow-purple-500/10"
                            },
                            {
                                icon: TrendingUp,
                                title: t('landing.rplusMarketing.steps.s3.title'),
                                desc: t('landing.rplusMarketing.steps.s3.desc'),
                                color: "text-pink-400",
                                bg: "bg-pink-500/10",
                                border: "border-pink-500/20",
                                shadow: "shadow-pink-500/10"
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 * idx }}
                                className={`relative group p-6 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-white/20 transition-all duration-300 backdrop-blur-sm overflow-hidden`}
                            >
                                <div className={`absolute top-0 right-0 w-32 h-32 ${item.bg} blur-[50px] rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50`} />

                                <div className="relative flex gap-4">
                                    <div className={`mt-1 flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border ${item.bg} ${item.border} ${item.shadow} shadow-lg`}>
                                        <item.icon className={`w-6 h-6 ${item.color}`} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                        <p className="text-zinc-400 leading-relaxed text-sm">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Right Side - Visual Dashboard Representation */}
                    <div className="lg:col-span-7 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="relative"
                        >
                            {/* Glow behind the dashboard */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-30 animate-pulse-slow" />

                            {/* Fake Dashboard UI */}
                            <div className="relative rounded-2xl bg-[#09090b] border border-white/10 shadow-2xl overflow-hidden p-6 md:p-8">

                                {/* Header of fake dashboard */}
                                <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                                    <div>
                                        <h4 className="text-lg font-bold text-white flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-purple-400" />
                                            {t('landing.rplusMarketing.dashboard.title')}
                                        </h4>
                                        <p className="text-xs text-zinc-500 mt-1">{t('landing.rplusMarketing.dashboard.activeFlow')}</p>
                                    </div>
                                    <div className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-bold rounded-lg uppercase tracking-wider">
                                        {t('landing.rplusMarketing.dashboard.active')}
                                    </div>
                                </div>

                                {/* Fake Customers List */}
                                <div className="space-y-4 relative">
                                    {/* Connection Line */}
                                    <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-indigo-500/50 via-purple-500/50 to-pink-500/50 hidden md:block" />

                                    {[
                                        { name: "Sarah Jenkins", phone: "+974 5*** ***", lastVisit: "24h ago", status: t('landing.rplusMarketing.dashboard.sendingOffer'), color: "text-indigo-400", timeDelay: "delay-100" },
                                        { name: "Mohammed Al-Thani", phone: "+974 3*** ***", lastVisit: "3 days ago", status: t('landing.rplusMarketing.dashboard.offerRedeemed'), color: "text-green-400", timeDelay: "delay-300" },
                                        { name: "Emily Chen", phone: "+974 7*** ***", lastVisit: "1 week ago", status: t('landing.rplusMarketing.dashboard.vipStatus'), color: "text-purple-400", timeDelay: "delay-500" },
                                    ].map((user, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.4 + (i * 0.2) }}
                                            className="relative flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="hidden md:flex flex-shrink-0 w-3 h-3 rounded-full bg-purple-500 z-10 ring-4 ring-[#09090b]" />
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center border border-white/10 shrink-0 shadow-inner">
                                                    <Users2 className="w-5 h-5 text-zinc-400" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-white">{user.name}</div>
                                                    <div className="text-xs text-zinc-500 flex items-center gap-2">
                                                        <span>{user.phone}</span>
                                                        <span className="w-1 h-1 rounded-full bg-zinc-700" />
                                                        <span>{user.lastVisit}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`text-xs font-bold ${user.color} bg-white/5 px-3 py-1.5 rounded-lg border border-white/5`}>
                                                {user.status}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Fake Stats Footer */}
                                <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
                                        <div className="text-xs text-zinc-400 mb-1">{t('landing.rplusMarketing.dashboard.newProfiles')}</div>
                                        <div className="text-2xl font-black text-white">+1,248</div>
                                        <div className="text-xs text-indigo-400 mt-1 font-medium flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" />
                                            {t('landing.rplusMarketing.dashboard.thisMonth')}
                                        </div>
                                    </div>
                                    <div className="p-4 bg-purple-500/5 rounded-xl border border-purple-500/10">
                                        <div className="text-xs text-zinc-400 mb-1">{t('landing.rplusMarketing.dashboard.returnRate')}</div>
                                        <div className="text-2xl font-black text-white">+34%</div>
                                        <div className="text-xs text-purple-400 mt-1 font-medium flex items-center gap-1">
                                            <Sparkles className="w-3 h-3" />
                                            {t('landing.rplusMarketing.dashboard.fromRetargeting')}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
