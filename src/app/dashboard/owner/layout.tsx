"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { AccessGuard } from "@/components/dashboard/AccessGuard";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { MaintenanceScreen } from "@/components/dashboard/MaintenanceScreen";
import { AnnouncementPopup } from "@/components/dashboard/AnnouncementPopup";
import { WelcomeSplash } from "@/components/dashboard/WelcomeSplash";
import { LanguageProvider, useLanguage } from "@/context/language-context";

export default function OwnerDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <LanguageProvider>
            <OwnerDashboardContent>{children}</OwnerDashboardContent>
        </LanguageProvider>
    );
}

function OwnerDashboardContent({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [maintenance, setMaintenance] = useState(false);
    const { direction } = useLanguage(); // Get direction (ltr/rtl)
    const supabase = createClient();

    useEffect(() => {
        const checkMaintenance = async () => {
            const { data } = await supabase
                .from('platform_settings')
                .select('maintenance_mode')
                .eq('id', 1)
                .single();

            if (data?.maintenance_mode) {
                setMaintenance(true);
            }
        };
        checkMaintenance();

        const channel = supabase.channel('maintenance_lock')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'platform_settings' },
                (payload) => {
                    const newStatus = payload.new as { maintenance_mode: boolean };
                    setMaintenance(newStatus.maintenance_mode);
                })
            .subscribe();

        return () => { supabase.removeChannel(channel); }
    }, [supabase]);

    if (maintenance) {
        return <MaintenanceScreen />;
    }

    // Dynamic margin based on direction
    const mainMargin = isCollapsed
        ? (direction === 'rtl' ? "md:mr-20" : "md:ml-20")
        : (direction === 'rtl' ? "md:mr-64 lg:mr-72" : "md:ml-64 lg:ml-72");

    return (
        <div className="min-h-screen w-full bg-zinc-950 flex text-zinc-100" dir={direction}>
            <WelcomeSplash />

            {/* Desktop Sidebar */}
            <Sidebar
                isCollapsed={isCollapsed}
                onToggle={() => setIsCollapsed(!isCollapsed)}
            />

            <main className={cn(
                "flex-1 min-h-screen flex flex-col relative z-0 transition-all duration-300 overflow-x-hidden",
                mainMargin
            )}>
                {/* Mobile Header */}
                <div className="md:hidden flex items-center p-4 border-b border-zinc-800 bg-zinc-950 text-white sticky top-0 z-30">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side={direction === 'rtl' ? "right" : "left"} className="p-0 w-72 border-none bg-zinc-950">
                            <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
                            <div className="h-full relative">
                                <Sidebar className="w-full static border-r-0" mobile />
                            </div>
                        </SheetContent>
                    </Sheet>
                    <span className="font-bold ml-4 text-lg">RESTAU+</span>
                </div>

                <div className="container mx-auto p-4 md:p-8 pt-6 flex-1 relative">
                    <AccessGuard>
                        <AnnouncementPopup />
                        {children}
                    </AccessGuard>
                </div>
            </main>
        </div>
    );
}
