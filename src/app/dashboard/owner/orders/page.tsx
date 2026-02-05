import { createClient } from "@/lib/supabase/server";
import { OrderBoard } from "./components/OrderBoard";
import { KitchenMetrics } from "./components/KitchenMetrics";
import { OrderToggle } from "./components/OrderToggle";
import { OrdersHeader } from "./components/OrdersHeader";

export default async function OrdersPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Get Restaurant ID
    const { data: profile } = await supabase
        .from('profiles')
        .select('restaurant_id')
        .eq('id', user?.id)
        .single();

    if (!profile?.restaurant_id) return <div>No Restaurant Found</div>;

    // 2. Fetch Active Orders (for Board)
    const { data: activeOrders } = await supabase
        .from('orders')
        .select(`
            *,
            tables ( number ),
            order_items (
                *,
                menu_items ( name )
            )
        `)
        .eq('restaurant_id', profile.restaurant_id)
        .neq('status', 'paid')
        .neq('status', 'cancelled')
        .order('created_at', { ascending: true });

    // 3. Fetch Recent Completed Orders (for Stats) - Last 50 served/paid orders
    const { data: completedOrders } = await supabase
        .from('orders')
        .select('*')
        .eq('restaurant_id', profile.restaurant_id)
        .in('status', ['served', 'paid'])
        .order('created_at', { ascending: false })
        .limit(50);

    const metricsOrders = [...(activeOrders || []), ...(completedOrders || [])];

    // 4. Fetch Restaurant Currency
    const { data: restaurant } = await supabase
        .from('restaurants')
        .select('currency, is_taking_orders')
        .eq('id', profile.restaurant_id)
        .single();

    const currency = restaurant?.currency || 'USD';

    return (
        <div className="space-y-6 pt-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <OrdersHeader />
                <OrderToggle restaurantId={profile.restaurant_id} initialStatus={restaurant?.is_taking_orders ?? true} />
            </div>

            {/* Metrics Dashboard */}
            <KitchenMetrics orders={metricsOrders} />

            <OrderBoard initialOrders={activeOrders || []} restaurantId={profile.restaurant_id} currency={currency} />
        </div>
    );
}
