import { Rocket, Clock, MapPin, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DeliveryPage() {
    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-10 flex flex-col items-center justify-center relative overflow-hidden animate-in fade-in duration-700">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px]" />
            </div>

            <div className="relative z-10 max-w-2xl text-center space-y-8">
                {/* Icon Badge */}
                <div className="mx-auto w-24 h-24 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl relative group">
                    <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <Truck className="w-12 h-12 text-white/80 group-hover:scale-110 transition-transform duration-500" />

                    {/* Floating badge */}
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg animate-bounce-slow">
                        COMING SOON
                    </div>
                </div>

                {/* Main Text */}
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50">
                        Restau Plus <br />
                        <span className="text-purple-400">Delivery</span>
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-400 font-medium leading-relaxed max-w-lg mx-auto">
                        We're building a dedicated delivery management suite to help you track orders, manage drivers, and optimize routes in real-time.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                        <MapPin className="w-6 h-6 text-blue-400 mb-3" />
                        <h3 className="font-bold text-white mb-1">Live Tracking</h3>
                        <p className="text-xs text-zinc-500">Real-time driver location updates.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                        <Clock className="w-6 h-6 text-purple-400 mb-3" />
                        <h3 className="font-bold text-white mb-1">Smart ETAs</h3>
                        <p className="text-xs text-zinc-500">AI-powered delivery time estimates.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                        <Rocket className="w-6 h-6 text-pink-400 mb-3" />
                        <h3 className="font-bold text-white mb-1">Auto-Dispatch</h3>
                        <p className="text-xs text-zinc-500">Automated courier assignment.</p>
                    </div>
                </div>

                {/* Notify Button */}
                <div className="pt-8">
                    <Button disabled className="h-12 px-8 rounded-full bg-white/10 text-white/50 border border-white/5 cursor-not-allowed hover:bg-white/10">
                        Notification enabled
                    </Button>
                    <p className="mt-4 text-xs text-zinc-600 font-mono">
                        EXPECTED LAUNCH: Q3 2026
                    </p>
                </div>
            </div>
        </div>
    );
}
