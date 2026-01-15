import { createClient } from "@/lib/supabase/server";
import { OrderBoard } from "./components/OrderBoard";

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

    // 2. Fetch Active Orders
    const { data: orders } = await supabase
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
        .neq('status', 'paid') // Show everything active
        .neq('status', 'cancelled')
        .order('created_at', { ascending: true });

    return (
        <div className="p-6 space-y-6 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight glow-text text-primary">Live Kitchen Display</h1>
                    <p className="text-muted-foreground">Manage order flow in real-time</p>
                </div>
            </div>

            <OrderBoard initialOrders={orders || []} restaurantId={profile.restaurant_id} />
        </div>
    );
}
