import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, AlertTriangle } from "lucide-react";
import { redirect } from "next/navigation";

export default async function AdminSetup() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return <div className="text-white">Please log in first.</div>;

    const { data: profile } = await supabase
        .from('profiles')
        .select('role, email')
        .eq('id', user.id)
        .single();

    async function promoteToAdmin() {
        "use server";
        const sb = await createClient();
        const { data: { user: u } } = await sb.auth.getUser();
        if (!u) return;

        // Self-promotion (Only possible because RLS allows update own profile)
        await sb.from('profiles').update({ role: 'admin' }).eq('id', u.id);
        redirect("/dashboard/admin");
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <Card className="max-w-md w-full border-primary/50 bg-zinc-900/50 backdrop-blur">
                <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl text-white">Admin Access Setup</CardTitle>
                    <CardDescription>
                        Current Status for <strong>{profile?.email}</strong>
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="p-4 rounded-lg bg-black/50 border border-white/10 text-center">
                        <p className="text-sm text-muted-foreground mb-1">Current Role</p>
                        <p className="text-xl font-mono font-bold text-white capitalize">
                            {profile?.role || 'Unknown'}
                        </p>
                    </div>

                    {profile?.role === 'admin' ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-green-500 bg-green-500/10 p-3 rounded text-sm justify-center">
                                <ShieldCheck className="w-4 h-4" />
                                You are already an Admin!
                            </div>
                            <form action={async () => { "use server"; redirect("/dashboard/admin"); }}>
                                <Button className="w-full bg-primary hover:bg-primary/90">
                                    Go to Admin Dashboard
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 p-3 rounded text-sm">
                                <AlertTriangle className="w-4 h-4 shrink-0" />
                                <span className="text-xs">
                                    Warning: This will enable full system access. Only do this if you are the platform owner.
                                </span>
                            </div>
                            <form action={promoteToAdmin}>
                                <Button className="w-full bg-white text-black hover:bg-zinc-200 font-bold">
                                    Promote Me to Super Admin
                                </Button>
                            </form>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
