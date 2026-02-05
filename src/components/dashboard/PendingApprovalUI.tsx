
'use client'

import { motion } from 'framer-motion'
import { IconShieldLock, IconLoader2, IconMail, IconChefHat, IconRefresh, IconLogout, IconBrandWhatsapp } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export function PendingApprovalUI() {
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        window.location.href = '/login'
    }

    return (
        <div className="h-full w-full flex flex-col items-center justify-center p-6 relative font-sans selection:bg-primary/20 min-h-[80vh]">

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="max-w-lg w-full relative z-10"
            >
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/30 to-primary/10 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />

                    <div className="relative bg-[#09090b] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden glass-card">

                        {/* Inner Spotlight */}
                        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" />

                        <div className="flex flex-col items-center text-center space-y-8 relative z-10">

                            {/* Icon Wrapper */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse-slow" />
                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center shadow-inner relative backdrop-blur-xl">
                                    <IconShieldLock className="w-10 h-10 text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]" />

                                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#09090b] border border-white/10 flex items-center justify-center">
                                        <IconLoader2 className="w-4 h-4 text-primary animate-spin" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                                    Account Locked
                                </h1>
                                <p className="text-zinc-400 text-lg font-medium leading-relaxed">
                                    Your account is currently <span className="text-white font-bold decoration-primary/50 underline underline-offset-4 decoration-2">Under Review</span>.
                                    <br className="hidden md:block" /> Our security team is verifying your details.
                                </p>
                            </div>

                            {/* Status Box */}
                            <div className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center gap-4 group/box hover:bg-white/10 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center border border-primary/20">
                                    <IconMail className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-bold text-white">Verification in progress</p>
                                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">ETA: 24h</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-2/3 animate-pulse rounded-full relative overflow-hidden">
                                            <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite] skew-x-12"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 w-full gap-3 pt-2">
                                <Button
                                    onClick={() => window.location.reload()}
                                    className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <IconRefresh className="w-4 h-4 mr-2" />
                                    Check Status Again
                                </Button>

                                <Button
                                    onClick={() => window.open('https://wa.me/97451704550', '_blank')}
                                    className="w-full h-12 bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(37,211,102,0.2)] hover:shadow-[0_0_30px_rgba(37,211,102,0.4)] hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <IconBrandWhatsapp className="w-5 h-5 mr-2" />
                                    Contact Support on WhatsApp
                                </Button>

                                <Button
                                    variant="ghost"
                                    onClick={handleSignOut}
                                    className="w-full h-12 text-zinc-500 hover:text-white hover:bg-white/5 font-medium rounded-xl transition-all"
                                >
                                    <IconLogout className="w-4 h-4 mr-2" />
                                    Sign Out
                                </Button>
                            </div>

                        </div>
                    </div>

                    <div className="text-center mt-8">
                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em]">
                            Restau Plus Security &bull; ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
