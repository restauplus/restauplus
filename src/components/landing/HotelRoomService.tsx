"use client";

import { motion } from "framer-motion";
import { QrCode, Smartphone, BellRing, BedDouble, UtensilsCrossed } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export const HotelRoomService = () => {
    const { t } = useLanguage();
    return (
        <section className="relative py-32 overflow-hidden bg-black">
            {/* Background Gradients */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-600/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-20 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm font-bold tracking-widest uppercase mb-6"
                    >
                        <BedDouble className="w-4 h-4" />
                        {t('landing.hotelRoomService.badge')}
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight"
                    >
                        {t('landing.hotelRoomService.titleLine1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">{t('landing.hotelRoomService.titleLine2')}</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-zinc-400 font-medium"
                    >
                        {t('landing.hotelRoomService.description')}
                    </motion.p>
                </div>

                {/* The Flow / Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Step 1: Scan */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="relative group rounded-3xl bg-zinc-950 border border-white/5 p-8 hover:border-amber-500/30 transition-all duration-500 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="w-16 h-16 rounded-2xl bg-black border border-white/10 flex items-center justify-center mb-8 relative z-10 group-hover:scale-110 transition-transform duration-500">
                            <QrCode className="w-8 h-8 text-amber-500" />
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-3 relative z-10">{t('landing.hotelRoomService.steps.scan.title')}</h3>
                        <p className="text-zinc-500 relative z-10">
                            {t('landing.hotelRoomService.steps.scan.desc')}
                        </p>

                        {/* Mockup visual */}
                        <div className="mt-8 relative h-48 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-white/5 p-4 overflow-hidden shadow-inner">
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                            <div className="relative z-10 flex flex-col items-center justify-center h-full">
                                <div className="w-24 h-24 bg-white rounded-xl p-2 mb-3 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                                    <QrCode className="w-full h-full text-black" />
                                </div>
                                <span className="text-amber-500 font-bold tracking-widest text-xs uppercase bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">{t('landing.hotelRoomService.steps.scan.mockupRoom')}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Step 2: Order */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="relative group rounded-3xl bg-zinc-950 border border-white/5 p-8 hover:border-blue-500/30 transition-all duration-500 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="w-16 h-16 rounded-2xl bg-black border border-white/10 flex items-center justify-center mb-8 relative z-10 group-hover:scale-110 transition-transform duration-500">
                            <Smartphone className="w-8 h-8 text-blue-500" />
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-3 relative z-10">{t('landing.hotelRoomService.steps.order.title')}</h3>
                        <p className="text-zinc-500 relative z-10">
                            {t('landing.hotelRoomService.steps.order.desc')}
                        </p>

                        {/* Mockup visual */}
                        <div className="mt-8 relative h-48 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-white/5 p-4 overflow-hidden flex justify-center">
                            <div className="w-32 h-44 bg-black border-2 border-zinc-800 rounded-[20px] p-2 relative shadow-[0_0_30px_rgba(59,130,246,0.1)] translate-y-4 group-hover:translate-y-2 transition-transform duration-500">
                                <div className="w-full h-full bg-zinc-950 rounded-[12px] overflow-hidden flex flex-col pt-3 px-2 border border-white/5">
                                    <div className="text-[7px] text-zinc-500 text-center mb-2 font-black uppercase tracking-widest">{t('landing.hotelRoomService.steps.order.mockupTitle')}</div>
                                    <div className="w-full h-10 bg-zinc-900 rounded-lg mb-2 flex items-center px-2 border border-white/5">
                                        <div className="w-5 h-5 rounded-md bg-blue-500/20 text-blue-500 flex items-center justify-center"><UtensilsCrossed className="w-3 h-3" /></div>
                                        <div className="ml-2 w-10 h-1.5 bg-zinc-800 rounded-full"></div>
                                    </div>
                                    <div className="w-full h-10 bg-zinc-900 rounded-lg mb-2 border border-white/5"></div>
                                    <div className="mt-auto w-full h-7 bg-blue-600 rounded-md flex items-center justify-center shadow-[0_0_10px_rgba(37,99,235,0.4)]">
                                        <span className="text-[7px] font-bold text-white tracking-wider">{t('landing.hotelRoomService.steps.order.mockupButton')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Step 3: Kitchen / Dashboard Alert */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="relative group rounded-3xl bg-zinc-950 border border-white/5 p-8 hover:border-emerald-500/30 transition-all duration-500 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="w-16 h-16 rounded-2xl bg-black border border-white/10 flex items-center justify-center mb-8 relative z-10 group-hover:scale-110 transition-transform duration-500">
                            <BellRing className="w-8 h-8 text-emerald-500 group-hover:animate-[ring_1s_ease-in-out_infinite]" />
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-3 relative z-10">{t('landing.hotelRoomService.steps.notify.title')}</h3>
                        <p className="text-zinc-500 relative z-10">
                            {t('landing.hotelRoomService.steps.notify.desc')}
                        </p>

                        {/* Mockup visual */}
                        <div className="mt-8 relative h-48 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-white/5 p-4 overflow-hidden flex items-center justify-center">
                            <div className="w-full max-w-[220px] bg-black border border-white/10 rounded-xl p-4 shadow-[0_0_30px_rgba(16,185,129,0.15)] group-hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] transition-all duration-500 transform group-hover:-translate-y-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                        <BellRing className="w-5 h-5 text-emerald-500" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white mb-0.5">{t('landing.hotelRoomService.steps.notify.mockupNewOrder')}</div>
                                        <div className="text-[10px] text-zinc-500 font-medium tracking-wide">{t('landing.hotelRoomService.steps.notify.mockupTime')}</div>
                                    </div>
                                </div>
                                <div className="w-full bg-zinc-900/80 rounded-lg p-3 flex justify-between items-center border border-white/5">
                                    <span className="text-xs font-black tracking-widest text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">{t('landing.hotelRoomService.steps.notify.mockupRoom')}</span>
                                    <span className="text-sm font-black text-white">$45.00</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};
