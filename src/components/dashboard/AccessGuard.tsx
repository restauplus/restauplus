"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PendingApprovalUI } from "./PendingApprovalUI";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";

export function AccessGuard({ children }: { children: React.ReactNode }) {
    const { user, signOut, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [isApproved, setIsApproved] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function checkAccess() {
            if (authLoading) return;

            if (!user) {
                router.push('/login');
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from("profiles")
                    .select("status, role")
                    .eq("id", user.id)
                    .single();

                if (error) throw error;

                // 1. Master Check (Admins are always approved)
                if (data.role === 'admin') {
                    setIsApproved(true);
                } else {
                    // 2. Client Check (Must be active/approved)
                    const profileStatus = data.status || 'pending';
                    setIsApproved(profileStatus === 'active' || profileStatus === 'approved');
                }
            } catch (err) {
                console.error("Access check failed:", err);
                setIsApproved(false);
            } finally {
                setLoading(false);
            }
        }

        checkAccess();
    }, [user, supabase, authLoading]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest animate-pulse">Verifying Access...</p>
                </div>
            </div>
        );
    }

    if (!isApproved) {
        return <PendingApprovalUI />;
    }

    return <>{children}</>;
}
