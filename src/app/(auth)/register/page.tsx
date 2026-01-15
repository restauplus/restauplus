
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function RegisterPage() {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        restaurantName: '',
        slug: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            // 1. Sign Up User
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                    },
                },
            })

            if (authError) throw authError

            if (authData.user) {
                // 2. Call RPC to create Restaurant & Profile
                // Note: This requires the user to be logged in, which signUp usually does automatically 
                // if email confirmation is disabled or if using Auto-Confirm.
                // If Email Confirm is enabled, this flow breaks.
                // For this SaaS demo, we assume Auto-Confirm is ON or we handle it via API Route (Service Role).
                // Let's try the RPC approach first as it's cleaner for client-side if session exists.

                // Wait for session to be established?

                const { error: rpcError } = await supabase.rpc('handle_new_owner_signup', {
                    restaurant_name: formData.restaurantName,
                    restaurant_slug: formData.slug || formData.restaurantName.toLowerCase().replace(/\s+/g, '-'),
                    owner_full_name: formData.fullName
                })

                if (rpcError) {
                    // Fallback: If RPC fails (maybe permissions), we might need to rely on the Trigger approach
                    // or the user is not signed in yet (if email confirm needed).
                    console.error("RPC Error", rpcError)
                    throw new Error("Failed to create restaurant profile. Please contact support.")
                }

                router.push('/dashboard')
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-6 shadow-sm">
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-bold">Start your 14-day free trial</h1>
                    <p className="text-sm text-muted-foreground">
                        Get your restaurant up and running in minutes
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                required
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="restaurantName">Restaurant Name</Label>
                        <Input
                            id="restaurantName"
                            required
                            value={formData.restaurantName}
                            onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <Button className="w-full" type="submit" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Restaurant'}
                    </Button>
                </form>
                <div className="text-center text-sm">
                    Already have an account?{' '}
                    <Link href="/login" className="underline">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    )
}
