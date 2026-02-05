"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Power, PowerOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";

export function OrderToggle({
    restaurantId,
    initialStatus
}: {
    restaurantId: string;
    initialStatus: boolean;
}) {
    const [isTakingOrders, setIsTakingOrders] = useState(initialStatus);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();
    const { t, direction } = useLanguage();

    const toggleStatus = async () => {
        setLoading(true);
        const newStatus = !isTakingOrders;

        // Optimistic update
        setIsTakingOrders(newStatus);

        try {
            const { error } = await supabase
                .from('restaurants')
                .update({ is_taking_orders: newStatus })
                .eq('id', restaurantId);

            if (error) throw error;

            toast.success(newStatus ? t('ordersPage.status.openMsg') : t('ordersPage.status.closedMsg'), {
                className: newStatus ? "border-green-500/50 text-green-500" : "border-red-500/50 text-red-500"
            });
        } catch (error) {
            console.error(error);
            toast.error(t('ordersPage.status.error'));
            setIsTakingOrders(!newStatus); // Revert
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={toggleStatus}
            disabled={loading}
            className={cn(
                "group relative flex items-center gap-3 px-5 py-2.5 rounded-xl border transition-all duration-300 shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
                isTakingOrders
                    ? "bg-emerald-500/10 border-emerald-500/50 hover:bg-emerald-500/20 hover:border-emerald-500 shadow-emerald-500/10"
                    : "bg-red-500/10 border-red-500/50 hover:bg-red-500/20 hover:border-red-500 shadow-red-500/10"
            )}
        >
            <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-colors shadow-inner",
                isTakingOrders ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
            )}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Power className="w-5 h-5" />}
            </div>

            <div className="flex flex-col items-start">
                <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest leading-none mb-1",
                    isTakingOrders ? "text-emerald-400" : "text-red-400"
                )}>
                    {t('ordersPage.status.label')}
                </span>
                <span className={cn(
                    "text-sm font-black uppercase tracking-tight leading-none",
                    isTakingOrders ? "text-emerald-500" : "text-red-500"
                )}>
                    {isTakingOrders ? t('ordersPage.status.open') : t('ordersPage.status.closed')}
                </span>
            </div>

            {/* Status light */}
            <div className={cn(
                "absolute top-2 w-1.5 h-1.5 rounded-full",
                direction === 'rtl' ? "left-2" : "right-2",
                isTakingOrders ? "bg-emerald-400 animate-pulse" : "bg-red-400"
            )} />
        </button>
    );
}
