"use client";

import { useState } from "react";
import { Lock, Save, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface AccessSettings {
    maintenance_mode: boolean;
    allow_registrations: boolean;
}

export function AccessControlCard({ initialSettings }: { initialSettings: AccessSettings }) {
    const [settings, setSettings] = useState(initialSettings);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleSave = async () => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from("platform_settings")
                .upsert({
                    id: 1,
                    maintenance_mode: settings.maintenance_mode,
                    allow_registrations: settings.allow_registrations,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;
            toast.success("Security settings updated");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update settings");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-zinc-900/50 border-white/10">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <Lock className="w-5 h-5 text-zinc-400" />
                    Access Control
                </CardTitle>
                <CardDescription>Security and registration rules.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* Allow Registrations */}
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-base text-zinc-200">Allow New Registrations</Label>
                        <p className="text-xs text-zinc-500">If disabled, no new signups allowed.</p>
                    </div>
                    <Switch
                        checked={settings.allow_registrations}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, allow_registrations: checked }))}
                    />
                </div>

                {/* Maintenance Mode */}
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-base text-zinc-200">Maintenance Mode</Label>
                        <p className="text-xs text-zinc-500">Shut down user dashboards immediately.</p>
                    </div>
                    <Switch
                        checked={settings.maintenance_mode}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, maintenance_mode: checked }))}
                    />
                </div>

                <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full bg-white/10 hover:bg-white/20 text-white"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Security Settings
                        </>
                    )}
                </Button>

            </CardContent>
        </Card>
    );
}
