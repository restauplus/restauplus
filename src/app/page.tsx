import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { Navbar } from "@/components/layout/Navbar";
import { GlobalHero } from "@/components/landing/GlobalHero";
import { TrustedBy } from "@/components/landing/TrustedBy";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";

export default function Home() {
  return (
    <main className="min-h-screen bg-black relative">
      {/* Global Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ShootingStars />
        <StarsBackground />
      </div>

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <GlobalHero />
        <Features />
        <Footer />
      </div>
    </main>
  );
}
