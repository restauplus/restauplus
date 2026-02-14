import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { DashboardDemo } from "@/components/landing/DashboardDemo";
import { TrustedBy } from "@/components/landing/TrustedBy";
import { Pricing } from "@/components/landing/Pricing";
import { EcosystemStrip } from "@/components/landing/EcosystemStrip";
import Silk from "@/components/Silk";

export default function Home() {
  return (
    <main className="min-h-screen bg-black relative">
      {/* Global Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center opacity-40">
        <div style={{ width: '1080px', height: '1080px', position: 'relative' }}>
          <Silk
            speed={5}
            scale={1}
            color="#7B7481"
            noiseIntensity={1.5}
            rotation={0}
          />
        </div>
      </div>

      <div className="relative z-10">
        <Navbar />
        <DashboardDemo />
        <TrustedBy />
        <EcosystemStrip />
        <Features />
        <Pricing />
        <Footer />
      </div>
    </main>
  );
}
