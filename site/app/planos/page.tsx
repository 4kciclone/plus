import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { PlansSection } from "@/components/sections/PlansSection";

export default function PlanosPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F4F5F7] pt-[120px]">
        <div className="bg-[#080b12] py-12 text-center px-6">
          <h1 className="text-3xl font-extrabold text-white mb-2">Nossos Planos</h1>
          <p className="text-white/50 max-w-2xl mx-auto">Compare e escolha o pacote de fibra ideal para você ou para o seu negócio.</p>
        </div>
        <PlansSection />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
