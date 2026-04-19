"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Plan, getPlans } from "@/lib/api";
import { motion } from "framer-motion";

const residentialPlans = [
  { name: "100 Mega", price: "99,90", speed: "100M", popular: false, features: ["Wi-Fi High-Power", "Instalação Grátis"] },
  { name: "500 Mega", price: "129,90", speed: "500M", popular: true, features: ["Max (HBO) Incluso", "Disney+ Incluso", "Wi-Fi 6 Mesh"] },
  { name: "800 Mega", price: "159,90", speed: "800M", popular: false, features: ["Combo Streaming Full", "2 Pontos Wi-Fi Mesh", "Prioridade Técnica"] },
  { name: "Plus Giga", price: "199,90", speed: "1Gbps", popular: false, features: ["Velocidade Extrema", "Todos os Streamings", "Suporte VIP 24h"] },
];

export function PlansSection() {
  const [apiPlans, setApiPlans] = useState<Plan[]>([]);

  useEffect(() => {
    getPlans().then(setApiPlans).catch(() => {});
  }, []);

  const groupedApi: Record<string, Plan[]> = {};
  apiPlans.forEach(p => {
    if (!groupedApi[p.category]) groupedApi[p.category] = [];
    groupedApi[p.category].push(p);
  });

  const findPlanId = (name: string): string | null => {
    const allPlans = Object.values(groupedApi).flat();
    const match = allPlans.find(p => p.name.includes(name) || name.includes(p.name));
    return match?.id || null;
  };

  return (
    <section className="py-24 px-4 bg-surface-container-low" id="planos">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface mb-4">Planos Residenciais</h2>
          <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">Escolha a velocidade ideal para transformar sua experiência digital.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {residentialPlans.map((plan, i) => {
            const planId = findPlanId(plan.name);
            const isFeatured = plan.popular;

            if (isFeatured) {
              return (
                <div key={i} className="bg-primary rounded-xl p-8 flex flex-col text-on-primary shadow-xl relative scale-105 z-10 transition-transform hover:scale-110">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-on-secondary px-6 py-1 rounded-full text-xs font-bold tracking-widest uppercase">MAIS ASSINADO</div>
                  <h3 className="text-2xl font-headline font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-sm font-bold opacity-80">R$</span>
                    <span className="text-4xl font-headline font-black">{plan.price.split(',')[0]}</span>
                    <span className="text-sm opacity-80">,{plan.price.split(',')[1]}/mês</span>
                  </div>
                  <ul className="space-y-4 mb-10 flex-grow">
                    {plan.features.map((feat, j) => (
                      <li key={j} className="flex items-center gap-3">
                        <Check className="w-5 h-5" strokeWidth={2.5} />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <Link href={planId ? `/assinar?plano=${planId}` : "/cadastro"} className="w-full py-4 rounded-xl font-bold bg-white text-primary hover:bg-surface transition-all text-center">
                    Assinar Agora
                  </Link>
                </div>
              );
            }

            return (
              <div key={i} className="bg-surface-container-lowest rounded-xl p-8 flex flex-col border border-transparent hover:border-primary/10 transition-all">
                <h3 className="text-2xl font-headline font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-sm font-bold text-on-surface-variant">R$</span>
                  <span className="text-4xl font-headline font-black text-on-surface">{plan.price.split(',')[0]}</span>
                  <span className="text-sm text-on-surface-variant">,{plan.price.split(',')[1]}/mês</span>
                </div>
                <ul className="space-y-4 mb-10 flex-grow">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="flex items-center gap-3 text-on-surface-variant">
                      <Check className="text-primary w-5 h-5" strokeWidth={2.5} />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link href={planId ? `/assinar?plano=${planId}` : "/cadastro"} className="w-full py-4 rounded-xl font-bold border-2 border-primary text-primary hover:bg-primary hover:text-on-primary transition-all text-center">
                  Assinar Agora
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
