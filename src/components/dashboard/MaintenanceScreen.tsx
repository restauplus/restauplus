"use client";

import { AlertTriangle, RefreshCw, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function MaintenanceScreen() {
    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        window.location.href = "/login";
    };

    return (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center p-6 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(220,38,38,0.1)_0%,_transparent_70%)] animate-pulse" />

            <div className="relative z-10 max-w-md w-full space-y-8">
                <div className="flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                        <AlertTriangle className="w-10 h-10 text-red-500" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-3xl font-black text-white tracking-tight">System Under Maintenance</h1>
                    <p className="text-zinc-400">
                        We are currently performing scheduled maintenance to upgrade our systems.
                        Your data is safe, but the dashboard is temporarily inaccessible.
                    </p>
                </div>

                <div className="pt-4 flex flex-col md:flex-row items-center justify-center gap-3">
                    <Button
                        onClick={() => window.location.reload()}
                        className="bg-white text-black hover:bg-zinc-200"
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Check Status
                    </Button>
                    <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="border-white/10 text-white hover:bg-white/5 bg-transparent"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                    </Button>
                </div>

                <p className="text-xs text-zinc-600 font-mono pt-8">
                    ERROR_CODE: MAINTENANCE_MODE_ACTIVE
                </p>
            </div>
        </div>
    );
}
