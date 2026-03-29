import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { StatsSection } from "@/components/sections/StatsSection";
import { AdvantagesSection } from "@/components/sections/AdvantagesSection";
import { PlansSection } from "@/components/sections/PlansSection";
import { StreamingSection } from "@/components/sections/StreamingSection";
import { TestimonialSection } from "@/components/sections/TestimonialSection";
import { LeadCaptureSection } from "@/components/sections/LeadCaptureSection";
import { HeroCarousel } from "@/components/sections/HeroCarousel";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full pt-[120px]">
        {/* HERO CAROUSEL */}
        <HeroCarousel />

        <StatsSection />
        <AdvantagesSection />
        <PlansSection />
        <StreamingSection />
        <TestimonialSection />
        <LeadCaptureSection />
      </main>
      <Footer />
    </>
  );
}
