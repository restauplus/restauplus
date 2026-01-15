"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, ChefHat, BellRing } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'served';

interface Order {
    id: string;
    table_id: string;
    status: OrderStatus;
    created_at: string;
    tables: { number: string };
    order_items: {
        id: string;
        quantity: number;
        menu_items: { name: string };
        notes?: string;
    }[];
}

const statusColors = {
    pending: "bg-red-500/10 text-red-500 border-red-500/50",
    preparing: "bg-orange-500/10 text-orange-500 border-orange-500/50",
    ready: "bg-green-500/10 text-green-500 border-green-500/50",
    served: "bg-blue-500/10 text-blue-500 border-blue-500/50",
};

export function OrderBoard({ initialOrders }: { initialOrders: any[], restaurantId: string }) {
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const supabase = createClient();

    // Group orders by status
    const columns: { status: OrderStatus; label: string; icon: any }[] = [
        { status: 'pending', label: 'New Orders', icon: BellRing },
        { status: 'preparing', label: 'Preparing', icon: ChefHat },
        { status: 'ready', label: 'Ready to Serve', icon: CheckCircle2 },
    ];

    const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
        // Optimistic update
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

        await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    };

    return (
        <div className="flex-1 overflow-x-auto">
            <div className="flex gap-6 min-w-[1000px] h-full pb-4">
                {columns.map(col => (
                    <div key={col.status} className="flex-1 min-w-[300px] flex flex-col gap-4">
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border/50 backdrop-blur-sm sticky top-0 z-10">
                            <col.icon className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold text-lg">{col.label}</h3>
                            <Badge variant="secondary" className="ml-auto">
                                {orders.filter(o => o.status === col.status).length}
                            </Badge>
                        </div>

                        <div className="space-y-4">
                            <AnimatePresence>
                                {orders
                                    .filter(o => o.status === col.status)
                                    .map(order => (
                                        <OrderCard key={order.id} order={order} onUpdate={updateStatus} />
                                    ))}
                            </AnimatePresence>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function OrderCard({ order, onUpdate }: { order: Order; onUpdate: (id: string, status: OrderStatus) => void }) {
    const elapsedMinutes = Math.floor((Date.now() - new Date(order.created_at).getTime()) / 60000);
    const isLate = elapsedMinutes > 20;

    return (
        <motion.div
            layoutId={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
        >
            <Card className="border-l-4 border-l-primary shadow-lg bg-card/50 hover:bg-card transition-colors">
                <CardHeader className="p-4 pb-2 flex flex-row justify-between items-start space-y-0">
                    <div>
                        <Badge variant="outline" className="text-lg px-3 py-1 border-primary/50 text-primary">
                            Table {order.tables?.number || '?'}
                        </Badge>
                        <div className={`mt-2 flex items-center gap-1 text-xs font-mono ${isLate ? "text-red-400 animate-pulse" : "text-muted-foreground"}`}>
                            <Clock className="w-3 h-3" />
                            {elapsedMinutes}m ago
                        </div>
                    </div>
                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                        {order.status === 'pending' && (
                            <Button size="sm" onClick={() => onUpdate(order.id, 'preparing')}>Cook</Button>
                        )}
                        {order.status === 'preparing' && (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => onUpdate(order.id, 'ready')}>Ready</Button>
                        )}
                        {order.status === 'ready' && (
                            <Button size="sm" variant="secondary" onClick={() => onUpdate(order.id, 'served')}>Serve</Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-2">
                    {order.order_items.map(item => (
                        <div key={item.id} className="flex justify-between items-start text-sm">
                            <span className="font-medium">
                                <span className="text-primary mr-2">{item.quantity}x</span>
                                {item.menu_items?.name || 'Unknown Item'}
                            </span>
                        </div>
                    ))}
                    {order.order_items.some(i => i.notes) && (
                        <div className="pt-2 border-t border-border/50">
                            <p className="text-xs text-yellow-500 font-mono">
                                ⚠ {order.order_items.map(i => i.notes).filter(Boolean).join(", ")}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
