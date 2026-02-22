import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function AdminBillingPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-10 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black tracking-tighter">Subscriptions & <span className="text-secondary italic">Billing</span></h1>
                <p className="text-zinc-500">Manage platform revenue, plans, and payouts.</p>
            </div>

            <Card className="bg-zinc-900/50 border-white/10">
                <CardHeader>
                    <CardTitle className="text-white">Coming Soon</CardTitle>
                    <CardDescription className="text-zinc-500">Real subscription data integration is pending.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center p-10 text-zinc-500">
                        Content Empty
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
