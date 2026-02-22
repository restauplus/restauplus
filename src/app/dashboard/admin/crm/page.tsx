"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Phone, Building2, User, DollarSign, Target, TrendingUp, Activity, Sparkles, Filter, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/auth-context";

type CRMItemType = "LEAD" | "DEAL";
type CRMItemStatus = "NEW" | "CONTACTED" | "WON" | "LOST";

interface CRMItem {
    id: string;
    type: CRMItemType;
    name: string;
    company: string;
    contact: string;
    value: string;
    status: CRMItemStatus;
    createdAt: number;
    isDeleted?: boolean;
}

function StatCard({ title, value, subtitle, icon: Icon, colorClass, glowColor }: any) {
    return (
        <div className="relative group rounded-2xl bg-zinc-900/30 border border-white/5 backdrop-blur-md overflow-hidden transition-all duration-500 hover:border-white/10">
            <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{title}</p>
                        <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
                    </div>
                    <div className={`p-4 rounded-xl bg-black/50 border border-white/5 relative`}>
                        <div className={`absolute inset-0 blur-xl ${glowColor} opacity-20`} />
                        <Icon className={`w-6 h-6 ${glowColor.replace('bg-', 'text-')}`} />
                    </div>
                </div>
                {subtitle && <p className="text-xs text-zinc-500 mt-3 font-medium flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {subtitle}</p>}
            </div>
        </div>
    );
}

export default function CRMPage() {
    const { user } = useAuth();
    const supabase = createClient();
    const [onlineUsers, setOnlineUsers] = useState<any[]>([]);

    const [items, setItems] = useState<CRMItem[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    // Form State
    const [newItemType, setNewItemType] = useState<CRMItemType>("LEAD");
    const [newName, setNewName] = useState("");
    const [newCompany, setNewCompany] = useState("");
    const [newContact, setNewContact] = useState("");
    const [newValue, setNewValue] = useState("");

    // Filter
    const [filterStatus, setFilterStatus] = useState<CRMItemStatus | "ALL">("ALL");

    // Delete Modal
    const [itemToDelete, setItemToDelete] = useState<CRMItem | null>(null);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");

    // Convert Modal
    const [itemToConvert, setItemToConvert] = useState<CRMItem | null>(null);
    const [convertValue, setConvertValue] = useState("");

    // Hard Delete Modal
    const [itemToHardDelete, setItemToHardDelete] = useState<CRMItem | null>(null);
    const [hardDeleteSecret, setHardDeleteSecret] = useState("");

    useEffect(() => {
        setIsMounted(true);
        const stored = localStorage.getItem("restau_crm_data");
        if (stored) {
            try {
                setItems(JSON.parse(stored));
            } catch (e) {
                console.error("Error loading CRM data", e);
            }
        }
    }, []);

    useEffect(() => {
        if (!user) return;

        // Fetch user profile first to get their role and name for presence
        const initPresence = async () => {
            const { data: profile } = await supabase.from('profiles').select('full_name, role').eq('id', user.id).single();
            const userName = profile?.full_name || user?.email?.split('@')[0] || 'Unknown User';

            const channel = supabase.channel('crm_presence', {
                config: {
                    presence: {
                        key: user.id,
                    },
                },
            });

            channel
                .on('presence', { event: 'sync' }, () => {
                    const state = channel.presenceState();
                    // Deduplicate active users by ID to avoid ghost presences if tabs are refreshed
                    const activeUsers = Object.values(state).flatMap((s: any) => s);
                    const uniqueUsers = activeUsers.filter((v, i, a) => a.findIndex(v2 => (v2.id === v.id)) === i);
                    setOnlineUsers(uniqueUsers);
                })
                .subscribe(async (status) => {
                    if (status === 'SUBSCRIBED') {
                        await channel.track({
                            id: user.id,
                            full_name: userName,
                            role: profile?.role || 'user',
                            online_at: new Date().toISOString()
                        });
                    }
                });

            return () => {
                supabase.removeChannel(channel);
            };
        };

        let cleanup: (() => void) | undefined;
        initPresence().then(fn => cleanup = fn);

        return () => {
            if (cleanup) cleanup();
        };
    }, [user, supabase]);

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem("restau_crm_data", JSON.stringify(items));
        }
    }, [items, isMounted]);

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim() || !newCompany.trim()) return;

        const newItem: CRMItem = {
            id: Math.random().toString(36).substring(7),
            type: newItemType,
            name: newName,
            company: newCompany,
            contact: newContact,
            value: newValue,
            status: newItemType === "DEAL" ? "WON" : "NEW",
            createdAt: Date.now(),
        };

        setItems([newItem, ...items]);
        setNewName("");
        setNewCompany("");
        setNewContact("");
        setNewValue("");
    };

    const handleAttemptDelete = (item: CRMItem) => {
        setItemToDelete(item);
        setDeleteConfirmText("");
    };

    const confirmDelete = () => {
        if (itemToDelete && deleteConfirmText === "DELETE") {
            setItems(items.map(i => i.id === itemToDelete.id ? { ...i, isDeleted: true } : i));
            setItemToDelete(null);
            setDeleteConfirmText("");
        }
    };

    const handleRestoreItem = (id: string) => {
        setItems(items.map(i => i.id === id ? { ...i, isDeleted: false } : i));
    };

    const handleUpdateStatus = (id: string, newStatus: CRMItemStatus) => {
        setItems(items.map(item => {
            if (item.id === id) {
                if (item.type === "LEAD" && newStatus === "WON") {
                    return { ...item, status: newStatus, type: "DEAL" };
                }
                return { ...item, status: newStatus };
            }
            return item;
        }));
    };

    const handleAttemptConvert = (item: CRMItem) => {
        setItemToConvert(item);
        setConvertValue(item.value || "");
    };

    const confirmConvert = (e: React.FormEvent) => {
        e.preventDefault();
        if (itemToConvert) {
            setItems(items.map(i => i.id === itemToConvert.id ? { ...i, type: "DEAL", status: "WON", value: convertValue } : i));
            setItemToConvert(null);
            setConvertValue("");
        }
    };

    const handleAttemptHardDelete = (item: CRMItem) => {
        setItemToHardDelete(item);
        setHardDeleteSecret("");
    };

    const confirmHardDelete = () => {
        if (itemToHardDelete && hardDeleteSecret === "1956") {
            setItems(items.filter(i => i.id !== itemToHardDelete.id));
            setItemToHardDelete(null);
            setHardDeleteSecret("");
        }
    };

    if (!isMounted) return null;

    const activeItems = items.filter(i => !i.isDeleted);
    const deletedHistory = items.filter(i => i.isDeleted).sort((a, b) => b.createdAt - a.createdAt);

    const leads = activeItems.filter(i => i.type === "LEAD" && (filterStatus === "ALL" || i.status === filterStatus));
    const deals = activeItems.filter(i => i.type === "DEAL" && (filterStatus === "ALL" || i.status === filterStatus));

    // KPIs
    const totalRevenue = activeItems.filter(d => d.status === 'WON').reduce((acc, d) => acc + (parseFloat(d.value) || 0), 0);
    const pipelineValue = activeItems.filter(d => ['NEW', 'CONTACTED'].includes(d.status)).reduce((acc, d) => acc + (parseFloat(d.value) || 0), 0);
    const dealClosedRate = activeItems.filter(d => d.type === "DEAL").length > 0
        ? ((activeItems.filter(d => d.type === "DEAL" && d.status === 'WON').length / activeItems.filter(d => d.type === "DEAL").length) * 100).toFixed(1)
        : "0.0";
    const leadConversionRate = activeItems.filter(l => l.type === "LEAD").length > 0
        ? ((activeItems.filter(l => l.type === "LEAD" && ['CONTACTED', 'WON'].includes(l.status)).length / activeItems.filter(l => l.type === "LEAD").length) * 100).toFixed(1)
        : "0.0";

    return (
        <div className="min-h-screen bg-[#030303] text-white p-6 md:p-10 space-y-10 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none" />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-400 gap-1.5 py-1 px-3">
                            <Sparkles className="w-3 h-3" />
                            <span>Ultra Pro Engine</span>
                        </Badge>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-white">
                        CRM <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Deals & Leads</span>
                    </h1>
                    <p className="text-zinc-500 max-w-xl text-sm leading-relaxed mt-2">
                        Advanced tracking. Powerful insights. Manage your entire sales pipeline from a single, ultra-fast interface with zero friction.
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    {/* Presence indicators */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Online Now</span>
                        <div className="flex items-center -space-x-2">
                            {onlineUsers.slice(0, 5).map(u => (
                                <div key={u.id} className="relative group" title={`${u.full_name} (${u.role})`}>
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-black flex items-center justify-center text-xs font-bold shrink-0 text-white z-10 relative hover:z-20 hover:scale-110 transition-transform">
                                        {u.full_name?.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black shadow-[0_0_8px_rgba(16,185,129,0.8)] z-30" />
                                </div>
                            ))}
                            {onlineUsers.length > 5 && (
                                <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-black flex items-center justify-center text-xs font-bold shrink-0 text-white z-10 relative">
                                    +{onlineUsers.length - 5}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-zinc-900/50 p-1 rounded-xl border border-white/5 backdrop-blur-sm">
                        {["ALL", "NEW", "CONTACTED", "WON", "LOST"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status as any)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filterStatus === status ? "bg-white text-black shadow-md" : "text-zinc-500 hover:text-white hover:bg-white/5"}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                <StatCard
                    title="Total Revenue"
                    value={`$${totalRevenue.toLocaleString()}`}
                    subtitle="Closed Won Deals"
                    icon={DollarSign}
                    colorClass="from-emerald-900/20 to-emerald-500/20"
                    glowColor="bg-emerald-500"
                />
                <StatCard
                    title="Pipeline Value"
                    value={`$${pipelineValue.toLocaleString()}`}
                    subtitle="Active Deals (New/Contacted)"
                    icon={Activity}
                    colorClass="from-blue-900/20 to-blue-500/20"
                    glowColor="bg-blue-400"
                />
                <StatCard
                    title="Deal Closed Rate"
                    value={`${dealClosedRate}%`}
                    subtitle="Percentage of Won Deals"
                    icon={Target}
                    colorClass="from-indigo-900/20 to-indigo-500/20"
                    glowColor="bg-indigo-400"
                />
                <StatCard
                    title="Leads Conversion"
                    value={`${leadConversionRate}%`}
                    subtitle="Leads Engaged or Won"
                    icon={TrendingUp}
                    colorClass="from-purple-900/20 to-purple-500/20"
                    glowColor="bg-purple-400"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                {/* Left Column: Form */}
                <div className="lg:col-span-4 xl:col-span-3">
                    <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-xl sticky top-6 overflow-hidden rounded-2xl shadow-2xl">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                        <CardHeader className="pb-4">
                            <CardTitle className="text-white text-lg">Add to Pipeline</CardTitle>
                            <CardDescription className="text-zinc-500 text-xs">Instantly create a new record.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddItem} className="space-y-4">
                                <div className="flex gap-1 p-1 bg-black/50 rounded-xl border border-white/5">
                                    <button
                                        type="button"
                                        onClick={() => setNewItemType("LEAD")}
                                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${newItemType === "LEAD" ? "bg-zinc-800 text-white shadow-md border border-white/10" : "text-zinc-500 hover:text-white"}`}
                                    >
                                        New Lead
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNewItemType("DEAL")}
                                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${newItemType === "DEAL" ? "bg-zinc-800 text-blue-400 shadow-md border border-white/10" : "text-zinc-500 hover:text-white"}`}
                                    >
                                        New Deal
                                    </button>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="w-4 h-4 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                                        </div>
                                        <input
                                            placeholder="Contact Name"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            className="w-full bg-black/40 border border-white/5 focus:border-blue-500/50 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 outline-none transition-all shadow-inner"
                                            required
                                        />
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Building2 className="w-4 h-4 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                                        </div>
                                        <input
                                            placeholder="Company / Restaurant"
                                            value={newCompany}
                                            onChange={(e) => setNewCompany(e.target.value)}
                                            className="w-full bg-black/40 border border-white/5 focus:border-blue-500/50 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 outline-none transition-all shadow-inner"
                                            required
                                        />
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="w-4 h-4 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                                        </div>
                                        <input
                                            placeholder="Phone or Email"
                                            value={newContact}
                                            onChange={(e) => setNewContact(e.target.value)}
                                            className="w-full bg-black/40 border border-white/5 focus:border-blue-500/50 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 outline-none transition-all shadow-inner"
                                        />
                                    </div>
                                    {newItemType === "DEAL" && (
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <DollarSign className="w-4 h-4 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
                                            </div>
                                            <input
                                                placeholder="Closed Deal Value ($)"
                                                value={newValue}
                                                onChange={(e) => setNewValue(e.target.value)}
                                                className="w-full bg-black/40 border border-white/5 focus:border-emerald-500/50 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 outline-none transition-all shadow-inner font-medium"
                                                type="number"
                                            />
                                        </div>
                                    )}
                                </div>

                                <Button type="submit" className="w-full bg-white hover:bg-zinc-200 text-black font-bold border-0 rounded-xl py-6 mt-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all hover:scale-[1.02]">
                                    <Plus className="w-5 h-5 mr-2" />
                                    Create {newItemType === "LEAD" ? "Lead" : "Deal"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Lists */}
                <div className="lg:col-span-8 xl:col-span-9 space-y-8">
                    {/* LEADS */}
                    <div className="bg-zinc-900/20 border border-white/5 rounded-2xl p-6 backdrop-blur-md">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                            <h2 className="text-xl font-black text-white flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                                    <User className="w-5 h-5" />
                                </div>
                                Active Leads Pipeline
                            </h2>
                            <Badge variant="outline" className="text-zinc-400 border-white/10 bg-black/50 px-3 py-1 text-sm font-bold">
                                {leads.length} Records
                            </Badge>
                        </div>

                        {leads.length === 0 ? (
                            <div className="py-12 flex flex-col items-center justify-center text-zinc-500 bg-black/20 rounded-xl border border-white/5 border-dashed">
                                <Filter className="w-8 h-8 mb-3 opacity-20" />
                                <p className="font-medium">No leads found.</p>
                                <p className="text-xs mt-1">Adjust filters or add a new lead.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                                {leads.map(lead => (
                                    <CRMCard key={lead.id} item={lead} onDelete={handleAttemptDelete} onStatusChange={handleUpdateStatus} onConvertToDeal={handleAttemptConvert} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* DEALS */}
                    <div className="bg-zinc-900/20 border border-white/5 rounded-2xl p-6 backdrop-blur-md">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                            <h2 className="text-xl font-black text-white flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                                    <Building2 className="w-5 h-5" />
                                </div>
                                Customer Deals Pipeline
                            </h2>
                            <Badge variant="outline" className="text-zinc-400 border-white/10 bg-black/50 px-3 py-1 text-sm font-bold">
                                {deals.length} Records
                            </Badge>
                        </div>

                        {deals.length === 0 ? (
                            <div className="py-12 flex flex-col items-center justify-center text-zinc-500 bg-black/20 rounded-xl border border-white/5 border-dashed">
                                <Filter className="w-8 h-8 mb-3 opacity-20" />
                                <p className="font-medium">No deals found.</p>
                                <p className="text-xs mt-1">Adjust filters or add a new deal.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                                {deals.map(deal => (
                                    <CRMCard key={deal.id} item={deal} onDelete={handleAttemptDelete} onStatusChange={handleUpdateStatus} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* HISTORY */}
                    {deletedHistory.length > 0 && (
                        <div className="bg-red-900/5 border border-red-500/10 rounded-2xl p-6 backdrop-blur-md opacity-80 mt-12">
                            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                                <h2 className="text-xl font-black text-white flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                                        <Trash2 className="w-5 h-5" />
                                    </div>
                                    Deleted History
                                </h2>
                                <Badge variant="outline" className="text-red-400 border-red-500/10 bg-black/50 px-3 py-1 text-sm font-bold">
                                    {deletedHistory.length} Records
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 opacity-70 hover:opacity-100 transition-opacity">
                                {deletedHistory.map(item => (
                                    <CRMCard key={item.id} item={item} onDelete={handleAttemptDelete} onStatusChange={() => { }} onRestore={handleRestoreItem} onHardDelete={handleAttemptHardDelete} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {itemToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <Card className="max-w-md w-full bg-[#0a0a0a] border-white/10 shadow-2xl">
                        <CardHeader>
                            <CardTitle className="text-red-500 flex items-center gap-2">
                                <Trash2 className="w-5 h-5" />
                                Confirm Deletion
                            </CardTitle>
                            <CardDescription className="text-zinc-400">
                                This action cannot be undone. You are about to delete this <strong className="text-white">{itemToDelete.type.toLowerCase()}</strong> for <strong className="text-white">{itemToDelete.company}</strong>.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-zinc-300">
                                Please type <strong className="text-red-400 font-mono select-all">DELETE</strong> to confirm.
                            </p>
                            <input
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                placeholder="Type DELETE"
                                className="w-full bg-black/50 border border-red-500/30 focus:border-red-500 rounded-lg py-3 px-4 text-sm text-white placeholder:text-zinc-600 outline-none transition-all uppercase"
                            />
                            <div className="flex items-center gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    className="flex-1 bg-transparent border-white/10 text-white hover:bg-white/5"
                                    onClick={() => setItemToDelete(null)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={confirmDelete}
                                    disabled={deleteConfirmText !== "DELETE"}
                                >
                                    Delete Record
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
            {/* Convert Confirmation Modal */}
            {itemToConvert && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <Card className="max-w-md w-full bg-[#0a0a0a] border-white/10 shadow-2xl">
                        <CardHeader>
                            <CardTitle className="text-blue-500 flex items-center gap-2">
                                <Building2 className="w-5 h-5" />
                                Convert to Deal
                            </CardTitle>
                            <CardDescription className="text-zinc-400">
                                Enter the final closed price for <strong className="text-white">{itemToConvert.company}</strong> to add it to your revenue metrics.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={confirmConvert} className="space-y-4">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <DollarSign className="w-4 h-4 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
                                    </div>
                                    <input
                                        placeholder="Final Closing Price ($)"
                                        value={convertValue}
                                        onChange={(e) => setConvertValue(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 focus:border-blue-500 rounded-lg py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 outline-none transition-all font-medium"
                                        type="number"
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div className="flex items-center gap-3 pt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1 bg-transparent border-white/10 text-white hover:bg-white/5"
                                        onClick={() => setItemToConvert(null)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white border-0"
                                    >
                                        Convert & Win 🎉
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Hard Delete Confirmation Modal */}
            {itemToHardDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <Card className="max-w-md w-full bg-[#0a0a0a] border-red-500/30 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-red-600" />
                        <CardHeader>
                            <CardTitle className="text-red-500 flex items-center gap-2">
                                <Trash2 className="w-5 h-5" />
                                Permanent Deletion
                            </CardTitle>
                            <CardDescription className="text-zinc-400">
                                Enter the secret code to permanently delete <strong className="text-white">{itemToHardDelete.company}</strong>. This data will be wiped from the system forever.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <input
                                value={hardDeleteSecret}
                                onChange={(e) => setHardDeleteSecret(e.target.value)}
                                placeholder="Enter Secret Code"
                                className="w-full bg-black/50 border border-red-500/30 focus:border-red-500 rounded-lg py-3 px-4 text-sm text-center font-mono tracking-widest text-white placeholder:text-zinc-600 outline-none transition-all"
                                type="password"
                                maxLength={4}
                                autoFocus
                            />
                            <div className="flex items-center gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    className="flex-1 bg-transparent border-white/10 text-white hover:bg-white/5"
                                    onClick={() => setItemToHardDelete(null)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={confirmHardDelete}
                                    disabled={hardDeleteSecret !== "1956"}
                                >
                                    Wipe Record
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

function CRMCard({ item, onDelete, onStatusChange, onConvertToDeal, onRestore, onHardDelete }: { item: CRMItem, onDelete: (item: CRMItem) => void, onStatusChange: (id: string, s: CRMItemStatus) => void, onConvertToDeal?: (item: CRMItem) => void, onRestore?: (id: string) => void, onHardDelete?: (item: CRMItem) => void; }) {

    const getStatusStyles = (status: CRMItemStatus) => {
        switch (status) {
            case 'NEW': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
            case 'CONTACTED': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
            case 'WON': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]';
            case 'LOST': return 'bg-red-500/10 text-red-500 border border-red-500/20 grayscale opacity-80';
        }
    }

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5 hover:border-white/15 transition-all group hover:shadow-lg hover:bg-zinc-900/60 relative overflow-hidden">
            {item.status === 'WON' && <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] pointer-events-none" />}

            <div className="flex-1 min-w-0 relative z-10">
                <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-white truncate text-base">{item.company}</span>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${getStatusStyles(item.status)}`}>
                        {item.status}
                    </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-400 font-medium">
                    <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-zinc-500" /> {item.name}</span>
                    {item.contact && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-zinc-500" /> {item.contact}</span>}
                    {item.value && (
                        <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10">
                            ${parseFloat(item.value).toLocaleString()}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 mt-4 sm:mt-0 pt-3 sm:pt-0 border-t border-white/5 sm:border-t-0 relative z-10 w-full sm:w-auto">
                {item.isDeleted ? (
                    <div className="flex items-center gap-2">
                        {onRestore && (
                            <button
                                onClick={() => onRestore(item.id)}
                                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg transition-colors border border-amber-500/20"
                                title="Restore record"
                            >
                                <Trash2 className="w-3.5 h-3.5 line-through" /> Restore
                            </button>
                        )}
                        {onHardDelete && (
                            <button
                                onClick={() => onHardDelete(item)}
                                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/20"
                                title="Permanently Delete"
                            >
                                <Trash2 className="w-3.5 h-3.5" /> Wipe
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        {item.type === 'LEAD' && onConvertToDeal && (
                            <button
                                onClick={() => onConvertToDeal(item)}
                                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors border border-blue-500/20"
                                title="Convert to Deal"
                            >
                                To Deal <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        )}
                        {item.type === 'LEAD' && (
                            <select
                                value={item.status}
                                onChange={(e) => onStatusChange(item.id, e.target.value as CRMItemStatus)}
                                className={`bg-zinc-900 border rounded-lg text-xs font-bold px-3 py-2 outline-none cursor-pointer transition-colors w-full sm:w-auto ${getStatusStyles(item.status)} focus:ring-2 focus:ring-white/20`}
                            >
                                <option value="NEW" className="bg-zinc-900 text-white font-medium">NEW</option>
                                <option value="CONTACTED" className="bg-zinc-900 text-white font-medium">CONTACTED</option>
                                <option value="LOST" className="bg-zinc-900 text-white font-medium">LOST</option>
                            </select>
                        )}
                        <button
                            onClick={() => onDelete(item)}
                            className="p-2 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                            title="Delete record"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
