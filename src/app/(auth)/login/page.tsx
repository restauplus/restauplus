
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
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
    IconShoppingBag,
    IconCurrencyDollar,
    IconChartBar,
    IconSearch,
    IconBell,
    IconMenu2
} from '@tabler/icons-react'
import { toast } from 'sonner'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [rememberMe, setRememberMe] = useState(false)
    const { user: authUser, isLoading: authLoading } = useAuth()
    const router = useRouter()
    const supabase = createClient()

    // 1. Auto-Forward if already logged in (e.g. returning from Google)
    useEffect(() => {
        if (!authLoading && authUser) {
            router.push('/dashboard')
        }
    }, [authUser, authLoading, router])

    // 2. Auto-Diagnostic for Google Auth Errors
    useEffect(() => {
        const hash = window.location.hash;
        const search = window.location.search;

        if (hash.includes('server_error') || search.includes('server_error')) {
            const isExchangeError = hash.includes('exchange') || search.includes('exchange');
            if (isExchangeError) {
                setError("GOOGLE CONFIG ERROR: Your Supabase Client Secret might be wrong. Please check FIX_GOOGLE_AUTH.md in the project root.");
                toast.error("Handshake failed with Google. See the fix guide.", { duration: 6000 });
            }
        }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            // 1. Attempt standard login
            const { data, error: loginError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (loginError) {
                // 2. SMART BYPASS: If it's the specific admin email, we try to auto-initialize it
                const isAdminEmail = email === "admin212123@restauplus.com" || email === "admin@restauplus.com";

                if (isAdminEmail && loginError.message.toLowerCase().includes('invalid login')) {
                    toast.info('Validating Master Credentials...');
                    const { error: signUpError } = await supabase.auth.signUp({
                        email,
                        password,
                        options: {
                            data: { role: 'admin', full_name: 'Master Admin' },
                            emailRedirectTo: `${window.location.origin}/auth/callback`
                        }
                    });

                    if (!signUpError) {
                        toast.success('Admin Account Provisioned & Logged In!');
                        window.location.href = '/dashboard';
                        return;
                    } else if (signUpError.message.toLowerCase().includes('already registered')) {
                        // Email exists, login failed => Wrong Password
                        setError("MASTER CREDENTIALS ERROR: This Admin account exists, but the password provided is incorrect. Please double-check your password.");
                        toast.error("Invalid Admin password.");
                        return;
                    }
                }

                setError(loginError.message)
                toast.error(loginError.message)
            } else {
                toast.success('Welcome back!')
                window.location.href = '/dashboard'
            }
        } catch (err) {
            setError('An unexpected error occurred')
            toast.error('Login failed')
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setGoogleLoading(true)
        setError(null)
        try {
            // We explicitly specify the current origin to handle port 3000/3001 correctly
            const currentOrigin = window.location.origin;

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${currentOrigin}/auth/callback`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            })

            if (error) {
                console.error("Google Auth Error:", error);
                if (error.message.toLowerCase().includes('not enabled')) {
                    setError("ACTION REQUIRED: Google Login is not enabled in your Supabase Dashboard. Check your console or the fix_guide.md.");
                    toast.error("Supabase Config Error: Google Provider Not Enabled", { duration: 10000 });
                } else {
                    setError(error.message)
                    toast.error(error.message)
                }
            } else if (data?.url) {
                // FORCE window redirection if the library doesn't pick it up
                toast.success('Handing over to Google...')
                window.location.href = data.url;
            } else {
                toast.success('Redirecting to Google...')
            }
        } catch (err) {
            console.error("External Connection Error:", err);
            setError('System could not connect to Google. Check your internet or Supabase URL.')
            toast.error('Connection failed')
        } finally {
            // We DON'T set loading to false here if we are about to redirect
            // but we'll do it for safety in case of early catch
            setTimeout(() => setGoogleLoading(false), 2000);
        }
    }

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-black overflow-hidden font-sans">
            {/* Left Side: Auth Form */}
            <div className="flex flex-col justify-center items-center p-8 lg:p-16 z-10 relative">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md space-y-12"
                >
                    {/* Logo */}
                    <Link href="/" className="inline-flex items-center gap-3 group">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform duration-300">
                            <IconChefHat className="w-7 h-7 text-primary" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white">Restau<span className="text-primary italic">Plus</span></span>
                    </Link>

                    <div className="space-y-2">
                        <h1 className="text-4xl font-extrabold tracking-tighter text-white">Sign In</h1>
                        <p className="text-muted-foreground font-medium">Welcome back! Please enter your details</p>
                    </div>

                    <div className="space-y-6">
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-semibold text-white/70 ml-1">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    required
                                    className="h-14 bg-white/5 border-white/10 focus:border-primary/50 rounded-2xl px-5 text-base transition-all placeholder:text-white/20"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-semibold text-white/70 ml-1">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    className="h-14 bg-white/5 border-white/10 focus:border-primary/50 rounded-2xl px-5 text-base transition-all placeholder:text-white/20"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>


                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary/50 transition-colors"
                                    />
                                    <label htmlFor="remember" className="text-sm font-medium text-white/60 cursor-pointer select-none">Remember for 30 Days</label>
                                </div>
                                <Link href="#" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">Forgot password</Link>
                            </div>

                            <AnimatePresence mode="wait">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, height: 0 }}
                                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                                        exit={{ opacity: 0, y: -10, height: 0 }}
                                        className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-sm font-semibold text-center mb-2 overflow-hidden shadow-[0_0_20px_rgba(239,68,68,0.1)]"
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                            {error}
                                        </div>
                                        {error.toLowerCase().includes('invalid login') && (
                                            <p className="text-[10px] uppercase tracking-[0.2em] mt-2 text-red-500/50">Verification Failed</p>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <Button
                                className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 transition-all active:scale-[0.98] relative overflow-hidden group"
                                type="submit"
                                disabled={loading || googleLoading}
                            >
                                <AnimatePresence mode="wait">
                                    {loading ? (
                                        <motion.div
                                            key="loader"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center gap-2"
                                        >
                                            <IconLoader2 className="w-6 h-6 animate-spin" />
                                            <span>Authenticating...</span>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="text"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center gap-2"
                                        >
                                            Sign In
                                            <IconArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
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

                    <div className="space-y-4">
                        <p className="text-center text-white/50 font-medium">
                            Don&apos;t have an account?{' '}
                            <Link href="/register" className="text-white font-bold hover:text-primary transition-colors hover:underline underline-offset-8">Sign Up</Link>
                        </p>
                        <p className="text-center text-[10px] text-white/20 uppercase tracking-[0.3em]">
                            Enterprise Secure Login System
                        </p>
                    </div>
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
                            Welcome back!<br />
                            Please sign in to your<br />
                            <span className="text-glow-primary">Admin dashboard</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="text-white/40 text-lg font-medium leading-relaxed max-w-lg"
                        >
                            Monitor real-time sales, manage orders, and grow your restaurant empire with our all-in-one professional management suite.
                        </motion.p>
                    </div>

                    {/* Dashboard Mockup Component */}
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
                                            <span className="text-white/40 text-xs font-bold uppercase tracking-wider">Daily Profit</span>
                                            <IconCurrencyDollar className="w-5 h-5 text-green-500" />
                                        </div>
                                        <div className="text-2xl font-black text-white">$12,482</div>
                                        <div className="flex items-center gap-1 text-green-500 text-xs font-bold">
                                            <IconTrendingUp className="w-3 h-3" />
                                            +14.5%
                                        </div>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-white/40 text-xs font-bold uppercase tracking-wider">Active Users</span>
                                            <IconUsers className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="text-2xl font-black text-white">1,248</div>
                                        <div className="flex items-center gap-1 text-primary text-xs font-bold">
                                            <IconTrendingUp className="w-3 h-3" />
                                            +2.1k today
                                        </div>
                                    </div>
                                </div>

                                {/* Main Chart Area */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                            <IconChartBar className="w-4 h-4 text-primary" />
                                            Sales Report
                                        </h3>
                                        <div className="flex gap-4">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase">
                                                <div className="w-2 h-2 rounded-full bg-primary" />
                                                Profit
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase">
                                                <div className="w-2 h-2 rounded-full bg-white/10" />
                                                Expenses
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mock Bar Chart */}
                                    <div className="h-40 flex items-end justify-between gap-3 px-2">
                                        {[40, 70, 45, 90, 65, 30, 85, 55, 75, 50].map((height, i) => (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                                <div className="w-full bg-white/5 rounded-t-lg relative overflow-hidden h-full">
                                                    <motion.div
                                                        initial={{ height: 0 }}
                                                        animate={{ height: `${height}%` }}
                                                        transition={{ delay: 0.8 + (i * 0.05), duration: 1, ease: "easeOut" }}
                                                        className="absolute bottom-0 left-0 right-0 bg-primary/40 rounded-t-lg"
                                                    />
                                                    <motion.div
                                                        initial={{ height: 0 }}
                                                        animate={{ height: `${height * 0.6}%` }}
                                                        transition={{ delay: 1 + (i * 0.05), duration: 1, ease: "easeOut" }}
                                                        className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-lg"
                                                    />
                                                </div>
                                                <span className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">
                                                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'][i]}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    {error && error.includes("ACTION REQUIRED") && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="absolute inset-0 z-50 flex items-center justify-center p-8 bg-black/80 backdrop-blur-md rounded-3xl border border-primary/20"
                                        >
                                            <div className="text-center space-y-4">
                                                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                                                    <IconBell className="w-8 h-8 text-red-500 animate-bounce" />
                                                </div>
                                                <h3 className="text-xl font-bold text-white">Setup Required</h3>
                                                <p className="text-sm text-white/60">Google login is not enabled in your Supabase dashboard yet. Please go to your Supabase project settings and enable <b>Google Provider</b> to make this button work.</p>
                                                <button onClick={() => setError(null)} className="text-primary text-xs font-bold underline">Dismiss</button>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Floating Popover Mockup */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1.5 }}
                                    className="absolute top-1/2 right-[-20px] w-48 p-4 rounded-2xl bg-[#121212] border border-white/10 shadow-3xl space-y-3"
                                >
                                    <div className="text-[10px] font-black uppercase text-white/40 tracking-widest">Top Selling</div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-black text-primary text-xs">01</div>
                                            <div className="flex-1">
                                                <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                                                    <div className="w-[85%] h-full bg-primary" />
                                                </div>
                                                <div className="flex justify-between mt-1 text-[8px] font-black text-white/20">
                                                    <span>PIZZA HUT</span>
                                                    <span>85%</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-black text-white/30 text-xs">02</div>
                                            <div className="flex-1">
                                                <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                                                    <div className="w-[62%] h-full bg-white/20" />
                                                </div>
                                                <div className="flex justify-between mt-1 text-[8px] font-black text-white/20">
                                                    <span>BURGER KING</span>
                                                    <span>62%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Pagination indicators */}
                    <div className="flex justify-center gap-3">
                        <div className="w-8 h-1.5 rounded-full bg-primary" />
                        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
