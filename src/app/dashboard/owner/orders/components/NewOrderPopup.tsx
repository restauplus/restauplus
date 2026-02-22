"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";

interface NewOrderPopupProps {
    order: any;
    onAccept: () => void;
    onClose: () => void;
}

export function NewOrderPopup({ order, onAccept, onClose }: NewOrderPopupProps) {
    const { t } = useLanguage();
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setElapsedSeconds(s => s + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    if (!order) return null;

    const tableDisplay = order.table_number || (order.tables?.number ? `Table ${order.tables.number}` : "Express");
    const isTakeaway = order.order_type === 'takeaway';

    return (
        <Dialog open={!!order} onOpenChange={() => { }}>
            <DialogContent className="max-w-md p-0 overflow-hidden bg-transparent border-none shadow-none sm:max-w-lg md:max-w-xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative overflow-hidden bg-zinc-900/90 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl"
                >
                    {/* Background Effects */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-teal-500 to-transparent opacity-75" />
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700" />

                    <div className="p-8 flex flex-col items-center text-center relative z-10">
                        {/* Header Badge */}
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="mb-6 flex flex-col items-center"
                        >
                            <div className="px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-widest mb-4 shadow-[0_0_15px_-3px_rgba(20,184,166,0.2)]">
                                New Order Received
                            </div>

                            {/* Table / Order Info */}
                            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
                                <span className={cn(
                                    "bg-clip-text text-transparent bg-gradient-to-br",
                                    isTakeaway ? "from-blue-400 to-indigo-600" : "from-white to-zinc-400"
                                )}>
                                    {isTakeaway ? "TAKEAWAY" : tableDisplay}
                                </span>
                            </h2>
                            {order.customer_phone && (
                                <p className="text-lg text-zinc-400 font-medium">
                                    {order.customer_phone}
                                </p>
                            )}
                        </motion.div>

                        {/* Order Items Preview */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="w-full bg-black/20 rounded-2xl p-4 mb-6 border border-white/5 max-h-[200px] overflow-y-auto custom-scrollbar"
                        >
                            <div className="space-y-3 text-left">
                                {order.order_items?.map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-start text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
                                        <span className="text-zinc-300 font-medium flex gap-2">
                                            <span className="text-teal-400 font-bold">{item.quantity}x</span>
                                            {item.menu_items?.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Timer & Total */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex justify-between items-center w-full mb-8 px-2"
                        >
                            <div className="text-left">
                                <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Elapsed Time</p>
                                <p className="text-2xl font-mono font-bold text-white tabular-nums">
                                    {Math.floor(elapsedSeconds / 60).toString().padStart(2, '0')}:
                                    {(elapsedSeconds % 60).toString().padStart(2, '0')}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Total Amount</p>
                                <p className="text-2xl font-black text-white tabular-nums">
                                    {order.total_amount?.toFixed(2) || "0.00"}
                                </p>
                            </div>
                        </motion.div>

                        {/* Action Buttons */}
                        <div className="w-full flex gap-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onAccept}
                                className="flex-1 bg-teal-500 hover:bg-teal-400 text-black font-black py-4 rounded-xl text-lg uppercase tracking-wide shadow-[0_0_30px_-5px_rgba(20,184,166,0.4)] transition-all flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 className="w-6 h-6" />
                                Accept Order
                            </motion.button>
                        </div>

                        <p className="mt-4 text-[10px] text-zinc-600 font-medium uppercase tracking-widest">
                            Manager Approval Required
                        </p>
                    </div>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
}
