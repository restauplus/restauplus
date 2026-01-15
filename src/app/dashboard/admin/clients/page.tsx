import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, MoreHorizontal, Search, Mail, Shield } from "lucide-react";
import { redirect } from "next/navigation";

export default async function AdminClientsPage() {
    const supabase = await createClient();

    // RBAC Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");
    const { data: adminProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (adminProfile?.role !== 'admin') redirect("/dashboard/owner");

    // Fetch Clients (Owners & Admins)
    const { data: clients } = await supabase
        .from('profiles')
        .select(`
            *,
            restaurants (*)
        `)
        .in('role', ['owner', 'admin'])
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-white mb-2">
                        Platform <span className="text-primary">Clients</span>
                    </h1>
                    <p className="text-muted-foreground">Manage {clients?.length || 0} registered user accounts.</p>
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-white">
                    <Users className="w-4 h-4 mr-2" />
                    Invite User
                </Button>
            </div>

            <Card className="border-white/5 bg-black/40 backdrop-blur-xl">
                <div className="p-6 border-b border-white/5 flex justify-between gap-4">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or role..."
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                        />
                    </div>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/5 hover:bg-transparent">
                            <TableHead className="text-muted-foreground">User Profile</TableHead>
                            <TableHead className="text-muted-foreground">Role</TableHead>
                            <TableHead className="text-muted-foreground">Restaurant</TableHead>
                            <TableHead className="text-muted-foreground">Joined</TableHead>
                            <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clients?.map((client: any) => (
                            <TableRow key={client.id} className="border-white/5 hover:bg-white/5 transition-colors">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                            {(client.full_name?.[0] || client.email[0]).toUpperCase()}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-white">{client.full_name || 'Unknown'}</span>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Mail className="w-3 h-3" />
                                                {client.email}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {client.role === 'admin' ? (
                                        <Badge variant="outline" className="border-red-500/50 text-red-400 bg-red-500/10 gap-1">
                                            <Shield className="w-3 h-3" /> Admin
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="border-blue-500/50 text-blue-400 bg-blue-500/10">
                                            Owner
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {client.restaurants ? (
                                        <span className="text-sm text-white">{client.restaurants.name}</span>
                                    ) : (
                                        <span className="text-xs text-muted-foreground italic">No Link</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {new Date(client.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-white/10 text-muted-foreground hover:text-white">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
