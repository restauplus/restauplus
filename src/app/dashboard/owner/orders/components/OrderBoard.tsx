
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, ChefHat, BellRing, UtensilsCrossed, User, Hash, DollarSign, RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";

import { OrderHistory } from "./OrderHistory";

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
    customer_name?: string | null;
    table_number?: string | null;
    notes?: string | null; // Added notes field
    order_type?: 'dine_in' | 'takeaway'; // Added order_type
    tables: { number: string } | null;
    order_items: {
        id: string;
        quantity: number;
        menu_items: { name: string } | null;
        notes?: string;
    }[];
}

export function OrderBoard({ initialOrders, restaurantId, currency }: { initialOrders: any[], restaurantId: string, currency: string }) {
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

    useEffect(() => {
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
                            .select(`*, tables(number), order_items(*, menu_items(name))`)
                            .eq('id', payload.new.id)
                            .single();

                        if (newOrder) {
                            setOrders(prev => [newOrder, ...prev]);
                            const tableInfo = newOrder.table_number || (newOrder.tables?.number ? `Table ${newOrder.tables.number}` : "Express");

                            // Play notification sound
                            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                            audio.play().catch(e => console.log("Audio play blocked:", e));

                            toast.success("New Order Received!", {
                                description: `${tableInfo} - ${newOrder.customer_name || 'Guest'}`,
                                className: "glass-card border-primary/50"
                            });
                        }
                    } else if (payload.eventType === 'UPDATE') {
                        setOrders(prev => prev.map(o => o.id === payload.new.id ? { ...o, ...payload.new } : o));
                    }
                }
            )
            .subscribe();

        return () => {
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
            // Only log as error if it's NOT a missing column issue (which we handle via retry)
            // PGRST204 = missing column
            const isMissingColumn = error.code === 'PGRST204' || error.message?.includes('Could not find the');

            if (!isMissingColumn) {
                console.error("Update with timestamp failed:", JSON.stringify(error));
            }

            // Fallback: Try updating STATUS ONLY (if columns are missing or type mismatch)
            if (timestampField) {
                const { error: retryError } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);

                if (!retryError) {
                    toast.success(`Order moved to ${newStatus}`, {
                        className: "glass-card",
                        description: "Dashboard updated. (Timestamps skipped)"
                    });
                    return; // Success on retry
                } else {
                    console.error("Retry failed:", JSON.stringify(retryError));
                }
            }

            toast.error(`Update failed: ${error.message || 'Unknown error'}`);
            // Revert optimistic update on error
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: o.status } : o));
        } else {
            toast.success(`Order moved to ${newStatus}`, {
                className: "glass-card"
            });
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
                        menu_items ( name )
                    )
                `)
                .eq('restaurant_id', restaurantId)
                .neq('status', 'paid')
                .neq('status', 'cancelled')
                .order('created_at', { ascending: true });

            if (error) throw error;

            if (refreshedOrders) {
                // @ts-ignore - Supabase types might be slightly mismatched with our Order interface but structure matches
                setOrders(refreshedOrders);
                toast.success("Orders refreshed", {
                    description: "Latest orders fetched successfully",
                    className: "glass-card"
                });
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
            <div className="flex justify-end px-6 pb-2 gap-2">
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

            {/* Mobile/Tablet View: Tabs + Active List */}
            <div className="xl:hidden flex flex-col h-full px-4">
                {/* Tabs */}
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

                {/* Mobile Active Column Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pb-20 px-1">
                    <AnimatePresence mode="popLayout">
                        {orders.filter(o => o.status === activeTab).map(order => (
                            <div key={order.id} className="mb-4">
                                <OrderCard order={order} onUpdate={updateStatus} />
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
                            {/* Column Header */}
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
                                            <OrderCard key={order.id} order={order} onUpdate={updateStatus} />
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

function OrderCard({ order, onUpdate }: { order: Order; onUpdate: (id: string, status: OrderStatus) => void }) {
    const [elapsedMinutes, setElapsedMinutes] = useState(0);
    const { t } = useLanguage();

    useEffect(() => {
        const interval = setInterval(() => {
            setElapsedMinutes(Math.floor((Date.now() - new Date(order.created_at).getTime()) / 60000));
        }, 10000);
        setElapsedMinutes(Math.floor((Date.now() - new Date(order.created_at).getTime()) / 60000));
        return () => clearInterval(interval);
    }, [order.created_at]);

    const isLate = elapsedMinutes > 15;
    const tableDisplay = order.table_number || (order.tables?.number ? `${t('ordersPage.board.table')} ${order.tables.number}` : "Express");

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
                            {/* Order Type Badge */}
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
                        {order.customer_name && (
                            <p className="text-sm text-zinc-300 font-medium">
                                {order.customer_name}
                            </p>
                        )}
                        <div className={cn(
                            "flex items-center gap-1.5 text-xs font-medium pt-1",
                            isLate ? "text-red-400" : "text-zinc-500"
                        )}>
                            <Clock className="w-3.5 h-3.5" />
                            {elapsedMinutes} {t('ordersPage.metrics.min')}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                        {order.status === 'pending' && (
                            <Button
                                size="sm"
                                onClick={() => onUpdate(order.id, 'preparing')}
                                className="h-8 bg-teal-600 hover:bg-teal-500 text-white font-medium rounded-lg shadow-sm text-xs"
                            >
                                {t('ordersPage.board.actions.markPreparing')}
                            </Button>
                        )}
                        {order.status === 'preparing' && (
                            <Button
                                size="sm"
                                onClick={() => onUpdate(order.id, 'ready')}
                                className="h-8 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded-lg shadow-sm text-xs"
                            >
                                {t('ordersPage.board.actions.markReady')}
                            </Button>
                        )}
                        {order.status === 'ready' && (
                            <Button
                                size="sm"
                                onClick={() => onUpdate(order.id, 'served')}
                                className="h-8 bg-green-600 hover:bg-green-500 text-white font-medium rounded-lg shadow-sm text-xs"
                            >
                                {t('ordersPage.board.actions.markServed')}
                            </Button>
                        )}
                        {order.status === 'served' && (
                            <Button
                                size="sm"
                                onClick={() => onUpdate(order.id, 'paid')}
                                className="h-8 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow-sm text-xs w-full"
                            >
                                <DollarSign className="w-3 h-3 me-1" />
                                {t('ordersPage.board.actions.markPaid')}
                            </Button>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="p-4 pt-0 space-y-3">
                    <div className="h-px bg-zinc-800 w-full" />
                    <div className="space-y-2">
                        {order.order_items.map(item => (
                            <div key={item.id} className="flex justify-between items-center text-sm">
                                <span className="text-zinc-300">
                                    <span className="font-semibold text-white me-2">{item.quantity}x</span>
                                    {item.menu_items?.name || t('ordersPage.board.item') + '?'}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Order Notes (Instructions) */}
                    {order.notes && (
                        <div className="pt-2">
                            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                <p className="text-xs text-blue-400 font-medium flex items-start gap-2">
                                    <span className="mt-0.5">📝</span>
                                    <span className="font-bold">{t('ordersPage.board.note')}:</span> {order.notes}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Item Notes */}
                    {order.order_items.some(i => i.notes) && (
                        <div className="pt-2">
                            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                <p className="text-xs text-amber-400 font-medium flex items-start gap-2">
                                    <span className="mt-0.5">⚠️</span>
                                    {order.order_items.map(i => i.notes).filter(Boolean).join(", ")}
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>

                {/* Timeline Details - User Request Horizontal Design */}
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
