import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CreditCard, DollarSign, Download, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-zinc-900/50 border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Total MRR</CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">$12,450.00</div>
                        <p className="text-xs text-zinc-500">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900/50 border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Active Subscriptions</CardTitle>
                        <CreditCard className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">48</div>
                        <p className="text-xs text-zinc-500">+4 new this month</p>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900/50 border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Pending Payouts</CardTitle>
                        <History className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">$2,100.00</div>
                        <p className="text-xs text-zinc-500">Next payout: Feb 1st</p>
                    </CardContent>
                </Card>
            </div>

            {/* Transactions Mock */}
            <Card className="bg-zinc-900/50 border-white/10">
                <CardHeader>
                    <CardTitle className="text-white">Recent Transactions</CardTitle>
                    <CardDescription className="text-zinc-500">Latest payments from restaurants.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                        <DollarSign className="w-5 h-5 text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">Pro Plan Subscription</p>
                                        <p className="text-xs text-zinc-500">restaurant-slug-{i}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-white">+$49.00</p>
                                    <p className="text-xs text-zinc-500">Just now</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
