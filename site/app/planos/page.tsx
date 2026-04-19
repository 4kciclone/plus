"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Plan, getPlans } from "@/lib/api";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const staticPlans: Record<string, Array<{ name: string; price: string; speed: string; popular: boolean; features: string[]; label?: string }>> = {
  Residencial: [
    { name: "100 Mega", price: "99,90", speed: "100M", popular: false, label: "ESSENCIAL", features: ["Wi-Fi 5G Dual Band", "App Plus Filmes"] },
    { name: "500 Mega", price: "129,90", speed: "500M", popular: true, label: "PERFORMANCE PLUS", features: ["Wi-Fi 6 Próxima Gen", "HBO Max Incluso", "Prioridade de Suporte"] },
    { name: "800 Mega", price: "159,90", speed: "800M", popular: false, label: "EXTREME SPEED", features: ["Setup Gamer Otimizado", "2 Pontos Ultra Wi-Fi"] },
    { name: "Plus Giga", price: "199,90", speed: "1Gbps", popular: false, label: "ULTIMATE FIBER", features: ["IP Fixo Opcional", "Consultoria Técnica Dedicada"] },
  ],
  Comercial: [
    { name: "100 Mega", price: "119,90", speed: "100M", popular: false, features: ["Ideal para microempreendedores e escritórios pequenos."] },
    { name: "300 Mega", price: "149,90", speed: "300M", popular: false, features: ["Equilíbrio perfeito para equipes de até 10 pessoas."] },
    { name: "500 Mega", price: "169,90", speed: "500M", popular: true, features: ["Alta demanda e múltiplos dispositivos conectados simultaneamente."] },
    { name: "50 Mega + IP", price: "239,90", speed: "50M+IP", popular: false, features: ["Com IP Fixo dedicado para servidores e acesso remoto seguro."] },
  ],
  "Combo Internet + Vantagens": [
    { name: "Combo 100M", price: "119,90", speed: "100M", popular: false, features: ["Conectividade base + Streaming Essencial"] },
    { name: "Combo 500M Ultra", price: "129,90", speed: "500M", popular: true, features: ["A experiência completa com Max, Disney+ e Telecine inclusos."] },
    { name: "Combo 800M", price: "159,90", speed: "800M", popular: false, features: ["Poder extremo para streaming em 4K e Games."] },
  ],
  "Plus TV & Streaming": [
    { name: "TV Streaming", price: "49,90", speed: "", popular: false, features: ["60+ canais ao vivo em qualquer dispositivo."] },
    { name: "150M + TV", price: "99,90", speed: "150M", popular: true, features: ["Velocidade ideal + grade completa de canais."] },
    { name: "Rural 200M + TV", price: "129,90", speed: "200M", popular: false, features: ["Alcance estendido com sinal de alta potência."] },
  ],
};

function PlanCard({ plan, planId, isFeatured, category }: {
  plan: { name: string; price: string; speed: string; popular: boolean; features: string[]; label?: string };
  planId: string | null;
  isFeatured: boolean;
  category: string;
}) {
  return (
    <div
      className={`snap-center shrink-0 w-[280px] md:w-[300px] flex flex-col rounded-xl overflow-hidden transition-all duration-300 ${
        isFeatured
          ? "bg-surface-container-lowest shadow-ambient-lg border-t-4 border-primary scale-[1.02]"
          : "bg-surface-container-lowest shadow-ambient border-t-4 border-primary/30 hover:-translate-y-2"
      }`}
    >
      {/* Popular Badge */}
      {isFeatured && (
        <div className="bg-primary text-on-primary text-center py-1.5">
          <span className="text-[10px] font-black uppercase tracking-[0.15em]">
            O Mais Assinado
          </span>
        </div>
      )}

      <div className="px-6 pt-8 pb-6 flex flex-col flex-1">
        {/* Label */}
        {plan.label && (
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-on-surface-variant mb-2">
            {plan.label}
          </p>
        )}

        {/* Speed */}
        <h3 className="text-4xl font-extrabold font-heading text-on-surface tracking-tight mb-1">
          {plan.speed || plan.name}
        </h3>

        {/* Features */}
        <div className="space-y-2 my-6 flex-1">
          {plan.features.map((feat, j) => (
            <div key={j} className="flex items-start gap-2">
              <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" strokeWidth={3} />
              <span className="text-sm text-on-surface-variant font-medium">{feat}</span>
            </div>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-baseline mb-6">
          <span className="text-sm font-bold text-on-surface-variant mr-1">R$</span>
          <span className="text-4xl font-extrabold text-on-surface tracking-tight leading-none">
            {plan.price.split(",")[0]}
          </span>
          <span className="text-lg font-bold text-on-surface-variant">,{plan.price.split(",")[1]}</span>
          <span className="text-sm text-on-surface-variant ml-1">/mês</span>
        </div>

        {/* CTA */}
        <Link
          href={planId ? `/assinar?plano=${planId}` : "/cadastro"}
          className="w-full py-3.5 rounded-xl bg-primary text-on-primary font-bold text-center hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20"
        >
          Eu quero!
        </Link>
      </div>
    </div>
  );
}

export default function PlanosPage() {
  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [apiPlans, setApiPlans] = useState<Plan[]>([]);

  useEffect(() => {
    getPlans().then(setApiPlans).catch(() => {});
  }, []);

  const groupedApi: Record<string, Plan[]> = {};
  apiPlans.forEach(p => {
    if (!groupedApi[p.category]) groupedApi[p.category] = [];
    groupedApi[p.category].push(p);
  });

  const findPlanId = (name: string, category: string): string | null => {
    const cat = groupedApi[category];
    if (!cat) return null;
    const match = cat.find(p => p.name.includes(name) || name.includes(p.name));
    return match?.id || null;
  };

  const scroll = (category: string, direction: "left" | "right") => {
    const container = scrollRefs.current[category];
    if (container) {
      container.scrollBy({ left: direction === "left" ? -320 : 320, behavior: "smooth" });
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface pt-[72px]">
        {/* Hero Header */}
        <section className="bg-surface-container-lowest py-16 md:py-24 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary/10 text-primary font-bold text-xs tracking-widest uppercase">
              Fibra Óptica de Verdade
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold font-heading tracking-tighter text-on-surface leading-tight mb-6">
              Nossos Planos —{" "}
              <span className="text-primary italic">
                Conectividade de alta performance
              </span>
            </h1>
            <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
              Escolha a velocidade que transforma sua experiência digital. Ultravelocidade, estabilidade garantida e suporte premium.
            </p>
          </div>
        </section>

        {/* Plan Categories */}
        <div className="space-y-20 py-16">
          {Object.entries(staticPlans).map(([category, categoryPlans]) => {
            const categoryId = category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            return (
              <section
                key={category}
                id={categoryId}
                className={`scroll-mt-[100px] ${
                  category === "Comercial" ? "bg-surface-container-low py-16" : "py-4"
                }`}
              >
                <div className="max-w-7xl mx-auto px-8">
                  {/* Category Header */}
                  <div className="flex items-end justify-between mb-10">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-extrabold font-heading tracking-tight text-on-surface">
                        {category}
                      </h2>
                      <div className="w-16 h-1 bg-primary rounded-full mt-3" />
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                      <button
                        onClick={() => scroll(category, "left")}
                        className="w-10 h-10 rounded-full bg-surface-container-lowest shadow-ambient flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                        aria-label="Rolar para a esquerda"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => scroll(category, "right")}
                        className="w-10 h-10 rounded-full bg-surface-container-lowest shadow-ambient flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                        aria-label="Rolar para a direita"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Horizontal Scroll Cards */}
                  <div
                    ref={(el) => {
                      if (el) scrollRefs.current[category] = el;
                    }}
                    className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 no-scrollbar scroll-smooth"
                  >
                    {categoryPlans.map((plan, i) => {
                      const planId = findPlanId(plan.name, category);
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-30px" }}
                          transition={{ duration: 0.4, delay: i * 0.1 }}
                        >
                          <PlanCard
                            plan={plan}
                            planId={planId}
                            isFeatured={plan.popular}
                            category={category}
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {/* Footer CTA */}
        <section className="py-20 px-8">
          <div className="max-w-7xl mx-auto bg-secondary text-on-secondary rounded-xl p-12 md:p-16 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-1/3 h-full bg-white/5 blur-3xl" />
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-extrabold font-heading mb-4">
                Não encontrou o plano ideal?
              </h2>
              <p className="text-on-secondary/70 text-lg mb-8">
                Fale com nossa equipe e monte um pacote personalizado para sua necessidade.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/cadastro"
                  className="px-8 py-4 bg-primary text-on-primary rounded-full font-bold shadow-xl hover:scale-105 transition-transform"
                >
                  Falar com Consultor
                </Link>
                <Link
                  href="/duvidas"
                  className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-full font-bold border border-white/20 hover:bg-white/20 transition-all"
                >
                  Central de Dúvidas
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
