import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminUserList } from "@/components/dashboard/AdminUserList";

export const dynamic = 'force-dynamic';

export default async function AdminClientsPage() {
    const supabase = await createClient();

    // Auth & Admin Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const SUPER_ADMINS = ['admin@restauplus.com', 'admin212123@restauplus.com', 'bensalahbader.business@gmail.com'];
    const { data: adminProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single();

    if (adminProfile?.role !== 'admin' && !SUPER_ADMINS.includes(user.email || '')) {
        redirect("/dashboard/owner");
    }

    // Fetch All User Profiles using RPC (bypasses PostgREST schema cache issues)
    const { data: profiles, error } = await supabase.rpc('get_all_profiles_with_restaurant');
    const { data: profilePlans } = await supabase.from('profiles').select('id, plan_type');

    // Merge plan_type into profiles
    const mergedProfiles = profiles?.map((p: any) => {
        const planData = profilePlans?.find((plan: any) => plan.id === p.id);
        return {
            ...p,
            plan_type: planData?.plan_type || 'restaurant_trial'
        };
    }) || [];

    if (error) {
        console.error('RPC Error:', error);
    }

    console.log('--- DEBUG: FETCHED PROFILES VIA RPC ---');
    if (profiles && profiles.length > 0) {
        console.log('First Profile:', profiles[0]);
        console.log('First Profile Phone:', profiles[0].phone);
    }
    console.log('-------------------------------');

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-10 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2 border-b border-white/10 pb-8">
                <h1 className="text-4xl font-black tracking-tighter">Client <span className="text-primary italic">Management</span></h1>
                <p className="text-zinc-500 text-lg">Detailed list of all platform users and their access status.</p>
            </div>

            <AdminUserList initialProfiles={mergedProfiles} />
        </div>
    );
}
