import Link from "next/link";
import { ChefHat } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-black relative overflow-hidden">
            <div className="border-t border-white/10 pt-24 pb-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center mb-24">
                        <h2 className="text-[12vw] font-bold text-white/5 leading-none select-none pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap z-0">
                            RESTAU PLUS
                        </h2>

                        <div className="relative z-10 text-center space-y-8">
                            <div className="flex items-center justify-center gap-3 mb-8">
                                <img src="/logo.png" alt="RESTAU PLUS" className="h-12 w-auto object-contain" />
                            </div>

                            <nav className="flex flex-wrap justify-center gap-8 md:gap-12">
                                {['Features', 'Pricing', 'About', 'Contact', 'Blog'].map((item) => (
                                    <Link
                                        key={item}
                                        href="#"
                                        className="text-neutral-400 hover:text-white text-lg font-medium transition-colors"
                                    >
                                        {item}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/5 relative z-10">
                        <p className="text-sm text-neutral-500">
                            &copy; {new Date().getFullYear()} Restau Plus. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            <Link href="#" className="text-sm text-neutral-500 hover:text-white transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="#" className="text-sm text-neutral-500 hover:text-white transition-colors">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
