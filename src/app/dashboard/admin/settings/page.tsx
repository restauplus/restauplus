import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Settings, Save, Lock, Mail, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { AccessControlCard } from "@/components/admin/AccessControlCard";

export default async function AdminSettingsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    // Fetch initial settings
    const { data: settings } = await supabase
        .from('platform_settings')
        .select('*')
        .eq('id', 1)
        .single();


    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-10 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black tracking-tighter">Global <span className="text-secondary italic">Settings</span></h1>
                <p className="text-zinc-500">Configure core platform behavior.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* General Settings */}
                <Card className="bg-zinc-900/50 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Globe className="w-5 h-5 text-zinc-400" />
                            Platform Identity
                        </CardTitle>
                        <CardDescription>Public facing information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Platform Name</Label>
                            <Input defaultValue="Restau Plus" className="bg-black/50 border-white/10" />
                        </div>
                        <div className="space-y-2">
                            <Label>Support Email</Label>
                            <Input defaultValue="support@restauplus.com" className="bg-black/50 border-white/10" />
                        </div>
                        <Button className="w-full mt-4 bg-white/10 hover:bg-white/20">Save Changes</Button>
                    </CardContent>
                </Card>

                {/* Security Settings (Client Component) */}
                <AccessControlCard initialSettings={{
                    maintenance_mode: settings?.maintenance_mode ?? false,
                    allow_registrations: settings?.allow_registrations ?? true
                }} />
            </div>
        </div>
    );
}
