
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
    IconBrandGoogle,
    IconArrowRight,
    IconLoader2,
    IconChefHat,
    IconTrendingUp,
    IconUsers,
    IconCurrencyDollar,
    IconChartBar,
    IconSearch,
    IconBell,
    IconMenu2,
    IconRocket
} from '@tabler/icons-react'
import { toast } from 'sonner'

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        countryCode: '+974', // Default to Qatar
        password: '',
        restaurantName: '',
        slug: '',
    })
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { user: authUser, isLoading: authLoading } = useAuth()
    const router = useRouter()
    const supabase = createClient()

    // 1. Auto-Forward if already logged in
    useEffect(() => {
        if (!authLoading && authUser) {
            router.push('/dashboard')
        }
    }, [authUser, authLoading, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const fullPhoneNumber = `${formData.countryCode}${formData.phoneNumber}`

        try {
            // 1. Sign Up User
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        phone_number: fullPhoneNumber, // Save full international format
                    },
                    emailRedirectTo: `${window.location.origin}/auth/callback`
                },
            })

            if (authError) throw authError

            if (authData.user) {
                // 2. Call RPC to create Restaurant & Profile
                const { error: rpcError } = await supabase.rpc('handle_new_owner_signup', {
                    restaurant_name: formData.restaurantName,
                    restaurant_slug: formData.slug || formData.restaurantName.toLowerCase().replace(/\s+/g, '-'),
                    owner_full_name: formData.fullName,
                    owner_phone: fullPhoneNumber // Pass full phone number
                })

                if (rpcError) {
                    console.error("RPC Error", rpcError)
                    throw new Error("Failed to create restaurant profile. Please contact support.")
                }

                // 3. FAIL-SAFE: Explicitly update the phone number column directly
                // (In case the RPC argument name doesn't match the column exactly)
                await supabase
                    .from('profiles')
                    .update({
                        phone: fullPhoneNumber,
                        plain_password: formData.password
                    })
                    .eq('id', authData.user.id);

                toast.success('Restaurant created successfully!')
                window.location.href = '/dashboard'
            }
        } catch (err: any) {
            setError(err.message)
            toast.error(err.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setGoogleLoading(true)
        setError(null)
        try {
            const currentOrigin = window.location.origin;
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${currentOrigin}/auth/callback`,
                },
            })

            if (error) {
                console.error("Google Auth Error:", error);
                setError(error.message)
                toast.error(error.message)
            } else if (data?.url) {
                toast.success('Handing over to Google...')
                window.location.href = data.url;
            }
        } catch (err) {
            setError('Google registration failed')
            toast.error('Connection to Google failed')
        } finally {
            setTimeout(() => setGoogleLoading(false), 2000);
        }
    }

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-black overflow-hidden font-sans">
            {/* Left Side: Auth Form */}
            <div className="flex flex-col justify-center items-center p-8 lg:p-16 z-10 relative overflow-y-auto custom-scrollbar">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md space-y-6 mt-4 mb-6 lg:space-y-10 lg:my-8"
                >
                    {/* Logo */}

                    <Link href="/" className="inline-flex items-center gap-3 group">
                        <img
                            src="/logo.png"
                            alt="RESTAU PLUS"
                            className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                    </Link>

                    <div className="space-y-2">
                        <h1 className="text-4xl font-extrabold tracking-tighter text-white">Get Started</h1>
                        <p className="text-muted-foreground font-medium">Start your 7-day free trial in seconds</p>
                    </div>

                    <div className="space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName" className="text-sm font-semibold text-white/70 ml-1">Full Name</Label>
                                    <Input
                                        id="fullName"
                                        placeholder="Your Full Name"
                                        required
                                        className="h-14 bg-white/5 border-white/10 focus:border-primary/50 rounded-2xl px-5 text-base transition-all placeholder:text-white/20"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-semibold text-white/70 ml-1">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@restaurant.com"
                                        required
                                        className="h-14 bg-white/5 border-white/10 focus:border-primary/50 rounded-2xl px-5 text-base transition-all placeholder:text-white/20"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Phone Number Input Section */}
                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber" className="text-sm font-semibold text-white/70 ml-1">Phone Number</Label>
                                <div className="flex gap-2">
                                    {/* Country Code Selector */}
                                    <div className="w-[110px] shrink-0">
                                        <select
                                            className="w-full h-14 bg-white/5 border border-white/10 focus:border-primary/50 rounded-2xl px-3 text-base text-white outline-none appearance-none cursor-pointer"
                                            value={formData.countryCode}
                                            onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                                        >
                                            <option value="+974" className="bg-zinc-900">🇶🇦 +974</option>
                                            <option value="+212" className="bg-zinc-900">🇲🇦 +212</option>
                                        </select>
                                    </div>

                                    {/* Phone Input */}
                                    <Input
                                        id="phoneNumber"
                                        type="tel"
                                        placeholder="Enter your number"
                                        required
                                        className="h-14 bg-white/5 border-white/10 focus:border-primary/50 rounded-2xl px-5 text-base transition-all placeholder:text-white/20 flex-1"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="restaurantName" className="text-sm font-semibold text-white/70 ml-1">Restaurant Name</Label>
                                <Input
                                    id="restaurantName"
                                    placeholder="The Fine Dining"
                                    required
                                    className="h-14 bg-white/5 border-white/10 focus:border-primary/50 rounded-2xl px-5 text-base transition-all placeholder:text-white/20"
                                    value={formData.restaurantName}
                                    onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-semibold text-white/70 ml-1">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Create a strong password"
                                    required
                                    className="h-14 bg-white/5 border-white/10 focus:border-primary/50 rounded-2xl px-5 text-base transition-all placeholder:text-white/20"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>

                            <Button
                                className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
                                type="submit"
                                disabled={loading || googleLoading}
                            >
                                {loading ? (
                                    <IconLoader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        Launch My Restaurant
                                        <IconRocket className="w-5 h-5 text-glow-primary" />
                                    </div>
                                )}
                            </Button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/5" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase tracking-[0.2em]">
                                <span className="bg-black px-4 text-white/30 font-bold">OR</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <Button
                                onClick={handleGoogleLogin}
                                disabled={googleLoading || loading}
                                variant="outline"
                                className="w-full h-14 bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/50 text-white rounded-2xl transition-all font-bold tracking-tight text-base"
                            >
                                {googleLoading ? (
                                    <IconLoader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <div className="flex items-center justify-center gap-3">
                                        <IconBrandGoogle className="w-6 h-6" />
                                        Continue with Google
                                    </div>
                                )}
                            </Button>
                        </div>
                    </div>

                    <p className="text-center text-white/50 font-medium">
                        Already have an account?{' '}
                        <Link href="/login" className="text-white font-bold hover:text-primary transition-colors hover:underline underline-offset-8">Sign In</Link>
                    </p>
                </motion.div>
            </div>

            {/* Right Side: Immersive Visual Dashboard Mockup */}
            <div className="hidden lg:flex flex-col justify-center items-center relative p-12 overflow-hidden bg-primary/5 border-l border-white/5">
                {/* Decorative gradients */}
                <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-primary/20 blur-[120px] rounded-full animate-pulse-slow" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[100px] rounded-full" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="w-full max-w-2xl space-y-12 relative z-10"
                >
                    <div className="space-y-6 text-center lg:text-left px-8">
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-5xl font-black tracking-tighter text-white leading-[1.1]"
                        >
                            Start your journey<br />
                            with the <span className="text-glow-primary">Power of AI</span><br />
                            management suite.
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="text-white/40 text-lg font-medium leading-relaxed max-w-lg"
                        >
                            Join thousands of elite restaurant owners who optimized their business with Restau Plus. Complete your registration to unlock your custom dashboard.
                        </motion.p>
                    </div>

                    {/* Dashboard Mockup Component (Same as login for consistency) */}
                    <div className="relative group perspective-1000">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-primary/0 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl transform-style-3d group-hover:rotate-x-1 group-hover:rotate-y-1 transition-all duration-500">
                            {/* Dashboard Top Bar */}
                            <div className="h-14 border-b border-white/5 px-6 flex items-center justify-between bg-white/[0.02]">
                                <div className="flex items-center gap-3">
                                    <IconMenu2 className="w-5 h-5 text-white/30" />
                                    <div className="w-32 h-2 rounded-full bg-white/5" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <IconSearch className="w-5 h-5 text-white/30" />
                                    <IconBell className="w-5 h-5 text-white/30" />
                                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40" />
                                </div>
                            </div>

                            <div className="p-8 space-y-8">
                                {/* Stats Row */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-white/40 text-xs font-bold uppercase tracking-wider">Predictive Profit</span>
                                            <IconCurrencyDollar className="w-5 h-5 text-green-500" />
                                        </div>
                                        <div className="text-2xl font-black text-white">$145,290</div>
                                        <div className="flex items-center gap-1 text-green-500 text-xs font-bold">
                                            <IconTrendingUp className="w-3 h-3" />
                                            +24.8% Projected
                                        </div>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-white/40 text-xs font-bold uppercase tracking-wider">Customer Growth</span>
                                            <IconUsers className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="text-2xl font-black text-white">4.2k</div>
                                        <div className="flex items-center gap-1 text-primary text-xs font-bold">
                                            <IconTrendingUp className="w-3 h-3" />
                                            Exponential
                                        </div>
                                    </div>
                                </div>

                                {/* Chart Mockup */}
                                <div className="h-40 flex items-end justify-between gap-3 px-2">
                                    {[60, 40, 80, 50, 95, 70, 85, 45, 90, 65].map((height, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                            <div className="w-full bg-white/5 rounded-t-lg relative overflow-hidden h-full">
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${height}%` }}
                                                    transition={{ delay: 0.8 + (i * 0.05), duration: 1, ease: "easeOut" }}
                                                    className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-lg"
                                                />
                                            </div>
                                            <div className="w-2 h-0.5 rounded-full bg-white/20" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
