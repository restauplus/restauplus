
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, UtensilsCrossed, ClipboardList, Settings, ChefHat, LogOut, Shield } from "lucide-react";

const sidebarItems = [
    { name: "Overview", href: "/dashboard/owner", icon: LayoutDashboard },
    { name: "Orders", href: "/dashboard/owner/orders", icon: ClipboardList },
    { name: "Menu Management", href: "/dashboard/owner/menu", icon: UtensilsCrossed },
    { name: "Settings", href: "/dashboard/owner/settings", icon: Settings },
];

export function Sidebar({ className, mobile }: { className?: string; mobile?: boolean }) {
    const pathname = usePathname();

    // Fix: Do not render Owner Sidebar on Admin pages (prevents hydration errors & double sidebars)
    if (pathname?.startsWith('/dashboard/admin')) return null;

    return (
        <div className={cn("bg-muted/20 border-r h-full flex flex-col", mobile ? "bg-background" : "hidden md:flex fixed left-0 top-0 md:w-64 lg:w-72", className)}>
            <div className="flex h-16 items-center px-6 border-b bg-background/50 backdrop-blur-sm shrink-0">
                <Link href="/" className="flex items-center space-x-2">
                    <ChefHat className="h-6 w-6 text-primary" />
                    <span className="text-lg font-bold tracking-tight">RESTAU PLUS</span>
                </Link>
            </div>
            <div className="flex flex-col gap-2 p-4 flex-1 overflow-y-auto">
                <div className="flex flex-col gap-1 py-2">
                    <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Restaurant
                    </h3>
                    {sidebarItems.map((item) => (
                        <Button
                            key={item.href}
                            variant={pathname === item.href ? "secondary" : "ghost"}
                            className={cn(
                                "justify-start gap-3 h-10 mb-1",
                                pathname === item.href && "bg-secondary font-medium"
                            )}
                            asChild
                        >
                            <Link href={item.href}>
                                <item.icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        </Button>
                    ))}
                </div>

                <div className="mt-auto pt-4 border-t space-y-2">
                    <Button variant="ghost" className="w-full justify-start gap-3" asChild>
                        <Link href="/dashboard/admin">
                            <Shield className="h-4 w-4" />
                            Admin Portal
                        </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    );
}
