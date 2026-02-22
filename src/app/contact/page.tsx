"use client";

import { motion } from "framer-motion";
import { Mail, MessageCircle, MapPin, Send, Phone, ArrowRight, Instagram, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/context/language-context";

export default function ContactPage() {
    const { t } = useLanguage();
    return (
        <main className="min-h-screen bg-black relative text-white selection:bg-purple-500/30 overflow-x-hidden">
            <Navbar />

            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[128px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[128px] animate-pulse-slow delay-700" />
            </div>

            <div className="relative z-10 pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center space-y-6 mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-bold uppercase tracking-widest text-zinc-400"
                    >
                        <MessageCircle className="w-4 h-4" />
                        {t('landing.contact.badge')}
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black tracking-tighter"
                    >
                        {t('landing.contact.titleLine1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">{t('landing.contact.titleLine2')}</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-zinc-400 max-w-2xl mx-auto font-medium"
                    >
                        {t('landing.contact.description')}
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">

                    {/* Left Column: Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-12"
                    >
                        {/* WhatsApp Card - Direct Action */}
                        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-3xl p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/20 blur-[60px] rounded-full pointer-events-none group-hover:bg-green-500/30 transition-all duration-500 rtl:right-auto rtl:left-0" />

                            <h3 className="text-2xl font-bold text-white mb-2">{t('landing.contact.instantSupport.title')}</h3>
                            <p className="text-zinc-400 mb-6">{t('landing.contact.instantSupport.desc')}</p>

                            <a
                                href="https://wa.me/97451704550"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button className="w-full h-14 bg-[#25D366] hover:bg-[#1dbf57] text-black font-bold text-lg rounded-xl shadow-lg shadow-green-500/20 active:scale-95 transition-all">
                                    <MessageCircle className="w-5 h-5 mr-3 rtl:mr-0 rtl:ml-3" />
                                    {t('landing.contact.instantSupport.button')}
                                </Button>
                            </a>
                            <div className="mt-4 text-center">
                                <span className="text-sm font-bold text-green-400 flex items-center justify-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    {t('landing.contact.instantSupport.online')}
                                </span>
                            </div>
                        </div>

                        {/* Other Contact Methods */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-white">{t('landing.contact.otherWays.title')}</h3>

                            <div className="space-y-4">
                                <a href="mailto:contact@restau.plus" className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Mail className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-white">{t('landing.contact.otherWays.emailSupport')}</div>
                                        <div className="text-sm text-zinc-400">contact@restau.plus</div>
                                    </div>
                                </a>

                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-white">{t('landing.contact.otherWays.hq')}</div>
                                        <div className="text-sm text-zinc-400">Doha, Qatar</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-4">
                            {[
                                { icon: Instagram, href: "#" },
                                { icon: Twitter, href: "#" },
                                { icon: Linkedin, href: "#" }
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all text-white"
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Column: Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-3xl p-8 lg:p-10"
                    >
                        <h3 className="text-2xl font-bold text-white mb-6">{t('landing.contact.form.title')}</h3>
                        <form className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-400 ml-1 rtl:ml-0 rtl:mr-1">{t('landing.contact.form.nameLabel')}</label>
                                    <Input
                                        placeholder={t('landing.contact.form.namePlaceholder')}
                                        className="h-12 bg-white/5 border-white/10 focus:border-purple-500/50 rounded-xl text-white placeholder:text-zinc-600"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-400 ml-1 rtl:ml-0 rtl:mr-1">{t('landing.contact.form.restaurantLabel')}</label>
                                    <Input
                                        placeholder={t('landing.contact.form.restaurantPlaceholder')}
                                        className="h-12 bg-white/5 border-white/10 focus:border-purple-500/50 rounded-xl text-white placeholder:text-zinc-600"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-zinc-400 ml-1 rtl:ml-0 rtl:mr-1">{t('landing.contact.form.emailLabel')}</label>
                                <Input
                                    type="email"
                                    placeholder="john@example.com"
                                    className="h-12 bg-white/5 border-white/10 focus:border-purple-500/50 rounded-xl text-white placeholder:text-zinc-600"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-zinc-400 ml-1 rtl:ml-0 rtl:mr-1">{t('landing.contact.form.messageLabel')}</label>
                                <Textarea
                                    placeholder={t('landing.contact.form.messagePlaceholder')}
                                    className="min-h-[150px] bg-white/5 border-white/10 focus:border-purple-500/50 rounded-xl text-white placeholder:text-zinc-600 resize-none p-4"
                                />
                            </div>

                            <Button className="w-full h-14 bg-white text-black hover:bg-zinc-200 font-bold text-lg rounded-xl shadow-lg active:scale-95 transition-all">
                                {t('landing.contact.form.button')}
                                <Send className="w-5 h-5 ml-2 rtl:ml-0 rtl:mr-2 rtl:scale-x-[-1]" />
                            </Button>
                        </form>
                    </motion.div>

                </div>
            </div>

            <Footer />
        </main>
    );
}
