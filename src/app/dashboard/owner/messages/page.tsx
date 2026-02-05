"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Clock, Check, Search, Filter, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AdminMessage {
    id: string;
    content: string;
    created_at: string;
    is_active: boolean;
    message_type?: string;
}

export default function OwnerMessagesPage() {
    const supabase = createClient();
    const [messages, setMessages] = useState<AdminMessage[]>([]);
    const [readIds, setReadIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchMessages = async () => {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // 1. Fetch Messages
            const { data: allMessages } = await supabase
                .from('admin_messages')
                .select('*')
                .eq('is_active', true)
                .contains('target_user_ids', [user.id])
                .order('created_at', { ascending: false });

            if (allMessages) setMessages(allMessages);

            // 2. Fetch Read Status
            const { data: reads } = await supabase
                .from('admin_message_reads')
                .select('message_id')
                .eq('user_id', user.id);

            setReadIds(new Set(reads?.map(r => r.message_id) || []));
            setLoading(false);
        };

        fetchMessages();
    }, [supabase]);

    const filteredMessages = messages.filter(msg =>
        msg.content.toLowerCase().includes(search.toLowerCase()) ||
        msg.message_type?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-10 space-y-8 pb-32">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3"
                    >
                        <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20">
                            <MessageSquare className="w-6 h-6 text-teal-400" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter">R+ <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400 italic">Messages</span></h1>
                    </motion.div>
                    <p className="text-zinc-500 text-lg">Archive of all announcements and updates from Restau+.</p>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input
                        placeholder="Search messages..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-12 h-12 bg-zinc-900/50 border-zinc-800 rounded-2xl text-zinc-300 focus:border-teal-500/50 focus:ring-teal-500/20"
                    />
                </div>
            </div>

            {/* Messages Grid */}
            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="h-40 rounded-3xl bg-zinc-900/50 animate-pulse border border-white/5" />
                    ))
                ) : filteredMessages.length > 0 ? (
                    filteredMessages.map((msg, index) => {
                        const isRead = readIds.has(msg.id);
                        return (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className={cn(
                                    "border-0 overflow-hidden relative transition-all duration-300 group",
                                    "bg-zinc-900/40 hover:bg-zinc-900/80 border border-white/5 hover:border-teal-500/30"
                                )}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <CardContent className="p-6 md:p-8 flex flex-col md:flex-row gap-6 relative z-10">
                                        {/* Icon Section */}
                                        <div className="shrink-0">
                                            <div className={cn(
                                                "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-300",
                                                isRead ? "bg-zinc-800/50 text-zinc-500" : "bg-teal-500/20 text-teal-400 shadow-[0_0_20px_-5px_rgba(20,184,166,0.3)]"
                                            )}>
                                                {isRead ? <Check className="w-8 h-8" /> : <Bell className="w-8 h-8 animate-pulse" />}
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="flex-1 space-y-4">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-3">
                                                        <Badge variant="outline" className="border-teal-500/30 text-teal-400 bg-teal-500/5 flex items-center gap-1.5 px-3 py-1">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                                                            {msg.message_type || "UPDATE"}
                                                        </Badge>
                                                        <span className="text-zinc-500 text-xs font-mono flex items-center gap-1.5">
                                                            <Clock className="w-3 h-3" />
                                                            {new Date(msg.created_at).toLocaleDateString("en-GB", {
                                                                day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>

                                                {isRead && (
                                                    <div className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2 w-fit">
                                                        <Check className="w-3 h-3" /> Seen
                                                    </div>
                                                )}
                                            </div>

                                            <p className={cn(
                                                "text-lg leading-relaxed font-medium transition-colors",
                                                isRead ? "text-zinc-400" : "text-white"
                                            )}>
                                                {msg.content}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center">
                            <MessageSquare className="w-10 h-10 text-zinc-700" />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-400">No messages found</h3>
                        <p className="text-zinc-600 max-w-sm">You haven't received any updates yet, or they matched your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
