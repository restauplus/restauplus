import { AdminSidebar } from "@/components/dashboard/AdminSidebar";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let userRole = "user";
    if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (profile) {
            userRole = profile.role;
        }

        const SUPER_ADMINS = ['admin@restauplus.com', 'admin212123@restauplus.com', 'bensalahbader.business@gmail.com'];
        if (SUPER_ADMINS.includes(user.email || '')) {
            userRole = "admin";
        }
    }

    return (
        <div className="min-h-screen bg-black flex">
            {/* Admin Sidebar */}
            <AdminSidebar userRole={userRole} />

            <main className="flex-1 md:ml-72 min-h-screen flex flex-col relative z-0 overflow-x-hidden">
                {children}
            </main>
        </div>
    );
}
