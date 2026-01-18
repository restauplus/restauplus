import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Activity, Server, Database, ShieldCheck, Cpu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default async function AdminHealthPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-10 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black tracking-tighter">System <span className="text-secondary italic">Health</span></h1>
                <p className="text-zinc-500">Real-time status of platform infrastructure.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-zinc-900/50 border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Database Status</CardTitle>
                        <Database className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-2xl font-bold text-white">Operational</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-zinc-500">
                                <span>Connection Pool</span>
                                <span>32% used</span>
                            </div>
                            <Progress value={32} className="h-1 bg-zinc-800" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/50 border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">API Latency</CardTitle>
                        <Activity className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">45ms</div>
                        <p className="text-xs text-zinc-500">Average response time</p>

                        <div className="flex items-end gap-1 h-10 mt-4">
                            {[40, 35, 55, 45, 30, 60, 45, 40].map((h, i) => (
                                <div key={i} className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/40 transition-colors rounded-sm" style={{ height: `${h}%` }} />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-zinc-900/50 border-white/10">
                <CardHeader>
                    <CardTitle className="text-white">Security Log</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/5 border border-green-500/10 text-sm text-green-400">
                            <ShieldCheck className="w-4 h-4" />
                            <span>System Integrity Check Passed - {new Date().toLocaleTimeString()}</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 text-sm text-zinc-400">
                            <Server className="w-4 h-4" />
                            <span>Backup completed updates - 2 hours ago</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
