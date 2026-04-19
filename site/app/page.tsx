import { Navbar } from "@/components/layout/Navbar";
import { StatsSection } from "@/components/sections/StatsSection";
import { AdvantagesSection } from "@/components/sections/AdvantagesSection";
import { PlansSection } from "@/components/sections/PlansSection";
import { ComparisonSection } from "@/components/sections/ComparisonSection";
import { LeadCaptureSection } from "@/components/sections/LeadCaptureSection";
import { HeroCarousel } from "@/components/sections/HeroCarousel";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full pt-[72px]">
        <HeroCarousel />
        <StatsSection />
        <PlansSection />
        <ComparisonSection />
        <AdvantagesSection />
        <LeadCaptureSection />
      </main>
      <Footer />
    </>
  );
}
