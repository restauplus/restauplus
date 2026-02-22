"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ArrowUpRight, Search, Filter, Download, User, ShoppingBag, Banknote, RefreshCcw, Clock, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function ClientsPage() {
    const [clients, setClients] = useState<any[]>([]);
    const [allOrders, setAllOrders] = useState<any[]>([]);
    const [selectedClientPhone, setSelectedClientPhone] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [currency, setCurrency] = useState("DH"); // Default fallback
    const [avgPrepTime, setAvgPrepTime] = useState(0);
    const supabase = createClient();

    const fetchClients = async () => {
        setLoading(true);
        // Fetch all orders with customer details
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get restaurant ID and Currency
        const { data: profile } = await supabase.from('profiles').select('restaurant_id').eq('id', user.id).single();
        if (!profile?.restaurant_id) return;

        // Fetch currency setting
        const { data: restaurant } = await supabase
            .from('restaurants')
            .select('currency')
            .eq('id', profile.restaurant_id)
            .single();

        if (restaurant?.currency) {
            setCurrency(restaurant.currency);
        }

        const { data: orders, error } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (
                    quantity,
                    notes,
                    price_at_time,
                    menu_items ( name, price )
                )
            `)
            .eq('restaurant_id', profile.restaurant_id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error(error);
            setLoading(false);
            return;
        }

        // Aggregate by Customer Phone
        const clientMap = new Map();

        orders?.forEach(order => {
            const phone = order.customer_phone;

            // Only include orders that have a valid phone number
            if (!phone || phone.trim() === "" || phone === "Unknown Guest") {
                return;
            }

            // Normalizing phone key
            const key = phone.toLowerCase().trim();

            if (!clientMap.has(key)) {
                clientMap.set(key, {
                    id: key, // temporary ID
                    phone: phone,
                    totalOrders: 0,
                    totalSpent: 0,
                    lastVisit: order.created_at,
                    firstVisit: order.created_at
                });
            }

            const client = clientMap.get(key);
            client.totalOrders += 1;
            client.totalSpent += order.total_amount || 0;
            // Update last visit if more recent (though we ordered by desc)
            if (new Date(order.created_at) > new Date(client.lastVisit)) {
                client.lastVisit = order.created_at;
            }
            if (new Date(order.created_at) < new Date(client.firstVisit)) {
                client.firstVisit = order.created_at;
            }
        });

        // Calculate Average Prep Time (Created -> Served/Paid)
        let totalDurationMinutes = 0;
        let servedOrdersCount = 0;

        orders?.forEach(order => {
            if (['served', 'paid', 'completed'].includes(order.status)) {
                const created = new Date(order.created_at);
                const updated = new Date(order.updated_at);
                const diffMs = updated.getTime() - created.getTime();
                const diffMins = diffMs / (1000 * 60);

                // Sanity check: ignore if > 24 hours (data anomalies), allow short tests (> 0)
                if (diffMins > 0 && diffMins < 1440) {
                    totalDurationMinutes += diffMins;
                    servedOrdersCount++;
                }
            }
        });

        const avgPrep = servedOrdersCount > 0 ? Math.ceil(totalDurationMinutes / servedOrdersCount) : 0;
        setAvgPrepTime(avgPrep);

        setAllOrders(orders || []);
        setClients(Array.from(clientMap.values()));
        setLoading(false);
    };

    // Helper to parse notes for the timeline
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
        fetchClients();
    }, []);

    // Filter
    const filteredClients = clients.filter(client =>
        client.phone.includes(searchQuery.toLowerCase())
    );

    // Stats
    const totalClients = clients.length;
    const totalRevenue = clients.reduce((acc, c) => acc + c.totalSpent, 0);
    const totalOrders = clients.reduce((acc, c) => acc + c.totalOrders, 0);
    const avgBasket = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : "0.00";

    return (
        <div className="p-8 space-y-8 bg-black min-h-screen text-white relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-teal-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-white mb-2">
                        Clients <span className="text-teal-500">Management</span>
                    </h1>
                    <p className="text-zinc-500 font-medium">Analyze behavior and reward your top loyal customers</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-500 text-xs font-bold border border-teal-500/20 animate-pulse">
                        LIVE DATA
                    </span>
                </div>
            </div>

            {/* Stats Cards - Pro Design */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                {/* Total Clients */}
                <div className="relative overflow-hidden bg-zinc-900/40 border border-white/5 p-6 rounded-3xl group hover:border-teal-500/50 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Total Clients</p>
                            <h3 className="text-4xl font-black text-white">{totalClients}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-800 to-black border border-white/10 flex items-center justify-center text-teal-500 shadow-lg group-hover:scale-110 transition-transform duration-500">
                            <User className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-emerald-500 text-xs font-bold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <ArrowUpRight className="w-3 h-3" /> +12%
                        </span>
                        <span className="text-zinc-600 text-xs">vs last month</span>
                    </div>
                </div>

                {/* Avg Basket */}
                <div className="relative overflow-hidden bg-zinc-900/40 border border-white/5 p-6 rounded-3xl group hover:border-emerald-500/50 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Avg Basket</p>
                            <h3 className="text-4xl font-black text-white">{avgBasket} <span className="text-xl text-zinc-500 font-medium">{currency}</span></h3>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-800 to-black border border-white/10 flex items-center justify-center text-emerald-500 shadow-lg group-hover:scale-110 transition-transform duration-500">
                            <Banknote className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-4 w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 w-[65%]" />
                    </div>
                </div>

                {/* Total Orders */}
                <div className="relative overflow-hidden bg-zinc-900/40 border border-white/5 p-6 rounded-3xl group hover:border-zinc-500/50 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Total Orders</p>
                            <h3 className="text-4xl font-black text-white">{totalOrders}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-800 to-black border border-white/10 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                    </div>
                    <p className="mt-4 text-xs text-zinc-500 font-medium">
                        Lifetime value across all customers
                    </p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="relative z-10 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-900/40 backdrop-blur-md p-2 pl-4 rounded-2xl border border-white/5">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-teal-500 transition-colors" />
                    <Input
                        placeholder="Search clients..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none focus:ring-0 pl-10 h-10 text-sm placeholder:text-zinc-600"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto p-1">
                    <Button variant="ghost" onClick={fetchClients} className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl">
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                    <Button className="bg-white text-black hover:bg-zinc-200 font-bold rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="relative z-10 bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-black/40 text-zinc-500 text-[10px] font-bold uppercase tracking-widest border-b border-white/5">
                            <tr>
                                <th className="p-6">Client Details</th>
                                <th className="p-6 text-center">Orders</th>
                                <th className="p-6 text-right">Lifetime Spend</th>
                                <th className="p-6 text-right">Last Visit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredClients.length > 0 ? (
                                filteredClients.map((client) => {
                                    const isVip = client.totalSpent > 500; // Mock VIP logic
                                    return (
                                        <tr key={client.id} onClick={() => setSelectedClientPhone(client.phone)} className="group hover:bg-white/[0.05] transition-colors duration-300 cursor-pointer">
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg relative overflow-hidden ${isVip ? 'bg-gradient-to-br from-amber-400 to-yellow-600' : 'bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/5'}`}>
                                                        {isVip && <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />}
                                                        <span className="relative z-10">P</span>
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-lg text-white group-hover:text-teal-500 transition-colors">{client.phone}</span>
                                                            {isVip && <span className="px-1.5 py-0.5 rounded bg-amber-500 text-[9px] font-black text-black uppercase tracking-wider">VIP</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6 text-center">
                                                <div className="inline-flex flex-col items-center">
                                                    <span className="text-xl font-bold text-white">{client.totalOrders}</span>
                                                    <span className="text-[9px] text-zinc-600 uppercase font-bold tracking-wider">Orders</span>
                                                </div>
                                            </td>
                                            <td className="p-6 text-right">
                                                <div className="inline-flex flex-col items-end">
                                                    <span className="text-xl font-black font-mono text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">
                                                        {client.totalSpent.toFixed(2)} {currency}
                                                    </span>
                                                    <span className="text-[9px] text-zinc-600 uppercase font-bold tracking-wider">Total Value</span>
                                                </div>
                                            </td>
                                            <td className="p-6 text-right">
                                                <span className="text-zinc-400 font-medium block">{new Date(client.lastVisit).toLocaleDateString()}</span>
                                                <span className="text-zinc-600 text-xs">{new Date(client.lastVisit).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={4} className="py-32 text-center">
                                        <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-700 border border-zinc-800">
                                            <Search className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-zinc-400 font-bold text-xl mb-2">No clients found</h3>
                                        <p className="text-zinc-600">Try adjusting your filters to see results</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500 bg-black/20">
                    <span className="font-medium">Showing {filteredClients.length} VIP Results</span>
                    <div className="flex gap-2">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-900 border border-white/10 hover:border-white/20 hover:bg-zinc-800 transition-all disabled:opacity-50" disabled>«</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-teal-600 text-white font-bold shadow-[0_0_15px_rgba(13,148,136,0.4)]">1</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-900 border border-white/10 hover:border-white/20 hover:bg-zinc-800 transition-all" disabled>»</button>
                    </div>
                </div>
            </div>
            {/* Orders Modal for Selected Client */}
            <Dialog open={!!selectedClientPhone} onOpenChange={(open) => { if (!open) setSelectedClientPhone(null); }}>
                <DialogContent className="max-w-4xl bg-zinc-950 border-zinc-900 text-white max-h-[85vh] flex flex-col p-0 gap-0">
                    <DialogHeader className="p-6 pb-2 border-b border-white/5 bg-zinc-900/50 backdrop-blur-xl sticky top-0 z-10">
                        <div className="flex flex-col gap-1">
                            <DialogTitle className="text-2xl font-black flex items-center gap-3">
                                <User className="text-teal-500 w-6 h-6" />
                                Client History: <span className="text-teal-400">{selectedClientPhone}</span>
                            </DialogTitle>
                            <p className="text-zinc-500 text-sm">All past orders from this phone number</p>
                        </div>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                        <div className="grid gap-4">
                            {allOrders.filter(o => o.customer_phone?.toLowerCase().trim() === selectedClientPhone?.toLowerCase().trim()).map(order => (
                                <Card key={order.id} className="bg-zinc-900/40 backdrop-blur-md border border-white/5 hover:border-teal-500/30 transition-all duration-300 overflow-hidden group">
                                    <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

                                        {/* Left Area: Meta */}
                                        <div className="flex flex-col gap-3 min-w-[200px]">
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline" className="border-teal-500/30 text-teal-400 bg-teal-500/10 font-mono">
                                                    #{order.id.slice(0, 8)}
                                                </Badge>
                                                <Badge className={cn("border-0 font-bold", ['paid', 'completed'].includes(order.status) ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400')}>
                                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                                    {order.status.toUpperCase()}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-zinc-400 font-medium flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-teal-500" />
                                                        {new Date(order.created_at).toLocaleString(undefined, {
                                                            weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Area: Action & Price */}
                                        <div className="flex flex-col items-end justify-center">
                                            <span className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-1">Total Paid</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xl font-normal text-teal-500">{currency}</span>
                                                <span className="text-3xl font-black text-white tracking-tight">{Number(order.total_amount).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-black/20 px-5 py-4 border-t border-white/5">
                                        <span className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-2 block">Order Items</span>
                                        <div className="text-sm text-zinc-300 font-medium leading-relaxed divide-y divide-white/5">
                                            {order.order_items?.map((i: any) => {
                                                // Assuming notes are stored correctly or fallback if they are complex json
                                                // If order_items isn't populated with menu_items in the history view fetch, we might just show basic info
                                                return (
                                                    <div key={i.id} className="flex items-center justify-between py-2">
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-black text-teal-400 bg-teal-500/10 rounded px-2 py-0.5">{i.quantity}x</span>
                                                            <span className="text-zinc-200">{i.menu_items?.name || 'Unknown Item'}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
