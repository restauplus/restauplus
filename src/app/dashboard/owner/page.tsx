
import { createClient } from "@/lib/supabase/server";
import { DashboardUI } from "./DashboardUI";
import { redirect } from "next/navigation";
import { OnboardingUI } from "./OnboardingUI";
import { PendingApprovalUI } from "@/components/dashboard/PendingApprovalUI";
import { getDashboardStats } from "./actions";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login");
    }

    // Fetch Restaurant Profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('restaurant_id, role, full_name, status')
        .eq('id', user.id)
        .single();

    // 1. Check for Missing Restaurant (Onboarding first)
    if (!profile?.restaurant_id) {
        return <OnboardingUI
            userEmail={user.email || ""}
            userName={profile?.full_name || user.user_metadata?.full_name || ""}
        />;
    }

    // 2. Check for Pending Approval (Gatekeeping after onboarding)
    if (profile?.status !== 'active' && profile?.status !== 'approved') {
        return <PendingApprovalUI />;
    }

    if (profile.role !== 'owner' && profile.role !== 'manager') {
        return <div className="p-8 text-center text-red-500">Unauthorized Access: Owners/Managers only.</div>;
    }

    // Fetch Stats using Server Action
    const stats = await getDashboardStats();

    return <DashboardUI stats={stats} />;
}
