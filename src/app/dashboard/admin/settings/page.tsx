import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
    Shield,
    Bell,
    Globe,
    Database,
    Save,
    AlertTriangle,
    Smartphone,
    Users
} from "lucide-react";
import { redirect } from "next/navigation";

export default async function AdminSettingsPage() {
    const supabase = await createClient();

    // RBAC Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");
    const { data: adminProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (adminProfile?.role !== 'admin') redirect("/dashboard/owner");

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-white mb-2">
                        Global <span className="text-primary">Settings</span>
                    </h1>
                    <p className="text-muted-foreground">Configure system-wide parameters and security protocols.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">Discard Changes</Button>
                    <Button className="bg-primary hover:bg-primary/90 text-white">
                        <Save className="w-4 h-4 mr-2" />
                        Save Configuration
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="bg-black/40 border border-white/5 p-1 h-auto">
                    <TabsTrigger value="general" className="data-[state=active]:bg-primary data-[state=active]:text-white h-9 px-4">
                        <Globe className="w-4 h-4 mr-2" /> General
                    </TabsTrigger>
                    <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-white h-9 px-4">
                        <Shield className="w-4 h-4 mr-2" /> Security
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-white h-9 px-4">
                        <Bell className="w-4 h-4 mr-2" /> Notifications
                    </TabsTrigger>
                    <TabsTrigger value="advanced" className="data-[state=active]:bg-red-500 data-[state=active]:text-white h-9 px-4">
                        <Database className="w-4 h-4 mr-2" /> Advanced
                    </TabsTrigger>
                </TabsList>

                {/* GENERAL SETTINGS */}
                <TabsContent value="general" className="space-y-6">
                    <Card className="border-white/5 bg-black/40 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="text-xl text-white">Platform Identity</CardTitle>
                            <CardDescription>Visual and functional aspects of the platform.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="site-name" className="text-white">Platform Name</Label>
                                <Input id="site-name" defaultValue="RESTAU PLUS" className="bg-zinc-900/50 border-white/10 text-white" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="support-email" className="text-white">Support Email</Label>
                                <Input id="support-email" defaultValue="support@restauplus.com" className="bg-zinc-900/50 border-white/10 text-white" />
                            </div>
                            <Separator className="bg-white/5" />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base text-white">Maintenance Mode</Label>
                                    <p className="text-sm text-muted-foreground">Disable access for all users except admins.</p>
                                </div>
                                <Switch />
                            </div>
                            <Separator className="bg-white/5" />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base text-white">New Registrations</Label>
                                    <p className="text-sm text-muted-foreground">Allow new restaurant owners to sign up.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SECURITY SETTINGS */}
                <TabsContent value="security" className="space-y-6">
                    <Card className="border-white/5 bg-black/40 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="text-xl text-white">Access Control</CardTitle>
                            <CardDescription>Manage how users access the platform.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base text-white">Enforce 2FA for Admins</Label>
                                    <p className="text-sm text-muted-foreground">Require two-factor authentication for admin roles.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Separator className="bg-white/5" />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base text-white">Session Timeout</Label>
                                    <p className="text-sm text-muted-foreground">Automatically log out inactive users.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Input defaultValue="60" className="w-20 bg-zinc-900/50 border-white/10 text-white text-center" />
                                    <span className="text-sm text-muted-foreground">min</span>
                                </div>
                            </div>
                            <Separator className="bg-white/5" />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base text-white">Strict IP Allowlist</Label>
                                    <p className="text-sm text-muted-foreground">Restrict admin access to specific IP addresses.</p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* NOTIFICATIONS SETTINGS */}
                <TabsContent value="notifications" className="space-y-6">
                    <Card className="border-white/5 bg-black/40 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="text-xl text-white">System Alerts</CardTitle>
                            <CardDescription>Configure which events trigger email notifications.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-blue-500/10 text-blue-400">
                                        <Users className="w-4 h-4" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <Label className="text-base text-white">New User Signup</Label>
                                        <p className="text-sm text-muted-foreground">Notify when a new owner registers.</p>
                                    </div>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-400">
                                        <Smartphone className="w-4 h-4" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <Label className="text-base text-white">New Subscription</Label>
                                        <p className="text-sm text-muted-foreground">Notify when a plan is purchased.</p>
                                    </div>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-red-500/10 text-red-400">
                                        <AlertTriangle className="w-4 h-4" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <Label className="text-base text-white">Critical Errors</Label>
                                        <p className="text-sm text-muted-foreground">Notify on server crashes or high error rates.</p>
                                    </div>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ADVANCED / DANGER ZONE */}
                <TabsContent value="advanced" className="space-y-6">
                    <Card className="border-red-500/20 bg-red-500/5 backdrop-blur-xl">
                        <CardHeader>
                            <div className="flex items-center gap-2 text-red-400">
                                <AlertTriangle className="w-5 h-5" />
                                <CardTitle className="text-xl">Danger Zone</CardTitle>
                            </div>
                            <CardDescription className="text-red-400/70">Irreversible actions. Tread carefully.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 border border-red-500/20 rounded-lg bg-red-500/5">
                                <div className="space-y-0.5">
                                    <Label className="text-base text-white">Flush System Cache</Label>
                                    <p className="text-sm text-muted-foreground">Clear all server-side caches and temporary files.</p>
                                </div>
                                <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white">
                                    Flush Cache
                                </Button>
                            </div>
                            <div className="flex items-center justify-between p-4 border border-red-500/20 rounded-lg bg-red-500/5">
                                <div className="space-y-0.5">
                                    <Label className="text-base text-white">Reset Database Metrics</Label>
                                    <p className="text-sm text-muted-foreground">Recalculate all aggregated statistics from scratch.</p>
                                </div>
                                <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white">
                                    Recalculate
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
