
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, UtensilsCrossed, ClipboardList, Settings, ChefHat, LogOut, Shield, Truck, Network, ExternalLink, MessageCircle, Users, Headset, ChevronsLeft, ChevronsRight, MessageSquare, Globe, History } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/language-context";

export function Sidebar({ className, mobile, isCollapsed, onToggle }: { className?: string; mobile?: boolean; isCollapsed?: boolean; onToggle?: () => void }) {
    const pathname = usePathname();
    const { user, signOut } = useAuth();
    const { t, language, setLanguage, direction } = useLanguage();
    const [isAdmin, setIsAdmin] = useState(false);
    const [restaurantSlug, setRestaurantSlug] = useState<string | null>(null);
    const supabase = createClient();

    const sidebarItems = [
        { name: t('sidebar.overview'), href: "/dashboard/owner", icon: LayoutDashboard },
        { name: t('sidebar.orders'), href: "/dashboard/owner/orders", icon: ClipboardList },
        { name: 'Orders History', href: "/dashboard/owner/history", icon: History },
        { name: t('sidebar.clients'), href: "/dashboard/owner/clients", icon: Users },
        { name: t('sidebar.menu'), href: "/dashboard/owner/menu", icon: UtensilsCrossed },
        { name: t('sidebar.chatbot'), href: "/dashboard/owner/chatbot", icon: MessageCircle, badge: t('sidebar.new') },
        { name: t('sidebar.delivery'), href: "/dashboard/owner/delivery", icon: Truck, badge: t('sidebar.soon') },
        { name: t('sidebar.integrations'), href: "/dashboard/owner/integrations", icon: Network, badge: t('sidebar.soon') },
        { name: t('sidebar.settings'), href: "/dashboard/owner/settings", icon: Settings },
        { name: t('sidebar.messages'), href: "/dashboard/owner/messages", icon: MessageSquare, badge: t('sidebar.pro') },
    ];

    useEffect(() => {
        if (!user) return;
        const checkAdminAndSlug = async () => {
            if (['admin@restauplus.com', 'admin212123@restauplus.com'].includes(user.email || '')) {
                setIsAdmin(true);
                return;
            }
            const { data } = await supabase.from('profiles').select('role, restaurant:restaurants(slug)').eq('id', user.id).single();
            if (data?.role === 'admin') setIsAdmin(true);

            // @ts-ignore
            if (data?.restaurant?.slug) {
                // @ts-ignore
                setRestaurantSlug(data.restaurant.slug);
            }
        };
        checkAdminAndSlug();
    }, [user, supabase]);

    if (pathname?.startsWith('/dashboard/admin')) return null;

    return (
        <div className={cn(
            "h-full flex flex-col transition-all duration-300 relative",
            mobile ? "bg-zinc-900" : cn(
                "hidden md:flex fixed top-0 bg-zinc-900 text-white transition-all duration-300 z-40",
                direction === 'rtl' ? "right-0 border-l border-white/5" : "left-0 border-r border-white/5",
                isCollapsed ? "w-20" : "md:w-64 lg:w-72"
            ),
            className
        )}>
            {/* Sidebar Toggle (Desktop Only) */}
            {!mobile && onToggle && (
                <button
                    onClick={onToggle}
                    className={cn(
                        "absolute top-9 z-50 bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 rounded-full p-1.5 shadow-xl hover:scale-110 transition-all",
                        direction === 'rtl' ? "-left-3" : "-right-3"
                    )}
                >
                    {isCollapsed ? (direction === 'rtl' ? <ChevronsLeft className="h-4 w-4" /> : <ChevronsRight className="h-4 w-4" />) : (direction === 'rtl' ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />)}
                </button>
            )}

            {/* Logo Section */}
            <div className={cn("flex flex-col items-center justify-center pt-8 pb-6 shrink-0 relative z-20 gap-4 transition-all", isCollapsed ? "px-2" : "px-6")}>
                <Link href="/" className="flex items-center justify-center group">
                    <div className="relative flex items-center justify-center p-2 rounded-xl transition-all duration-500 group-hover:bg-white/5 group-hover:shadow-[0_0_20px_rgba(20,184,166,0.1)] border border-transparent group-hover:border-white/5">
                        <div className="absolute inset-0 bg-teal-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <img
                            src={isCollapsed ? "/icon.png" : "/logo.png"}
                            onError={(e) => { e.currentTarget.src = "/logo.png" }}
                            alt="RESTAU PLUS"
                            className={cn("h-10 w-auto max-w-full object-contain relative z-10 transition-all duration-500", isCollapsed ? "scale-110" : "group-hover:scale-110 group-hover:rotate-3")}
                        />
                    </div>
                </Link>

                {!isCollapsed && (
                    <Link
                        href={restaurantSlug ? `/restaurant/${restaurantSlug}` : '/'}
                        target="_blank"
                        className="relative group/web overflow-hidden rounded-full p-[1px] shadow-lg shadow-teal-500/20 transition-all hover:scale-105 hover:shadow-teal-500/40"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-500 rounded-full animate-pulse opacity-70 group-hover/web:opacity-100 duration-1000" />
                        <div className="relative flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 group-hover/web:bg-zinc-900/90 transition-colors">
                            <span className="bg-gradient-to-r from-teal-200 to-teal-400 bg-clip-text text-transparent text-[11px] font-bold tracking-wide uppercase">
                                {t('sidebar.visitWebsite')}
                            </span>
                            <ExternalLink className="h-3 w-3 text-teal-400 group-hover/web:translate-x-0.5 group-hover/web:-translate-y-0.5 transition-transform rtl:flip" />
                        </div>
                    </Link>
                )}
            </div>

            {/* Navigation */}
            <div className="flex flex-col gap-6 p-4 flex-1 overflow-y-auto custom-scrollbar overflow-x-hidden">

                {/* Dashboard Section */}
                <div className="flex flex-col gap-1">
                    {!isCollapsed && <h3 className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2 origin-left transition-all delay-100">{t('sidebar.dashboard')}</h3>}
                    {sidebarItems.slice(0, 1).map((item) => { // Overview only
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href} className="relative group/link">
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full h-10 transition-all duration-300 relative",
                                        isCollapsed ? "justify-center px-0 rounded-xl" : "justify-start gap-2 rounded-e-xl rounded-s-none ps-3",
                                        isActive
                                            ? "bg-zinc-800/80 text-teal-400 font-bold"
                                            : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5 font-medium"
                                    )}
                                    title={isCollapsed ? item.name : undefined}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-nav"
                                            className={cn("absolute bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]", isCollapsed ? "left-1 right-1 w-1 h-1 rounded-full top-2 mx-auto" : "start-1 top-1/2 -translate-y-1/2 h-4 w-1 rounded-full")}
                                        />
                                    )}
                                    <item.icon className={cn(
                                        "h-4 w-4 transition-colors shrink-0",
                                        isActive ? "text-teal-400" : "text-zinc-500 group-hover/link:text-zinc-100"
                                    )} />
                                    {!isCollapsed && <span className="text-[13px] tracking-tight truncate">{item.name}</span>}
                                </Button>
                            </Link>
                        )
                    })}
                </div>

                {/* Management Section */}
                <div className="flex flex-col gap-1">
                    {!isCollapsed && <h3 className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2 mt-4 origin-left transition-all">{t('sidebar.management')}</h3>}
                    {sidebarItems.slice(1).map((item) => { // Rest of items
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href} className="relative group/link">
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full h-10 transition-all duration-300 relative",
                                        isCollapsed ? "justify-center px-0 rounded-xl" : "justify-start gap-2 rounded-e-xl rounded-s-none ps-3",
                                        isActive
                                            ? "bg-zinc-800/80 text-teal-400 font-bold"
                                            : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5 font-medium"
                                    )}
                                    title={isCollapsed ? item.name : undefined}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-nav"
                                            className={cn("absolute bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]", isCollapsed ? "left-1 right-1 w-1 h-1 rounded-full top-2 mx-auto" : "start-1 top-1/2 -translate-y-1/2 h-4 w-1 rounded-full")}
                                        />
                                    )}
                                    <item.icon className={cn(
                                        "h-4 w-4 transition-colors shrink-0",
                                        isActive ? "text-teal-400" : "text-zinc-500 group-hover/link:text-zinc-100"
                                    )} />
                                    {!isCollapsed && (
                                        <>
                                            <span className="text-[13px] tracking-tight truncate">{item.name}</span>
                                            {item.badge && (
                                                <span className="ms-auto me-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-widest shadow-sm">
                                                    {isCollapsed ? '+' : item.badge}
                                                </span>
                                            )}
                                        </>
                                    )}
                                </Button>
                            </Link>
                        )
                    })}
                </div>

                {/* Admin Section (Conditional) */}
                {
                    isAdmin && (
                        <div className="flex flex-col gap-1 mt-2 pt-4 border-t border-zinc-800">
                            {!isCollapsed && (
                                <h3 className="px-4 text-xs font-semibold text-amber-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Shield className="w-3 h-3" />
                                    {t('sidebar.admin')}
                                </h3>
                            )}
                            <Link href="/dashboard/admin">
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full h-10 transition-all text-slate-400 hover:text-amber-400 hover:bg-amber-500/10",
                                        isCollapsed ? "justify-center px-0 rounded-xl" : "justify-start gap-2 rounded-xl ps-3"
                                    )}
                                    title={isCollapsed ? t('sidebar.adminConsole') : undefined}
                                >
                                    <LayoutDashboard className="h-4 w-4" />
                                    {!isCollapsed && <span className="text-[13px] font-medium truncate">{t('sidebar.adminConsole')}</span>}
                                </Button>
                            </Link>
                        </div>
                    )
                }
            </div>

            {/* Footer / Logout */}
            <div className="mt-auto p-4 border-t border-slate-800 flex flex-col gap-2">

                {/* Language Switcher */}
                <Button
                    variant="ghost"
                    onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                    className={cn(
                        "w-full h-10 transition-all text-zinc-400 hover:text-white hover:bg-white/5",
                        isCollapsed ? "justify-center px-0 rounded-xl" : "justify-start gap-2 rounded-xl ps-3"
                    )}
                    title="Switch Language"
                >
                    <Globe className="h-4 w-4" />
                    {!isCollapsed && (
                        <span className="text-[13px] font-medium flex-1 text-start">
                            {language === 'en' ? 'Arabic' : 'English'}
                        </span>
                    )}
                    {!isCollapsed && (
                        <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-500 font-bold">
                            {language.toUpperCase()}
                        </span>
                    )}
                </Button>

                {!isCollapsed ? (
                    <Link href="https://wa.me/+97451704550" target="_blank">
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 h-auto py-3 rounded-xl ps-3 text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 transition-all"
                        >
                            <Headset className="h-5 w-5 shrink-0" />
                            <div className="flex flex-col items-start text-left overflow-hidden">
                                <span className="text-[13px] font-bold leading-none truncate w-full">{t('sidebar.contactSupport')}</span>
                                <span className="text-[10px] text-teal-400/60 font-medium mt-1">9am - 2am 7D/7D</span>
                            </div>
                        </Button>
                    </Link>
                ) : (
                    <Link href="https://wa.me/+97451704550" target="_blank">
                        <Button variant="ghost" className="w-full justify-center h-12 rounded-xl text-teal-400 hover:bg-teal-500/10" title={t('sidebar.contactSupport')}>
                            <Headset className="h-5 w-5" />
                        </Button>
                    </Link>
                )}

                <Button
                    variant="ghost"
                    className={cn(
                        "w-full h-10 transition-all text-slate-400 hover:text-red-400 hover:bg-red-500/10",
                        isCollapsed ? "justify-center px-0 rounded-xl" : "justify-start gap-2 rounded-xl ps-3"
                    )}
                    onClick={signOut}
                    title={isCollapsed ? t('sidebar.logout') : undefined}
                >
                    <LogOut className="h-4 w-4" />
                    {!isCollapsed && <span className="text-[13px] font-medium">{t('sidebar.logout')}</span>}
                </Button>
            </div>
        </div>
    );
}
