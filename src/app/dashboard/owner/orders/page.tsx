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
                menu_items ( name, price )
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

    const allOrders = [...(activeOrders || []), ...(completedOrders || [])];
    const metricsOrders = Array.from(new Map(allOrders.map(item => [item.id, item])).values());

    // 4. Fetch Restaurant Info
    const { data: restaurant } = await supabase
        .from('restaurants')
        .select('name, logo_url, currency, is_taking_orders, address, phone, email_public, website_url')
        .eq('id', profile.restaurant_id)
        .single();

    const currency = restaurant?.currency || 'USD';

    // 5. Fetch Daily Stats (Total Dine In & Take Away for Today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfDay = today.toISOString();

    const { count: totalDineIn } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('restaurant_id', profile.restaurant_id)
        .gte('created_at', startOfDay)
        .neq('status', 'cancelled')
        .or('order_type.eq.dine_in,order_type.is.null');

    const { count: totalTakeAway } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('restaurant_id', profile.restaurant_id)
        .gte('created_at', startOfDay)
        .neq('status', 'cancelled')
        .eq('order_type', 'takeaway');


    return (
        <div className="space-y-6 pt-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <OrdersHeader />
                <OrderToggle restaurantId={profile.restaurant_id} initialStatus={restaurant?.is_taking_orders ?? true} />
            </div>

            {/* Metrics Dashboard */}
            <KitchenMetrics
                orders={metricsOrders}
                totalDailyDineIn={totalDineIn || 0}
                totalDailyTakeAway={totalTakeAway || 0}
            />

            <OrderBoard
                initialOrders={activeOrders || []}
                restaurantId={profile.restaurant_id}
                currency={currency}
                restaurantName={restaurant?.name}
                restaurantLogo={restaurant?.logo_url}
                restaurantAddress={restaurant?.address}
                restaurantPhone={restaurant?.phone}
                restaurantEmail={restaurant?.email_public}
                restaurantWebsite={restaurant?.website_url}
            />
        </div>
    );
}
