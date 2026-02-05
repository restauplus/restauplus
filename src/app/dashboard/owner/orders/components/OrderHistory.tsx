
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, DollarSign, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function OrderHistory({ open, onOpenChange, restaurantId, currency }: { open: boolean, onOpenChange: (open: boolean) => void, restaurantId: string, currency: string }) {
    const supabase = createClient();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    const getCurrencySymbol = (code: string) => {
        if (code === 'QAR') return 'QR';
        if (code === 'MAD') return 'DH';
        return '$';
    };

    const currencySymbol = getCurrencySymbol(currency);

    useEffect(() => {
        if (open) {
            fetchHistory();
        }
    }, [open]);

    const fetchHistory = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('orders')
            .select(`
                *,
                tables ( number ),
                order_items (
                    quantity,
                    menu_items ( name )
                )
            `)
            .eq('restaurant_id', restaurantId)
            .eq('status', 'paid')
            .order('created_at', { ascending: false })
            .limit(50);

        if (data) setOrders(data);
        setLoading(false);
    };


    const filtered = orders.filter(o =>
        o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
        o.id.includes(search)
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl bg-zinc-950 border-zinc-900 text-white max-h-[85vh] flex flex-col p-0 gap-0">
                <DialogHeader className="p-6 pb-2 border-b border-zinc-900 bg-zinc-900/50 backdrop-blur-xl sticky top-0 z-10">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            <CheckCircle2 className="text-teal-500" />
                            Order History
                        </DialogTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <Input
                                placeholder="Search customer or ID..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 h-9 bg-zinc-900 border-zinc-800 focus:ring-teal-500"
                            />
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    {loading ? (
                        <div className="text-center py-20 text-zinc-500 animate-pulse">Loading history...</div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-20 text-zinc-500">No paid orders found.</div>
                    ) : (
                        <div className="grid gap-4">
                            {filtered.map(order => (
                                <Card key={order.id} className="bg-zinc-900/50 border-zinc-800 p-4 flex flex-col gap-4">
                                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <Badge variant="outline" className="border-teal-500/30 text-teal-400 bg-teal-500/5">
                                                    ID: {order.id.slice(0, 4)}
                                                </Badge>
                                                <span className="font-semibold text-lg text-zinc-200">{order.customer_name || 'Guest'}</span>
                                                <span className="text-xs text-zinc-500 flex items-center gap-1.5 ml-1 border-l border-zinc-800 pl-3">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {new Date(order.created_at).toLocaleString(undefined, {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                            <p className="text-sm text-zinc-300 font-medium leading-relaxed">
                                                {order.order_items.map((i: any) => `${i.quantity}x ${i.menu_items?.name}`).join(', ')}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl font-bold text-white flex items-center">
                                                    <span className="text-sm font-normal text-zinc-500 mr-2">{currencySymbol}</span>
                                                    {Number(order.total_amount).toFixed(2)}
                                                </span>
                                                <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-0 h-7">
                                                    PAID
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Timeline Grid */}
                                    <div className="w-full pt-4 border-t border-white/5 grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-y-4 gap-x-2 text-xs">
                                        <HistoryTimePoint label="Placed" time={order.created_at} color="text-zinc-400" />
                                        <HistoryTimePoint label="Preparing" time={order.preparing_at} color="text-orange-400" />
                                        <HistoryTimePoint label="Ready" time={order.ready_at} color="text-emerald-400" />
                                        <HistoryTimePoint label="Served" time={order.served_at} color="text-indigo-400" />
                                        <HistoryTimePoint label="Paid" time={order.paid_at} color="text-green-400" />
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

function HistoryTimePoint({ label, time, color }: { label: string, time?: string, color: string }) {
    // If we have time, show it
    if (time) {
        return (
            <div className="flex flex-col gap-1">
                <span className={cn("font-bold text-xs uppercase tracking-wider", color)}>{label}</span>
                <span className="text-zinc-300 font-mono tracking-wide text-[11px] whitespace-nowrap">
                    {new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
            </div>
        );
    }

    // If no time, but the label implies a completed state (like Paid/Served), don't hide it completely,
    // just show "--" but keep contrast if it matches the final state.
    // However, since we don't pass 'order status' here, we'll keep the dimming for consistency
    // UNLESS it's the specific target state.

    return (
        <div className="flex flex-col gap-1 opacity-40">
            <span className={cn("font-bold text-xs uppercase tracking-wider", color)}>{label}</span>
            <span className="text-zinc-500 font-mono text-[10px]">-- : -- : --</span>
        </div>
    );
}
