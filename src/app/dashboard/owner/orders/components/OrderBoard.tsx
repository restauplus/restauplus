"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, ChefHat, BellRing, UtensilsCrossed, User, Hash, DollarSign, RefreshCcw, Printer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";
import { OrderHistory } from "./OrderHistory";
import { NewOrderPopup } from "./NewOrderPopup";

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'served' | 'paid';

interface Order {
    id: string;
    table_id: string | null;
    status: OrderStatus;
    created_at: string;
    preparing_at?: string;
    ready_at?: string;
    served_at?: string;
    paid_at?: string;
    customer_phone?: string | null;
    table_number?: string | null;
    notes?: string | null;
    total_amount?: number;
    order_type?: 'dine_in' | 'takeaway';
    tables: { number: string } | null;
    order_items: {
        id: string;
        quantity: number;
        menu_items: { name: string; price: number } | null;
        notes?: string;
        price_at_time?: number;
    }[];
}

export function OrderBoard({
    initialOrders,
    restaurantId,
    currency,
    restaurantName,
    restaurantLogo,
    restaurantAddress,
    restaurantPhone,
    restaurantEmail,
    restaurantWebsite
}: {
    initialOrders: any[],
    restaurantId: string,
    currency: string,
    restaurantName?: string,
    restaurantLogo?: string | null,
    restaurantAddress?: string | null,
    restaurantPhone?: string | null,
    restaurantEmail?: string | null,
    restaurantWebsite?: string | null
}) {
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [showHistory, setShowHistory] = useState(false);
    const supabase = createClient();
    const { t } = useLanguage();

    const columns: { status: OrderStatus; label: string; icon: any; color: string; glow: string }[] = [
        { status: 'pending', label: t('ordersPage.board.columns.new'), icon: BellRing, color: 'text-teal-500', glow: 'shadow-teal-500/20' },
        { status: 'preparing', label: t('ordersPage.board.columns.preparing'), icon: ChefHat, color: 'text-orange-500', glow: 'shadow-orange-500/20' },
        { status: 'ready', label: t('ordersPage.board.columns.ready'), icon: CheckCircle2, color: 'text-emerald-500', glow: 'shadow-emerald-500/20' },
        { status: 'served', label: t('ordersPage.board.columns.served'), icon: UtensilsCrossed, color: 'text-indigo-500', glow: 'shadow-indigo-500/20' },
    ];

    const [isConnected, setIsConnected] = useState(false);
    const [newOrderModal, setNewOrderModal] = useState<Order | null>(null);

    // Sound Logic - "Ultra Pro"
    const playNotificationSound = async () => {
        try {
            const audio = new Audio('/shopify-sales.mp3');
            audio.volume = 1.0;
            await audio.play();
        } catch (e) {
            console.error("Audio playback failed", e);
        }
    };

    useEffect(() => {
        // Resume AudioContext on first click
        const enableAudio = () => {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContext) {
                const ctx = new AudioContext();
                ctx.resume();
            }
        };
        document.addEventListener('click', enableAudio, { once: true });

        // Request Notification Permission
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        const channel = supabase
            .channel('realtime orders')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'orders',
                    filter: `restaurant_id=eq.${restaurantId}`
                },
                async (payload) => {
                    if (payload.eventType === 'INSERT') {
                        const { data: newOrder } = await supabase
                            .from('orders')
                            .select(`*, tables(number), order_items(*, menu_items(name, price))`)
                            .eq('id', payload.new.id)
                            .single();

                        if (newOrder) {
                            setOrders(prev => [newOrder, ...prev]);
                            const tableInfo = newOrder.table_number || (newOrder.tables?.number ? `Table ${newOrder.tables.number}` : "Express");

                            // 1. Play Sound
                            playNotificationSound();

                            // 2. Trigger Blocking Modal
                            setNewOrderModal(newOrder);

                            // 3. System Notification
                            if (document.visibilityState === 'hidden' && 'Notification' in window && Notification.permission === 'granted') {
                                new Notification(`New Order: ${tableInfo}`, {
                                    body: `${newOrder.customer_phone || 'Guest'} - ${newOrder.order_items?.length || 0} items`,
                                    icon: '/logo.png'
                                });
                            }
                        }
                    } else if (payload.eventType === 'UPDATE') {
                        setOrders(prev => prev.map(o => o.id === payload.new.id ? { ...o, ...payload.new } : o));
                    }
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') setIsConnected(true);
                if (status === 'CHANNEL_ERROR') {
                    console.error("Realtime subscription error");
                    setIsConnected(false);
                }
                if (status === 'TIMED_OUT') setIsConnected(false);
            });

        return () => {
            document.removeEventListener('click', enableAudio);
            supabase.removeChannel(channel);
        };
    }, [supabase, restaurantId]);

    const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
        const timestampField =
            newStatus === 'preparing' ? 'preparing_at' :
                newStatus === 'ready' ? 'ready_at' :
                    newStatus === 'served' ? 'served_at' :
                        newStatus === 'paid' ? 'paid_at' : null;

        const updateData: any = { status: newStatus };
        if (timestampField) {
            updateData[timestampField] = new Date().toISOString();
        }

        // Optimistic UI
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updateData } : o));

        const { error } = await supabase.from('orders').update(updateData).eq('id', orderId);

        if (error) {
            const isMissingColumn = error.code === 'PGRST204' || error.message?.includes('Could not find the');

            if (!isMissingColumn) {
                console.error("Update with timestamp failed:", JSON.stringify(error));
            }

            // Fallback: Try updating STATUS ONLY
            if (timestampField) {
                const { error: retryError } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
                if (!retryError) {
                    toast.success(`Order moved to ${newStatus} (Timestamps skipped)`, { className: "glass-card" });
                    return;
                }
            }

            toast.error(`Update failed: ${error.message}`);
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: o.status } : o));
        } else {
            toast.success(`Order moved to ${newStatus}`, { className: "glass-card" });
        }
    };

    const [activeTab, setActiveTab] = useState<OrderStatus>('pending');
    const [isRefreshing, setIsRefreshing] = useState(false);

    const refreshOrders = async () => {
        setIsRefreshing(true);
        try {
            const { data: refreshedOrders, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    tables ( number ),
                    order_items (
                        *,
                        *,
                        menu_items ( name, price )
                    )
                    )
                `)
                .eq('restaurant_id', restaurantId)
                .neq('status', 'paid')
                .neq('status', 'cancelled')
                .order('created_at', { ascending: true });

            if (error) throw error;

            if (refreshedOrders) {
                // @ts-ignore
                setOrders(refreshedOrders);
                toast.success("Orders refreshed", { className: "glass-card" });
            }
        } catch (error) {
            console.error("Error refreshing orders:", error);
            toast.error("Failed to refresh orders");
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <div className="flex-1 h-full overflow-hidden flex flex-col pt-2">

            {/* New Order Popup */}
            <AnimatePresence>
                {newOrderModal && (
                    <NewOrderPopup
                        order={newOrderModal}
                        onAccept={() => setNewOrderModal(null)}
                        onClose={() => { }}
                    />
                )}
            </AnimatePresence>

            <div className="flex justify-end px-6 pb-2 gap-2 items-center">
                {/* Connection Status */}
                <div className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all",
                    isConnected
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_10px_-4px_#10b981]"
                        : "bg-red-500/10 text-red-500 border-red-500/20"
                )}>
                    <div className={cn("w-1.5 h-1.5 rounded-full", isConnected ? "bg-emerald-500 animate-pulse" : "bg-red-500")} />
                    {isConnected ? "LIVE" : "OFFLINE"}
                </div>

                <Button
                    variant="outline"
                    onClick={refreshOrders}
                    disabled={isRefreshing}
                    className="bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 gap-2"
                >
                    <RefreshCcw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
                    Refresh
                </Button>
                <Button
                    variant="outline"
                    onClick={() => setShowHistory(true)}
                    className="bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 gap-2"
                >
                    <Clock className="w-4 h-4" /> History
                </Button>
            </div>

            {/* Mobile/Tablet View */}
            <div className="xl:hidden flex flex-col h-full px-4">
                <div className="flex gap-3 overflow-x-auto md:grid md:grid-cols-4 pb-6 no-scrollbar px-1 scroll-padding-x-4">
                    {columns.map(col => {
                        const isActive = activeTab === col.status;
                        return (
                            <button
                                key={col.status}
                                onClick={() => setActiveTab(col.status)}
                                className={cn(
                                    "relative px-5 py-3 rounded-2xl text-sm font-bold transition-all border outline-none flex-shrink-0 flex items-center justify-center gap-2.5 md:w-full",
                                    isActive
                                        ? cn("bg-white text-black border-white shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] scale-105 z-10")
                                        : "bg-zinc-900/80 border-white/5 text-zinc-500 hover:bg-zinc-900 hover:border-white/10"
                                )}
                            >
                                <col.icon className={cn("w-4 h-4", isActive ? "text-black" : col.color)} />
                                <span className="whitespace-nowrap">{col.label}</span>
                                <span className={cn(
                                    "px-2 py-0.5 rounded-md text-[10px] font-black border ml-auto md:ml-2",
                                    isActive ? "bg-black text-white border-black" : "bg-zinc-950 border-zinc-800 text-zinc-600"
                                )}>
                                    {orders.filter(o => o.status === col.status).length}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pb-20 px-1">
                    <AnimatePresence mode="popLayout">
                        {orders.filter(o => o.status === activeTab).map(order => (
                            <div key={order.id} className="mb-4">
                                <OrderCard
                                    order={order}
                                    onUpdate={updateStatus}
                                    currency={currency}
                                    restaurantName={restaurantName}
                                    restaurantLogo={restaurantLogo}
                                    restaurantAddress={restaurantAddress}
                                    restaurantPhone={restaurantPhone}
                                    restaurantEmail={restaurantEmail}
                                    restaurantWebsite={restaurantWebsite}
                                />
                            </div>
                        ))}
                    </AnimatePresence>
                    {orders.filter(o => o.status === activeTab).length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                            <div className="p-6 rounded-full bg-zinc-900/50 mb-4 border border-white/5">
                                {(() => {
                                    const Icon = columns.find(c => c.status === activeTab)?.icon || BellRing;
                                    return <Icon className="w-10 h-10 opacity-30" />;
                                })()}
                            </div>
                            <p className="text-sm font-medium text-zinc-600">No {activeTab} orders</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Desktop View: Kanban Board */}
            <div className="hidden xl:flex flex-1 overflow-x-auto pb-4 custom-scrollbar">
                <div className="flex gap-6 h-full min-w-[1300px] px-1">
                    {columns.map(col => (
                        <div key={col.status} className="flex-1 min-w-[320px] flex flex-col gap-4">
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center justify-between p-4 rounded-xl bg-zinc-900 border-none shadow-sm sticky top-0 z-10"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn("p-2 rounded-lg bg-zinc-800 text-white", col.color)}>
                                        <col.icon className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-semibold text-base text-zinc-100">{col.label}</h3>
                                </div>
                                <Badge variant="secondary" className="bg-zinc-950 text-white hover:bg-zinc-950">
                                    {orders.filter(o => o.status === col.status).length}
                                </Badge>
                            </motion.div>

                            <div className="space-y-4 px-1 pb-10 overflow-y-auto custom-scrollbar h-[calc(100vh-200px)]">
                                <AnimatePresence mode="popLayout">
                                    {orders
                                        .filter(o => o.status === col.status)
                                        .map(order => (
                                            <OrderCard
                                                key={order.id}
                                                order={order}
                                                onUpdate={updateStatus}
                                                currency={currency}
                                                restaurantName={restaurantName}
                                                restaurantLogo={restaurantLogo}
                                                restaurantAddress={restaurantAddress}
                                                restaurantPhone={restaurantPhone}
                                                restaurantEmail={restaurantEmail}
                                                restaurantWebsite={restaurantWebsite}
                                            />
                                        ))}
                                </AnimatePresence>
                                {orders.filter(o => o.status === col.status).length === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.5 }}
                                        className="flex flex-col items-center justify-center py-12 text-zinc-500"
                                    >
                                        <div className="p-4 rounded-full bg-zinc-900 mb-3">
                                            <UtensilsCrossed className="w-8 h-8 opacity-50" />
                                        </div>
                                        <p className="text-sm font-medium">No orders</p>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <OrderHistory open={showHistory} onOpenChange={setShowHistory} restaurantId={restaurantId} currency={currency} />
        </div>
    );
}

function OrderCard({
    order,
    onUpdate,
    currency,
    restaurantName = "Restaurant",
    restaurantLogo,
    restaurantAddress,
    restaurantPhone,
    restaurantEmail,
    restaurantWebsite
}: {
    order: Order;
    onUpdate: (id: string, status: OrderStatus) => void;
    currency: string;
    restaurantName?: string;
    restaurantLogo?: string | null;
    restaurantAddress?: string | null;
    restaurantPhone?: string | null;
    restaurantEmail?: string | null;
    restaurantWebsite?: string | null;
}) {
    const [elapsedMinutes, setElapsedMinutes] = useState(0);
    const { t } = useLanguage();

    const parseItemDetails = (notes: string | undefined | null) => {
        if (!notes) return { note: '', variants: [] };
        try {
            const parsed = JSON.parse(notes);
            if (typeof parsed === 'object' && parsed !== null) {
                return {
                    note: parsed.note || '',
                    variants: parsed.variants || []
                };
            }
        } catch (e) {
            return { note: notes, variants: [] };
        }
        return { note: notes, variants: [] };
    };

    useEffect(() => {
        const calculateElapsed = () => {
            setElapsedMinutes(Math.floor((Date.now() - new Date(order.created_at).getTime()) / 60000));
        };
        const interval = setInterval(calculateElapsed, 10000);
        calculateElapsed();
        return () => clearInterval(interval);
    }, [order.created_at]);

    const isLate = elapsedMinutes > 15;
    const tableDisplay = order.table_number || (order.tables?.number ? `${t('ordersPage.board.table')} ${order.tables.number}` : "Express");

    const handlePrint = () => {
        const existingIframe = document.getElementById('receipt-print-frame');
        if (existingIframe) existingIframe.remove();

        const iframe = document.createElement('iframe');
        iframe.id = 'receipt-print-frame';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        const total = order.total_amount || order.order_items.reduce((sum, item) => sum + (item.quantity * (item.menu_items?.price || 0)), 0);
        const dateObj = new Date(order.created_at);
        const date = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
        const time = `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;
        const currencySymbol = currency === 'QAR' ? 'QR' : currency === 'MAD' ? 'DH' : '$';

        const receiptHTML = `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Restaurant Receipt</title>
                    <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Work+Sans:wght@400;600;800;900&display=swap" rel="stylesheet">
                    <style>
                        body {
                            font-family: 'Work Sans', sans-serif;
                            margin: 0;
                            padding: 0;
                            width: 100%;
                            background: #fff;
                            color: #000;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }

                        @page { margin: 0; size: auto; }

                        .receipt-container {
                            width: 100%;
                            max-width: 100%;
                            margin: 0 auto;
                            padding: 20px 10px;
                            box-sizing: border-box;
                        }

                        /* HEADER SECTION */
                        .header {
                            text-align: center;
                            margin-bottom: 15px;
                        }
                        .logo-container img {
                            max-width: 120px;
                            height: auto;
                            display: block;
                            margin: 0 auto 10px auto;
                        }
                        .restaurant-name {
                            font-size: 24px;
                            font-weight: 900;
                            text-transform: uppercase;
                            letter-spacing: -0.5px;
                            line-height: 1.1;
                            margin-bottom: 5px;
                        }
                        .restaurant-info {
                            font-size: 11px;
                            color: #333;
                            line-height: 1.4;
                            font-weight: 500;
                            max-width: 80%;
                            margin: 0 auto;
                        }

                        /* DIVIDER */
                        .divider-thick {
                            border-top: 3px solid #000;
                            margin: 15px 0;
                        }
                        .divider-thin {
                            border-top: 1px solid #ddd;
                            margin: 10px 0;
                        }

                        /* META SECTION */
                        .meta-grid {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            margin-bottom: 15px;
                            font-size: 12px;
                            font-weight: 600;
                        }
                        .order-number {
                            font-size: 16px;
                            font-weight: 900;
                        }
                        .order-type-badge {
                            background: #000;
                            color: #fff;
                            padding: 4px 8px;
                            border-radius: 4px;
                            font-weight: 800;
                            text-transform: uppercase;
                            font-size: 11px;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }

                        /* CUSTOMER INFO */
                        .customer-section {
                            margin-bottom: 20px;
                            text-align: center;
                        }
                        .customer-name {
                            font-size: 18px;
                            font-weight: 800;
                            text-transform: uppercase;
                            border: 2px solid #000;
                            display: inline-block;
                            padding: 5px 15px;
                            border-radius: 50px; /* Pill shape */
                            background: #fff;
                        }

                        /* ITEMS TABLE */
                        .items-table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-bottom: 20px;
                        }
                        .items-table th {
                            text-align: left;
                            font-size: 10px;
                            text-transform: uppercase;
                            color: #666;
                            padding-bottom: 8px;
                            border-bottom: 1px solid #000;
                        }
                        .items-table td {
                            padding: 8px 0;
                            vertical-align: top;
                            font-size: 13px;
                            border-bottom: 1px dashed #eee;
                        }
                        .col-qty { width: 30px; font-weight: 800; text-align: center; }
                        .col-desc { padding-left: 10px; font-weight: 600; }
                        .col-price { text-align: right; font-family: 'Space Mono', monospace; font-weight: 700; }

                        .item-note {
                            display: block;
                            font-size: 10px;
                            color: #666;
                            font-style: italic;
                            margin-top: 2px;
                        }

                        /* TOTAL SECTION */
                        .total-section {
                            background: #f5f5f5;
                            padding: 15px;
                            border-radius: 8px;
                            margin-bottom: 20px;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                        .total-row {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            font-weight: 900;
                            font-size: 18px;
                        }
                        .sub-row {
                            display: flex;
                            justify-content: space-between;
                            font-size: 11px;
                            color: #666;
                            margin-bottom: 5px;
                        }

                        /* QR CODE AREA */
                        .qr-section {
                            text-align: center;
                            margin-bottom: 20px;
                        }
                        .qr-code {
                            width: 80px;
                            height: 80px;
                            margin: 0 auto 10px auto;
                        }

                        /* FOOTER */
                        .footer {
                            text-align: center;
                            margin-top: 30px;
                        }
                        .thank-you {
                            font-family: 'Space Mono', monospace;
                            font-weight: 700;
                            font-size: 14px;
                            text-transform: uppercase;
                            margin-bottom: 5px;
                        }
                        .footer-msg {
                            font-size: 10px;
                            color: #666;
                            max-width: 80%;
                            margin: 0 auto 20px auto;
                        }
                        .powered-by {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 9px;
                            font-weight: 700;
                            text-transform: uppercase;
                            opacity: 0.6;
                            gap: 5px;
                        }
                        .brand-dot {
                            width: 4px;
                            height: 4px;
                            background: #000;
                            border-radius: 50%;
                        }
                    </style>
                </head>
                <body>
                    <div class="receipt-container">

                        <!-- HEADER -->
                        <div class="header">
                            <div class="logo-container">
                                ${restaurantLogo ? `<img src="${restaurantLogo}" alt="Logo" />` : ''}
                            </div>
                            <div class="restaurant-name">${restaurantName}</div>
                            ${restaurantAddress || restaurantPhone ? `
                                <div class="restaurant-info">
                                    ${restaurantAddress ? `${restaurantAddress}<br/>` : ''}
                                    ${restaurantPhone ? `Tel: ${restaurantPhone}` : ''}
                                </div>
                            ` : ''}
                        </div>

                        <div class="divider-thick"></div>

                        <!-- META INFO -->
                        <div class="meta-grid">
                            <div>
                                <div class="order-number">#${order.id.slice(0, 4)}</div>
                                <div style="font-weight: 400; color: #555; font-size: 10px;">${date} • ${time}</div>
                            </div>
                            <div class="order-type-badge">${(order.order_type || 'DINE IN').replace('_', ' ')}</div>
                        </div>

                        <!-- CUSTOMER NAME PILL -->
                        ${order.customer_phone ? `
                            <div class="customer-section">
                                <div class="customer-name">${order.customer_phone}</div>
                            </div>
                        ` : ''}

                        <!-- ITEMS -->
                        <table class="items-table">
                            <thead>
                                <tr>
                                    <th class="col-qty">#</th>
                                    <th class="col-desc">ITEM</th>
                                    <th class="col-price">PRICE</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${order.order_items.map(item => {
            const { note, variants } = parseItemDetails(item.notes);

            // Construct Variants HTML
            const variantsHtml = variants.length > 0 ?
                `<div style="font-size: 9px; margin-top: 2px; color: #444;">${variants.map((v: any) =>
                    `<span style="display:inline-block; background:#eee; padding: 1px 4px; border-radius: 3px; margin-right: 2px;">
                                                ${v.groupName ? `<span style="color:#666; margin-right:2px">${v.groupName}:</span>` : '+ '}
                                                ${v.name}
                                            </span>`
                ).join('')}</div>` : '';

            // Construct Note HTML
            const noteHtml = note ?
                `<div class="item-note" style="margin-top:2px;">Note: ${note}</div>` : '';

            return `
                                        <tr>
                                            <td class="col-qty">${item.quantity}</td>
                                            <td class="col-desc">
                                                <div style="font-weight:700;">${item.menu_items?.name || 'Unknown Item'}</div>
                                                ${variantsHtml}
                                                ${noteHtml}
                                            </td>
                                            <td class="col-price">${(item.price_at_time || item.menu_items?.price || 0).toFixed(2)}</td>
                                        </tr>
                                    `;
        }).join('')}
                            </tbody>
                        </table>

                        <!-- TOTAL -->
                        <div class="total-section">
                            <div class="sub-row">
                                <span>Subtotal</span>
                                <span>${currencySymbol} ${(total).toFixed(2)}</span>
                            </div>
                            <div class="divider-thin"></div>
                            <div class="total-row">
                                <span>TOTAL</span>
                                <span>${currencySymbol} ${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <!-- QR CODE (Dynamic) -->
                        ${restaurantWebsite ? `
                            <div class="qr-section">
                                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(restaurantWebsite)}" class="qr-code" alt="QR Code"/>
                                <div style="font-size: 9px; font-weight: 600;">SCAN TO VISIT US</div>
                            </div>
                        ` : ''}

                        <!-- FOOTER -->
                        <div class="footer">
                            <div class="thank-you">Thank You!</div>
                            <div class="footer-msg">We hope to serve you again soon.</div>

                            <div class="powered-by" style="display: flex; align-items: center; justify-content: center; opacity: 0.6;">
                                <span style="font-weight: 800; letter-spacing: 0.5px; margin-right: 4px;">POWERED BY</span>
                                <img src="${window.location.origin}/logo.png" style="height: 12px; filter: brightness(0);" alt="R+" />
                                <span style="font-weight: 800; letter-spacing: 0.5px; margin-left: 4px;">RESTAU PLUS</span>
                            </div>
                        </div>

                    </div>
                    <script>
                        window.onload = function() { window.print(); window.close(); }
                    </script>
                </body>
            </html>
        `;

        if (iframe.contentWindow) {
            iframe.contentWindow.document.open();
            iframe.contentWindow.document.write(receiptHTML);
            iframe.contentWindow.document.close();
            setTimeout(() => {
                if (iframe.contentWindow) {
                    iframe.contentWindow.focus();
                    iframe.contentWindow.print();
                }
            }, 500);
        }
    };

    const handlePrintKitchen = () => {
        const existingIframe = document.getElementById('kitchen-print-frame');
        if (existingIframe) existingIframe.remove();

        const iframe = document.createElement('iframe');
        iframe.id = 'kitchen-print-frame';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        const dateObj = new Date(order.created_at);
        const time = `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;

        const receiptHTML = `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Kitchen Ticket</title>
                    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700;800&display=swap" rel="stylesheet">
                    <style>
                        body {
                            font-family: 'JetBrains Mono', monospace;
                            margin: 0;
                            padding: 0;
                            width: 100%;
                            background: #fff;
                            color: #000;
                        }
                        @page { margin: 0; size: auto; }
                        .ticket-container {
                            width: 100%;
                            padding: 10px 15px;
                            box-sizing: border-box;
                        }
                        .header-box {
                            text-align: center;
                            border: 4px solid #000;
                            padding: 15px;
                            margin-bottom: 20px;
                            border-radius: 12px;
                            position: relative;
                        }
                        .order-type {
                            font-size: 28px;
                            font-weight: 800;
                            text-transform: uppercase;
                            background: #000;
                            color: #fff;
                            padding: 8px 16px;
                            border-radius: 6px;
                            display: inline-block;
                            margin-bottom: 12px;
                            letter-spacing: 2px;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                        .time-stamp {
                            font-size: 18px; 
                            font-weight: 700; 
                            text-align: center;
                            margin-bottom: 15px;
                        }
                        .meta-info {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            border-top: 3px dashed #000;
                            padding-top: 15px;
                            margin-top: 10px;
                        }
                        .order-id { font-size: 28px; font-weight: 800; }
                        .table-num-wrap {
                            display: flex;
                            align-items: center;
                            gap: 8px;
                        }
                        .table-label { font-size: 16px; text-transform: uppercase; font-weight: 800;}
                        .table-num { 
                            font-size: 32px; 
                            font-weight: 800;
                            background: #000;
                            color: #fff;
                            padding: 4px 12px;
                            border-radius: 8px;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                        
                        .items-list { width: 100%; margin-bottom: 20px; border-top: 4px solid #000; padding-top: 15px; }
                        .item-row {
                            display: flex;
                            align-items: flex-start;
                            margin-bottom: 15px;
                            padding-bottom: 15px;
                            border-bottom: 3px dashed #bbb;
                        }
                        .item-qty {
                            font-size: 32px;
                            font-weight: 800;
                            min-width: 60px;
                            text-align: left;
                        }
                        .item-qty-x { font-size: 20px; color: #555; }
                        .item-details { flex: 1; }
                        .item-name {
                            font-size: 26px;
                            font-weight: 800;
                            line-height: 1.2;
                            text-transform: uppercase;
                            margin-bottom: 8px;
                        }
                        .item-variants {
                            font-size: 18px;
                            margin-top: 4px;
                        }
                        .variant-tag {
                            display: inline-flex;
                            align-items: center;
                            border: 3px solid #000;
                            padding: 4px 8px;
                            border-radius: 6px;
                            margin-right: 6px;
                            margin-bottom: 6px;
                            font-weight: 700;
                            background: #f8f8f8;
                        }
                        .item-note-box {
                            margin-top: 10px;
                            padding: 10px 14px;
                            border: 3px solid #000;
                            border-left: 10px solid #000;
                            font-size: 20px;
                            font-weight: 800;
                            background-color: #fff;
                            display: inline-block;
                            width: 100%;
                            box-sizing: border-box;
                        }
                        .order-note-box {
                            margin-top: 30px;
                            margin-bottom: 20px;
                            padding: 20px;
                            border: 5px solid #000;
                            border-radius: 12px;
                            background: #f9f9f9;
                            position: relative;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                        .order-note-title {
                            position: absolute;
                            top: -14px;
                            left: 20px;
                            background: #fff;
                            padding: 0 10px;
                            font-size: 16px;
                            font-weight: 800;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                        }
                        .order-note-content {
                            font-size: 26px;
                            font-weight: 800;
                            margin-top: 5px;
                            line-height: 1.4;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 30px;
                            padding-top: 20px;
                            border-top: 4px solid #000;
                            font-weight: 800;
                        }
                        .cut-line {
                            border-top: 3px dashed #000;
                            margin: 40px 0;
                            text-align: center;
                            position: relative;
                        }
                        .cut-line::after {
                            content: "✂ CUT HERE ✂";
                            position: absolute;
                            top: -10px;
                            left: 50%;
                            transform: translateX(-50%);
                            background: #fff;
                            padding: 0 15px;
                            font-size: 14px;
                            color: #000;
                            font-weight: 800;
                        }
                        .branding {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            gap: 6px;
                            font-size: 14px;
                            margin-top: 20px;
                            margin-bottom: 20px;
                        }
                        .branding-logo {
                            font-size: 22px;
                            font-weight: 800;
                            letter-spacing: 3px;
                            background: #000;
                            color: #fff;
                            padding: 6px 14px;
                            border-radius: 6px;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                    </style>
                </head>
                <body>
                    <div class="ticket-container">
                        <div class="header-box">
                            <div class="order-type">${(order.order_type || 'DINE IN').replace('_', ' ')}</div>
                            <div class="time-stamp">TIME: ${time}</div>
                            <div class="meta-info">
                                <span class="order-id">#${order.id.slice(0, 4)}</span>
                                ${order.order_type !== 'takeaway' ? `
                                <div class="table-num-wrap">
                                    <span class="table-label">Table</span>
                                    <span class="table-num">${tableDisplay}</span>
                                </div>` : ''}
                            </div>
                        </div>

                        <div class="items-list">
                            ${order.order_items.map(item => {
            const { note, variants } = parseItemDetails(item.notes);
            const variantsHtml = variants.length > 0 ?
                `<div class="item-variants">${variants.map((v: any) =>
                    `<span class="variant-tag">${v.groupName ? `${v.groupName}: ` : '+ '}${v.name}</span>`
                ).join('')}</div>` : '';

            const noteHtml = note ?
                `<div class="item-note-box">⚠ ATTN: ${note}</div>` : '';

            return `
                                    <div class="item-row">
                                        <div class="item-qty">${item.quantity}<span class="item-qty-x">x</span></div>
                                        <div class="item-details">
                                            <div class="item-name">${item.menu_items?.name || 'Unknown Item'}</div>
                                            ${variantsHtml}
                                            ${noteHtml}
                                        </div>
                                    </div>
                                `;
        }).join('')}
                        </div>

                        ${order.notes ? `
                            <div class="order-note-box">
                                <div class="order-note-title">⚡ INSTRUCTIONS ⚡</div>
                                <div class="order-note-content">${order.notes}</div>
                            </div>
                        ` : ''}

                        <div class="cut-line"></div>

                        <div class="footer">
                            <div class="branding">
                                <div>POWERED BY</div>
                                <div class="branding-logo">RESTAU PLUS</div>
                            </div>
                        </div>
                    </div>
                    <script>
                        window.onload = function() { window.print(); window.close(); }
                    </script>
                </body>
            </html>
        `;

        if (iframe.contentWindow) {
            iframe.contentWindow.document.open();
            iframe.contentWindow.document.write(receiptHTML);
            iframe.contentWindow.document.close();
            setTimeout(() => {
                if (iframe.contentWindow) {
                    iframe.contentWindow.focus();
                    iframe.contentWindow.print();
                }
            }, 500);
        }
    };

    return (
        <motion.div
            layoutId={order.id}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="group"
        >
            <Card className="border-none bg-zinc-900 hover:bg-zinc-800 transition-colors shadow-sm rounded-xl overflow-hidden">
                <CardHeader className="p-4 flex flex-row justify-between items-start space-y-0">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className={cn(
                                "text-[10px] uppercase tracking-wider font-bold border rounded-md px-1.5 py-0.5",
                                order.order_type === 'takeaway'
                                    ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                    : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                            )}>
                                {order.order_type === 'takeaway' ? t('ordersPage.board.takeaway') : 'Dine In'}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-teal-400">#{order.id.slice(0, 4)}</span>
                            <span className="text-xs text-zinc-500">•</span>
                            <span className="text-sm font-semibold text-white">{tableDisplay}</span>
                        </div>
                        {order.customer_phone && (
                            <p className="text-sm text-zinc-300 font-medium">{order.customer_phone}</p>
                        )}
                        <div className={cn("flex items-center gap-1.5 text-xs font-medium pt-1", isLate ? "text-red-400" : "text-zinc-500")}>
                            <Clock className="w-3.5 h-3.5" />
                            {elapsedMinutes} {t('ordersPage.metrics.min')}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2 justify-end">
                            <Button size="icon" variant="outline" onClick={handlePrintKitchen} className="h-8 w-8 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20 text-amber-500" title="Print Kitchen Ticket">
                                <ChefHat className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="outline" onClick={handlePrint} className="h-8 w-8 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-400" title="Print Bill">
                                <Printer className="w-4 h-4" />
                            </Button>
                        </div>
                        {order.status === 'pending' && <Button size="sm" onClick={() => onUpdate(order.id, 'preparing')} className="h-8 bg-teal-600 hover:bg-teal-500 text-white font-medium rounded-lg shadow-sm text-xs w-full">{t('ordersPage.board.actions.markPreparing')}</Button>}
                        {order.status === 'preparing' && <Button size="sm" onClick={() => onUpdate(order.id, 'ready')} className="h-8 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded-lg shadow-sm text-xs w-full">{t('ordersPage.board.actions.markReady')}</Button>}
                        {order.status === 'ready' && <Button size="sm" onClick={() => onUpdate(order.id, 'served')} className="h-8 bg-green-600 hover:bg-green-500 text-white font-medium rounded-lg shadow-sm text-xs w-full">{t('ordersPage.board.actions.markServed')}</Button>}
                        {order.status === 'served' && <Button size="sm" onClick={() => onUpdate(order.id, 'paid')} className="h-8 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow-sm text-xs w-full"><DollarSign className="w-3 h-3 me-1" />{t('ordersPage.board.actions.markPaid')}</Button>}
                    </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                    <div className="h-px bg-zinc-800 w-full" />
                    <div className="space-y-3">
                        {order.order_items.map(item => {
                            const { note, variants } = parseItemDetails(item.notes);
                            return (
                                <div key={item.id} className="border-b border-zinc-800/50 pb-2 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-start text-sm">
                                        <span className="text-zinc-200 font-medium">
                                            <span className="font-bold text-primary me-2">{item.quantity}x</span>
                                            {item.menu_items?.name || t('ordersPage.board.item')}
                                        </span>
                                    </div>
                                    {variants.length > 0 && (
                                        <div className="pl-6 mt-1 flex flex-wrap gap-1">
                                            {variants.map((v: any, idx: number) => (
                                                <Badge key={idx} variant="secondary" className="text-[10px] h-auto py-0.5 px-1.5 bg-zinc-800/80 text-zinc-400 border-zinc-700/50">
                                                    {v.groupName ? <span className="text-zinc-500 mr-1">{v.groupName}:</span> : '+ '}{v.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                    {note && (
                                        <div className="pl-6 mt-1.5">
                                            <p className="text-xs text-amber-500/90 italic flex items-start gap-1.5 bg-amber-500/5 p-1.5 rounded-md border border-amber-500/10">
                                                <span className="mt-0.5">📝</span>{note}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    {order.notes && (
                        <div className="pt-2">
                            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1 opacity-70">{t('ordersPage.board.note')}</h4>
                                <p className="text-xs text-blue-300 font-medium leading-relaxed">{order.notes}</p>
                            </div>
                        </div>
                    )}
                </CardContent>
                <div className="bg-zinc-950/30 p-4 border-t border-white/5">
                    <div className="grid grid-cols-5 text-center gap-2">
                        <TimelineStatus label={t('ordersPage.board.columns.new')} time={order.created_at} color="text-zinc-400" />
                        <TimelineStatus label={t('ordersPage.board.columns.preparing')} time={order.preparing_at} color="text-orange-500" />
                        <TimelineStatus label={t('ordersPage.board.columns.ready')} time={order.ready_at} color="text-emerald-500" />
                        <TimelineStatus label={t('ordersPage.board.columns.served')} time={order.served_at} color="text-indigo-400" />
                        <TimelineStatus label={t('ordersPage.board.actions.markPaid')} time={order.paid_at} color="text-emerald-500" />
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}

function TimelineStatus({ label, time, color }: { label: string, time?: string, color: string }) {
    if (!time) {
        return (
            <div className="flex flex-col gap-1 opacity-20">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{label}</span>
                <span className="text-[10px] font-mono text-zinc-600">--:--:--</span>
            </div>
        );
    }
    return (
        <div className="flex flex-col gap-1">
            <span className={cn("text-[10px] font-bold uppercase tracking-widest", color)}>{label}</span>
            <span className="text-[10px] font-mono text-zinc-300">
                {new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
        </div>
    );
}
