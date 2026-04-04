"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Plan, getPlans } from "@/lib/api";
import { motion } from "framer-motion";

const staticPlans: Record<string, Array<{ name: string; price: string; speed: string; popular: boolean; features: string[] }>> = {
  Residencial: [
    { name: "100 Mega", price: "99,90", speed: "100", popular: false, features: ["100% Fibra Óptica", "HBO Max, Disney+, Deezer", "Paramount+ Incluso"] },
    { name: "500 Mega", price: "129,90", speed: "500", popular: true, features: ["100% Fibra Óptica", "HBO Max, Disney+, Deezer", "Paramount+ Incluso"] },
    { name: "800 Mega", price: "159,90", speed: "800", popular: false, features: ["100% Fibra Óptica", "HBO Max, Disney+, Deezer", "Paramount+ Incluso"] },
    { name: "Plus Giga", price: "199,90", speed: "1G", popular: false, features: ["100% Fibra Óptica", "HBO Max, Disney+, Deezer", "Paramount+ Incluso"] },
  ],
  Comercial: [
    { name: "100 Mega", price: "119,90", speed: "100", popular: false, features: ["100% Fibra Óptica", "Estabilidade Corporativa"] },
    { name: "300 Mega", price: "149,90", speed: "300", popular: false, features: ["100% Fibra Óptica", "Alta Disponibilidade"] },
    { name: "500 Mega", price: "169,90", speed: "500", popular: true, features: ["100% Fibra Óptica", "Suporte Empresarial Rápido"] },
    { name: "50 Mega + IP Válido", price: "239,90", speed: "50", popular: false, features: ["IP Fixo Válido", "Rotas Dedicadas"] },
  ],
  Combo: [
    { name: "100 Mega + 4 Apps", price: "119,90", speed: "100", popular: false, features: ["Disney+, Max, Deezer", "Paramount+", "100% Fibra Óptica"] },
    { name: "500 Mega + 4 Apps", price: "129,90", speed: "500", popular: true, features: ["Disney+, Max, Deezer", "Paramount+", "100% Fibra Óptica"] },
    { name: "800 Mega + 4 Apps", price: "159,90", speed: "800", popular: false, features: ["Disney+, Max, Deezer", "Paramount+", "100% Fibra Óptica"] },
    { name: "Plus Giga + 4 Apps", price: "199,90", speed: "1G", popular: false, features: ["Disney+, Max, Deezer", "Paramount+", "Ultra Velocidade"] },
  ],
  "Internet + TV": [
    { name: "TV + Streaming", price: "49,90", speed: "", popular: false, features: ["Plataforma de Canais", "Conteúdo On-Demand"] },
    { name: "Combo 150 Mega + TV", price: "99,90", speed: "150", popular: true, features: ["Internet Fibra 150 Mega", "Plataforma de TV"] },
    { name: "Rural 200 Mega + TV", price: "129,90", speed: "200", popular: false, features: ["Internet Rural 200 Mega", "Plataforma de TV"] },
  ]
};

export function PlansSection() {
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
      container.scrollBy({ left: direction === "left" ? -340 : 340, behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 bg-[#F4F5F7] overflow-hidden" id="planos">
      <div className="container mx-auto px-6 mb-12">
        <h2 className="text-3xl font-heading font-extrabold text-neutral-900 mb-2">Conheça nossos planos</h2>
      </div>

      <div className="space-y-12">
        {Object.entries(staticPlans).map(([category, categoryPlans]) => {
          const categoryId = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          return (
          <div key={category} id={categoryId} className="container mx-auto px-6 scroll-mt-[140px]">
            <div className="flex flex-col xl:flex-row gap-6">
              
              <div className="w-full xl:w-[22%] shrink-0 flex flex-col justify-start">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#666] mb-3 border-b-2 border-primary w-min pb-1 whitespace-nowrap">{category}</h3>
                <h4 className="text-2xl font-bold text-black mb-4">O plano perfeito pra você</h4>
                <a href={`#${categoryId}`} className="text-primary font-bold hover:underline flex items-center gap-1 text-[15px]">
                  Tudo sobre {category} ›
                </a>

                <div className="hidden md:flex xl:flex items-center gap-3 mt-6 xl:mt-8">
                  <button onClick={() => scroll(category, 'left')} className="w-12 h-12 rounded-full border-2 border-neutral-300 flex items-center justify-center text-neutral-500 hover:border-primary hover:text-primary hover:bg-white transition-all focus:outline-none shadow-sm" aria-label="Rolar para a esquerda">
                    <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
                  </button>
                  <button onClick={() => scroll(category, 'right')} className="w-12 h-12 rounded-full border-2 border-neutral-300 flex items-center justify-center text-neutral-500 hover:border-primary hover:text-primary hover:bg-white transition-all focus:outline-none shadow-sm" aria-label="Rolar para a direita">
                    <ChevronRight className="w-6 h-6" strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              <div 
                ref={(el) => { if (el) scrollRefs.current[category] = el; }}
                className="w-full xl:w-[78%] flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 hide-scrollbar scroll-smooth" 
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {categoryPlans.map((plan, i) => {
                  const planId = findPlanId(plan.name, category);
                  return (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
                      className={`snap-center shrink-0 w-[290px] md:w-[320px] bg-white rounded-2xl overflow-hidden flex flex-col relative border shadow-sm ${plan.popular ? 'border-primary ring-1 ring-primary' : 'border-black/5'}`}
                    >
                      <div className="px-6 pt-10 pb-4 bg-white relative">
                        {/* Magenta Header Bar (Brand Identity) */}
                        <div className="absolute top-0 inset-x-0 h-3 bg-primary" />
                        
                        {plan.popular && (
                          <div className="absolute top-3 inset-x-0 h-6 bg-[#B30078] flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-widest">
                             O Mais Assinado
                          </div>
                        )}
                        <p className="text-black/50 font-bold mb-1 uppercase text-xs tracking-wider">Plus {category}</p>
                        <h4 className="text-3xl font-extrabold text-neutral-900 leading-none">{plan.name}</h4>
                        <div className="mt-8 mb-2 flex items-baseline">
                          <span className="text-neutral-900 font-bold text-lg mr-1">R$</span>
                          <span className="text-5xl font-extrabold text-neutral-900 tracking-tight leading-none">{plan.price.split(',')[0]}</span>
                          <span className="text-neutral-900 font-bold text-xl">,{plan.price.split(',')[1]}</span>
                        </div>
                        <span className="text-neutral-500 text-[13px] font-medium block h-6">/mês pagando no débito</span>
                      </div>

                      <div className="px-6 py-4 flex-1 flex flex-col items-center">
                        {planId ? (
                          <Link href={`/assinar?plano=${planId}`} className="w-full">
                            <Button className="w-full rounded-full font-bold h-12 text-[15px] bg-primary hover:bg-primary-dark text-white shadow-none">Eu quero!</Button>
                          </Link>
                        ) : (
                          <Link href="/cadastro" className="w-full">
                            <Button className="w-full rounded-full font-bold h-12 text-[15px] bg-primary hover:bg-primary-dark text-white shadow-none">Eu quero!</Button>
                          </Link>
                        )}
                        <div className="w-full h-px bg-black/5 mx-auto my-6"></div>
                        <div className="space-y-4 w-full flex-1">
                          <div className="flex flex-col gap-3">
                            {plan.features.map((feat, j) => (
                              <div key={j} className="flex items-start gap-2.5">
                                <Check className="w-[18px] h-[18px] text-success shrink-0 mt-0.5" strokeWidth={3} />
                                <span className="text-neutral-700 text-[14px] font-medium leading-snug">{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </section>
  );
}
