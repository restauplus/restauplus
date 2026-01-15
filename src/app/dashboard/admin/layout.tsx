import { AdminSidebar } from "@/components/dashboard/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="fixed inset-0 z-[100] bg-black text-white flex overflow-hidden">
            {/* 
                We use fixed inset-0 z-[100] to completely overlay the parent DashboardLayout.
                This ensures we don't inherit the parent's sidebar or margins.
            */}

            <AdminSidebar className="w-72 hidden md:flex" />

            <main className="flex-1 min-h-screen flex flex-col bg-black overflow-y-auto relative md:ml-72">
                <div className="container mx-auto p-4 md:p-8 pt-6 flex-1">
                    {children}
                </div>
            </main>
        </div>
    );
}
