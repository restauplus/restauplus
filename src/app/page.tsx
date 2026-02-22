import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { DashboardDemo } from "@/components/landing/DashboardDemo";
import { TrustedBy } from "@/components/landing/TrustedBy";
import { Pricing } from "@/components/landing/Pricing";
import { HotelPricing } from "@/components/landing/HotelPricing";
import { RPlusMarketing } from "@/components/landing/RPlusMarketing";
import { EcosystemStrip } from "@/components/landing/EcosystemStrip";
import { HotelRoomService } from "@/components/landing/HotelRoomService";

export default function Home() {
  return (
    <main className="min-h-screen bg-black relative">
      {/* Global Dynamic Background */}


      <div className="relative z-10">
        <Navbar />
        <DashboardDemo />
        <TrustedBy />
        <EcosystemStrip />
        <Features />
        <RPlusMarketing />
        <HotelRoomService />
        <Pricing />
        <HotelPricing />
        <Footer />
      </div>
    </main>
  );
}
