
import { createClient } from "@/lib/supabase/server";
import { DashboardUI } from "./DashboardUI";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login");
    }

    // Fetch Restaurant Profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('restaurant_id, role')
        .eq('id', user.id)
        .single();

    if (!profile?.restaurant_id) {
        return <div>No Restaurant Linked. Please contact support.</div>;
    }

    if (profile.role !== 'owner' && profile.role !== 'manager') {
        return <div className="p-8 text-center text-red-500">Unauthorized Access: Owners/Managers only.</div>;
    }

    const restaurantId = profile.restaurant_id;

    // Parallel Data Fetching
    const [
        { count: activeOrdersCount },
        { count: activeTablesCount },
        { count: totalOrdersToday }
    ] = await Promise.all([
        supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('restaurant_id', restaurantId)
            .neq('status', 'served')
            .neq('status', 'cancelled')
            .neq('status', 'paid'), // Assuming these are "active"

        supabase
            .from('tables')
            .select('*', { count: 'exact', head: true })
            .eq('restaurant_id', restaurantId)
            .eq('status', 'occupied'),

        supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('restaurant_id', restaurantId)
            .gte('created_at', new Date().toISOString().split('T')[0]), // Today
    ]);

    // Calculate revenue (simplified summary for now)
    // In production, use an RPC or a dedicated 'daily_sales' table
    const { data: revenueOrders } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('restaurant_id', restaurantId)
        .eq('status', 'paid')
        .gte('created_at', new Date().toISOString().split('T')[0]);

    const totalRevenue = revenueOrders?.reduce((acc, order) => acc + (Number(order.total_amount) || 0), 0) || 0;


    // Dummy Chart Data (until we have real analytics table)
    const chartData = [
        { name: "Mon", total: 0 },
        { name: "Tue", total: 0 },
        { name: "Wed", total: 0 },
        { name: "Thu", total: 0 },
        { name: "Fri", total: 0 },
        { name: "Sat", total: 0 },
        { name: "Sun", total: 0 },
    ];

    const stats = {
        totalRevenue,
        activeOrders: activeOrdersCount || 0,
        activeTables: activeTablesCount || 0,
        totalOrdersToday: totalOrdersToday || 0,
        chartData
    };

    return <DashboardUI stats={stats} />;
}
