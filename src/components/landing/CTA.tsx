"use client";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTA() {
    return (
        <section className="relative py-32 overflow-hidden">
            {/* Background Gradient Mesh */}
            <div className="absolute inset-0 bg-black">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[150px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center space-y-10">

                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-zinc-400 to-zinc-600 border border-black" />
                            ))}
                        </div>
                        <span className="text-sm font-medium text-white pl-2">Join 500+ Top Restaurants</span>
                    </div>

                    <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight">
                        Ready to scale your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                            Restaurant Empire?
                        </span>
                    </h2>

                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto pt-4">
                        Stop using multiple fragmented tools. Switch to the only operating system designed for growth.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link href="/register?plan=trial">
                            <Button className="h-16 px-10 text-xl rounded-full bg-white text-black hover:bg-zinc-200 font-bold shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:shadow-[0_0_80px_rgba(255,255,255,0.4)] transition-all transform hover:-translate-y-1">
                                Get Started Free
                                <ArrowRight className="w-6 h-6 ml-2" />
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button variant="ghost" className="h-16 px-10 text-xl rounded-full text-zinc-400 hover:text-white hover:bg-white/5 font-medium">
                                Contact Sales
                            </Button>
                        </Link>
                    </div>

                    <div className="pt-12 flex items-center justify-center gap-8 text-zinc-500 text-sm font-medium">
                        <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                            4.9/5 Rating
                        </div>
                        <div className="w-1 h-1 bg-zinc-700 rounded-full" />
                        <div>No Credit Card Required</div>
                        <div className="w-1 h-1 bg-zinc-700 rounded-full" />
                        <div>14-Day Free Trial</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
