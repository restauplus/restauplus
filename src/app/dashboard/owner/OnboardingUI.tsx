
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconChefHat, IconRocket, IconLoader2, IconArrowRight } from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function OnboardingUI({ userEmail, userName }: { userEmail: string, userName: string }) {
    const [restaurantName, setRestaurantName] = useState("");
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!restaurantName.trim()) return;

        setLoading(true);
        try {
            const slug = restaurantName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

            // Call the same RPC used in registration
            const { error } = await supabase.rpc('handle_new_owner_signup', {
                restaurant_name: restaurantName,
                restaurant_slug: `${slug}-${Math.random().toString(36).substring(2, 6)}`,
                owner_full_name: userName || userEmail.split('@')[0]
            });

            if (error) throw error;

            toast.success("Restaurant created successfully! Launching dashboard...");
            window.location.href = '/dashboard/owner';
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Failed to create restaurant");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[90vh] text-center px-4 relative overflow-hidden bg-black font-sans">
            {/* Visual Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/5 blur-[120px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 max-w-md w-full space-y-10"
            >
                <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20 mx-auto animate-float">
                    <IconChefHat className="w-12 h-12 text-primary" />
                </div>

                <div className="space-y-4">
                    <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tighter italic text-glow-primary">
                        Restau<span className="text-primary italic">Plus</span>
                    </h2>
                    <p className="text-zinc-400 text-lg font-medium leading-relaxed">
                        Hey <span className="text-white font-bold">{userName || 'there'}</span>! Setup your restaurant profile to start taking orders.
                    </p>
                </div>

                <form onSubmit={handleCreate} className="space-y-6 text-left bg-zinc-950/50 p-8 rounded-3xl border border-white/5 backdrop-blur-xl">
                    <div className="space-y-2">
                        <Label htmlFor="restaurantName" className="text-sm font-semibold text-white/70 ml-1">Restaurant Name</Label>
                        <Input
                            id="restaurantName"
                            placeholder="e.g. The Golden Bistro"
                            required
                            className="h-14 bg-white/5 border-white/10 focus:border-primary/50 rounded-2xl px-5 text-base transition-all placeholder:text-white/20"
                            value={restaurantName}
                            onChange={(e) => setRestaurantName(e.target.value)}
                        />
                    </div>

                    <Button
                        className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 transition-all active:scale-[0.98] group"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <IconLoader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <div className="flex items-center justify-center gap-2">
                                Launch My Restaurant
                                <IconRocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </div>
                        )}
                    </Button>
                </form>

                <button
                    onClick={async () => {
                        await supabase.auth.signOut();
                        window.location.href = '/login';
                    }}
                    className="text-zinc-500 hover:text-white text-sm font-medium transition-colors"
                >
                    Sign out and use another account
                </button>

                <p className="text-[10px] text-zinc-600 uppercase tracking-[0.4em] font-bold">Secure Professional Management</p>
            </motion.div>
        </div>
    );
}
