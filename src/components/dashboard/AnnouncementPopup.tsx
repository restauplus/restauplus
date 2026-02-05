"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageSquare, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AdminMessage {
    id: string;
    content: string;
    message_type?: string;
}

export function AnnouncementPopup() {
    const supabase = createClient();
    const [queue, setQueue] = useState<AdminMessage[]>([]);
    const [open, setOpen] = useState(false);
    const [countdown, setCountdown] = useState(7);
    const [isFirstMessage, setIsFirstMessage] = useState(true);

    // Derived state for current message
    const message = queue.length > 0 ? queue[0] : null;

    useEffect(() => {
        const fetchMessages = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // 1. Fetch ALL active messages for this user
            const { data: allMessages } = await supabase
                .from('admin_messages')
                .select('*')
                .eq('is_active', true)
                .contains('target_user_ids', [user.id])
                .order('created_at', { ascending: true }); // Oldest first

            if (!allMessages || allMessages.length === 0) return;

            // 2. Fetch ALL read receipts for this user
            const { data: readReceipts } = await supabase
                .from('admin_message_reads')
                .select('message_id')
                .eq('user_id', user.id);

            const readMessageIds = new Set(readReceipts?.map(r => r.message_id) || []);

            // 3. Filter only UNREAD messages
            const unreadMessages = allMessages.filter(msg => !readMessageIds.has(msg.id));

            if (unreadMessages.length > 0) {
                setQueue(unreadMessages);
                setOpen(true);
            }
        };

        fetchMessages();
    }, [supabase]);

    // Reset countdown when switching to a new message
    useEffect(() => {
        if (message) {
            // First message gets 7s, others get 3s
            setCountdown(isFirstMessage ? 7 : 3);
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [message, isFirstMessage]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (open && countdown > 0) {
            interval = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [open, countdown, message]); // Added message dependency

    if (!message) return null;

    const handleUnderstood = async () => {
        if (!message) return;

        // 1. Mark as read in DB (Optimistic update pattern not needed here, we just wait)
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            console.log("Marking as read for:", user.id, "Message:", message.id);
            const { error } = await supabase.from('admin_message_reads').upsert({
                message_id: message.id,
                user_id: user.id,
                read_at: new Date().toISOString()
            }, {
                onConflict: 'message_id,user_id',
                ignoreDuplicates: false
            });

            if (error) console.error("Create Read Receipt Error:", error);
            else console.log("Read Receipt Created Successfully");
        }

        // 2. Advance Queue (Remove first item)
        // If queue becomes empty, the effect above will close the dialog
        setIsFirstMessage(false);
        setQueue((prev) => prev.slice(1));
    };

    // Helper to format the message type for the title
    const formatTitle = (type: string = "IMPORTANT UPDATE") => {
        const parts = type.split(' ');
        const first = parts[0];
        const rest = parts.slice(1).join(' ');
        return { first, rest };
    };

    const titleParts = formatTitle(message.message_type);

    return (
        <AnimatePresence>
            {open && (
                <Dialog open={open} onOpenChange={(val) => {
                    // Prevent closing via clicking outside or Escape if we want to FORCE them to read
                    // For "Pro" UI, we usually want to force the interaction per user request
                    if (!val) {
                        // Only allow close if the queue implies we're done or if we want to allow skipping?
                        // User said: "Show them all one by one".
                        // Let's NOT allow closing without clicking Understood for now, or just ignore random closes.
                        // But if they hit ESC it might be annoying.
                        // Let's strictly require clicking the button.
                    }
                }}>
                    <DialogContent className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-black/40 backdrop-blur-3xl border border-white/10 p-0 rounded-3xl overflow-hidden shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] [&>button]:hidden">

                        {/* Premium Background Effects */}
                        <div className="absolute inset-0 z-0">
                            {/* Animated Gradients */}
                            <motion.div
                                animate={{
                                    opacity: [0.3, 0.5, 0.3],
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 90, 0]
                                }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="absolute -top-[50%] -left-[50%] w-[100%] h-[100%] bg-indigo-600/20 blur-[100px] rounded-full"
                            />
                            <motion.div
                                animate={{
                                    opacity: [0.3, 0.5, 0.3],
                                    scale: [1, 1.2, 1],
                                    rotate: [0, -90, 0]
                                }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="absolute -bottom-[50%] -right-[50%] w-[100%] h-[100%] bg-purple-600/20 blur-[100px] rounded-full"
                            />
                            {/* Noise Overlay */}
                            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
                        </div>

                        {/* Content Container */}
                        <div className="relative z-10 flex flex-col items-center p-8 md:p-10">

                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                className="w-64 h-auto flex items-center justify-center mb-8 relative"
                            >
                                <img
                                    src="/restau-plus-white.png"
                                    alt="Restau Plus"
                                    className="w-64 h-auto object-contain drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]"
                                />
                            </motion.div>

                            {/* Header */}
                            <DialogHeader className="space-y-4 text-center w-full">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                                        Official Announcement
                                    </div>
                                    <DialogTitle className="text-4xl md:text-5xl font-black text-white tracking-tighter drop-shadow-2xl uppercase">
                                        {titleParts.first} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 italic">{titleParts.rest}</span>
                                    </DialogTitle>
                                </motion.div>
                            </DialogHeader>

                            {/* Message Body */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="mt-8 w-full"
                            >
                                <div className="relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md group hover:bg-white/10 transition-colors duration-500">
                                    <div className="absolute -top-3 -left-3">
                                        <MessageSquare className="w-6 h-6 text-indigo-400 rotate-12" />
                                    </div>
                                    <p className="text-zinc-200 text-lg leading-relaxed text-center font-medium">
                                        {message.content}
                                    </p>
                                </div>
                            </motion.div>

                            {/* Action Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="mt-10 w-full"
                            >
                                <Button
                                    onClick={handleUnderstood}
                                    disabled={countdown > 0}
                                    className={cn(
                                        "w-full h-14 rounded-2xl text-lg font-black tracking-tight transition-all duration-300",
                                        countdown > 0
                                            ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                                            : "bg-white text-black hover:bg-zinc-200 shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_-10px_rgba(255,255,255,0.5)] hover:scale-[1.02] active:scale-[0.98]"
                                    )}
                                >
                                    {countdown > 0 ? `Please wait ${countdown}s` : "Understood"}
                                </Button>
                            </motion.div>

                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </AnimatePresence>
    );
}
