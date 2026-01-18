import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Store, Building2, MapPin, Globe, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const dynamic = 'force-dynamic';

export default async function AdminRestaurantsPage() {
    const supabase = await createClient();

    // Auth & Admin Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const SUPER_ADMINS = ['admin@restauplus.com', 'admin212123@restauplus.com', 'bensalahbader.business@gmail.com'];
    const { data: adminProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single();

    if (adminProfile?.role !== 'admin' && !SUPER_ADMINS.includes(user.email || '')) {
        redirect("/dashboard/owner");
    }

    // Fetch All Restaurants
    const { data: restaurants } = await supabase
        .from('restaurants')
        .select(`
            *,
            owner:profiles(id, full_name, email)
        `)
        .order('created_at', { ascending: false });

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-10 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black tracking-tighter">Restaurant <span className="text-secondary italic">Portfolio</span></h1>
                <p className="text-zinc-500">Overview of all registered restaurants on the platform.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants?.map((res) => (
                    <Card key={res.id} className="bg-zinc-900/50 border-white/10 hover:border-primary/50 transition-all group overflow-hidden">
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <Badge className={res.is_active ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}>
                                    {res.is_active ? "Live" : "Suspended"}
                                </Badge>
                            </div>
                            <CardTitle className="text-xl font-bold mt-4 text-white">{res.name}</CardTitle>
                            <CardDescription className="text-zinc-500 font-mono text-xs">{res.slug}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                                <MapPin className="w-4 h-4 text-zinc-500" />
                                <div className="text-sm">
                                    <p className="text-zinc-400 text-xs">Owner</p>
                                    <p className="text-zinc-200 font-medium">{res.owner?.[0]?.full_name || 'Unassigned'}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center gap-2 text-zinc-500">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-xs">Joined {new Date(res.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 cursor-pointer transition-colors">
                                        <Globe className="w-4 h-4 text-zinc-400" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {(!restaurants || restaurants.length === 0) && (
                <div className="text-center py-20 bg-zinc-900/20 rounded-3xl border border-dashed border-white/10">
                    <Building2 className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                    <p className="text-zinc-500">No restaurants found yet.</p>
                </div>
            )}
        </div>
    );
}
