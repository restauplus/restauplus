
import { createClient } from "@/lib/supabase/server";
import { MenuGrid } from "./MenuGrid";
import { redirect } from "next/navigation";

export default async function MenuManagementPage() {
    const supabase = await createClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: profile } = await supabase.from('profiles').select('restaurant_id').eq('id', user.id).single();
    if (!profile?.restaurant_id) {
        // redirect("/setup");
        return <div>No Restaurant Linked</div>
    }

    const restaurantId = profile.restaurant_id;

    // Fetch Menu Items
    const { data: menuItems } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false });

    return <MenuGrid initialItems={menuItems || []} restaurantId={restaurantId} />;
}
