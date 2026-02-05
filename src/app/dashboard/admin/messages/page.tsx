"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client"; // Use client for client-component interactions
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, Send, Users, MessageSquare, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Profile {
    id: string;
    full_name: string;
    email: string;
    role: string;
}

export default function AdminMessagesPage() {
    const supabase = createClient();
    const router = useRouter();
    const [owners, setOwners] = useState<Profile[]>([]);
    const [selectedOwners, setSelectedOwners] = useState<string[]>([]);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("IMPORTANT UPDATE");
    const [loading, setLoading] = useState(false);
    const [openCombobox, setOpenCombobox] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const messageTypes = [
        "IMPORTANT UPDATE",
        "URGENT MESSAGE",
        "SYSTEM MAINTENANCE",
        "NEW FEATURE",
        "WELCOME"
    ];

    useEffect(() => {
        const fetchOwners = async () => {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'owner');
            if (data) setOwners(data);
        };
        fetchOwners();
    }, [supabase]);

    const handleSend = async () => {
        if (!message) {
            toast.error("Please enter a message");
            return;
        }
        if (selectedOwners.length === 0) {
            toast.error("Please select at least one owner");
            return;
        }

        setLoading(true);

        const { error } = await supabase
            .from('admin_messages')
            .insert({
                content: message,
                target_user_ids: selectedOwners,
                is_active: true,
                message_type: messageType
            });

        setLoading(false);

        if (error) {
            toast.error(`Failed to send: ${error.message}`);
            console.error(error);
        } else {
            toast.success("Message sent successfully to " + selectedOwners.length + " owners");
            setMessage("");
            setSelectedOwners([]);
            setRefreshKey(prev => prev + 1);
        }
    };

    const toggleOwner = (id: string) => {
        setSelectedOwners(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id]
        );
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-10 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black tracking-tighter">Send <span className="text-secondary italic">Messages</span></h1>
                <p className="text-zinc-500">Send popup announcements to restaurant owners.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Compose Card */}
                <Card className="bg-zinc-900/50 border-white/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-primary" />
                            Compose Message
                        </CardTitle>
                        <CardDescription>This will appear as a popup on the owner's dashboard.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Target Users */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Recipients ({selectedOwners.length})</label>
                            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openCombobox}
                                        className="w-full justify-between bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white"
                                    >
                                        {selectedOwners.length > 0
                                            ? `${selectedOwners.length} selected`
                                            : "Select owners..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[400px] p-0 bg-zinc-900 border-zinc-800">
                                    <Command className="bg-zinc-900 text-white">
                                        <CommandInput placeholder="Search owners..." className="h-9" />
                                        <CommandList>
                                            <CommandEmpty>No owner found.</CommandEmpty>
                                            <CommandGroup>
                                                {owners.map((owner) => (
                                                    <CommandItem
                                                        key={owner.id}
                                                        value={owner.full_name || owner.email} // Use name or email for search
                                                        onSelect={() => {
                                                            toggleOwner(owner.id);
                                                            // Keep open to select multiple
                                                        }}
                                                        className="text-zinc-300 aria-selected:bg-zinc-800"
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                selectedOwners.includes(owner.id) ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{owner.full_name}</span>
                                                            <span className="text-xs text-zinc-500">{owner.email}</span>
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Message Type & Content */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Message Type</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {messageTypes.map((type) => (
                                        <div
                                            key={type}
                                            onClick={() => setMessageType(type)}
                                            className={cn(
                                                "cursor-pointer px-4 py-3 rounded-xl border transition-all duration-200 text-sm font-bold text-center",
                                                messageType === type
                                                    ? "bg-primary/20 border-primary text-primary"
                                                    : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                                            )}
                                        >
                                            {type}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Message Content</label>
                                <Textarea
                                    placeholder="Type your announcement here..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="min-h-[150px] bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-primary/50 resize-none"
                                />
                            </div>

                            <Button
                                onClick={handleSend}
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 rounded-xl"
                            >
                                {loading ? "Sending..." : (
                                    <span className="flex items-center gap-2">
                                        <Send className="w-4 h-4" /> Send Announcement
                                    </span>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* History / Info Card */}
                <div className="space-y-6">
                    <Card className="bg-zinc-900/50 border-white/10 h-full flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-zinc-400" />
                                Message History
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto custom-scrollbar max-h-[600px] space-y-4">
                            <MessageHistoryList refreshTrigger={refreshKey} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}


function MessageHistoryList({ refreshTrigger }: { refreshTrigger: number }) {
    const [history, setHistory] = useState<any[]>([]);
    const [selectedMessage, setSelectedMessage] = useState<any>(null);
    const [recipientStatus, setRecipientStatus] = useState<any[]>([]); // { user, read_at }
    const [loadingRecipients, setLoadingRecipients] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const fetchHistory = async () => {
            const { data, error } = await supabase
                .from('admin_messages')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(15);

            if (data) setHistory(data);
        };
        fetchHistory();
    }, [refreshTrigger]);

    const handleViewRecipients = async (msg: any) => {
        if (!msg.target_user_ids || msg.target_user_ids.length === 0) return;

        setSelectedMessage(msg);
        setLoadingRecipients(true);
        setRecipientStatus([]);

        // 1. Fetch Profiles
        const { data: profiles } = await supabase
            .from('profiles')
            .select('*')
            .in('id', msg.target_user_ids);

        // 2. Fetch Read Receipts for this message
        const { data: reads } = await supabase
            .from('admin_message_reads')
            .select('user_id, read_at')
            .eq('message_id', msg.id);

        // 3. Merge Data
        if (profiles) {
            const status = profiles.map(user => {
                const readRecord = reads?.find(r => r.user_id === user.id);
                return {
                    user,
                    read_at: readRecord ? readRecord.read_at : null
                };
            });
            setRecipientStatus(status);
        }

        setLoadingRecipients(false);
    };

    if (history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-10 opacity-50 text-center h-full">
                <Users className="w-12 h-12 text-zinc-700 mb-4" />
                <p className="text-zinc-500">No messages sent yet.</p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-3">
                {history.map((msg) => (
                    <div
                        key={msg.id}
                        className="group p-4 rounded-2xl bg-zinc-950/50 border border-zinc-800/50 hover:bg-zinc-900/50 hover:border-zinc-700 transition-all duration-300 cursor-pointer"
                        onClick={() => handleViewRecipients(msg)}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="border-zinc-800 bg-zinc-900 text-zinc-400 text-[10px] font-mono tracking-tight px-2 py-1">
                                    {new Date(msg.created_at).toLocaleString('en-GB', {
                                        day: '2-digit',
                                        month: 'short',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </Badge>
                                <Badge variant="secondary" className="bg-zinc-800/50 text-zinc-400 text-[10px]">
                                    {msg.message_type || "UPDATE"}
                                </Badge>
                            </div>
                            <Badge className={cn("text-[10px] px-2 py-0.5", msg.is_active ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" : "bg-red-500/10 text-red-500 hover:bg-red-500/20")}>
                                {msg.is_active ? "Active" : "Archived"}
                            </Badge>
                        </div>

                        <p className="text-sm text-zinc-300 font-medium leading-relaxed mb-3 group-hover:text-white transition-colors line-clamp-2">
                            {msg.content}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-white/5">
                            <div className="flex items-center gap-1.5 text-xs text-zinc-500 group-hover:text-emerald-400 transition-colors">
                                <Users className="w-3 h-3" />
                                <span>
                                    {msg.target_user_ids ? `${msg.target_user_ids.length} Recipients` : 'All Owners'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
                <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Recipient Status</DialogTitle>
                    </DialogHeader>
                    <div className="max-h-[400px] overflow-y-auto space-y-2 mt-4 custom-scrollbar">
                        {loadingRecipients ? (
                            <div className="flex justify-center py-8">
                                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : recipientStatus.length > 0 ? (
                            recipientStatus.map(({ user, read_at }) => (
                                <div key={user.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm text-zinc-200">{user.full_name}</span>
                                        <span className="text-xs text-zinc-500">{user.email}</span>
                                    </div>

                                    {read_at ? (
                                        <div className="flex flex-col items-end gap-1">
                                            <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
                                                <span className="text-[10px] font-bold">SEEN</span>
                                                <Check className="w-4 h-4" />
                                            </div>
                                            <span className="text-[10px] text-zinc-500 font-mono">
                                                {new Date(read_at).toLocaleString('en-GB', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    day: '2-digit',
                                                    month: 'short'
                                                })}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-zinc-500 bg-zinc-800/50 px-2 py-1 rounded-lg">
                                            <span className="text-[10px] font-bold">SENT</span>
                                            <Clock className="w-3 h-3" />
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-zinc-500 text-center py-4">No specific recipients (All Owners).</p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
