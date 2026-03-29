"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqItems = [
  { q: "Minha internet caiu. O que eu faço?", a: "Primeiro, reinicie o roteador desligando da tomada por 30 segundos e ligando novamente. Se o problema persistir, abra um chamado logo abaixo ou entre em contato pelo nosso WhatsApp." },
  { q: "Como pagar minha fatura?", a: "Acesse a Área do Assinante pelo site ou app, vá na aba Faturas e copie o código PIX ou gere o boleto. Também é possível pagar direto pelo internet banking do seu banco." },
  { q: "Posso trocar meu plano a qualquer momento?", a: "Sim! Entre em contato pelo WhatsApp ou abra um chamado solicitando a mudança. Upgrades são aplicados imediatamente e downgrades no próximo ciclo de faturamento." },
  { q: "A instalação é gratuita?", a: "Sim, a instalação da fibra óptica é 100% gratuita em todos os planos. Nosso técnico vai até o seu endereço sem custo adicional." },
  { q: "Qual o prazo de instalação?", a: "Em média, a instalação é realizada em até 48 horas úteis após a confirmação do cadastro, dependendo da disponibilidade técnica no seu bairro." },
  { q: "Vocês atendem meu bairro?", a: "Atendemos mais de 30 bairros na região de Valença/RJ. Confira a lista completa na nossa página de Cobertura ou consulte pelo WhatsApp." },
  { q: "O Wi-Fi já vem incluso?", a: "Sim! Todos os planos incluem roteador Wi-Fi em regime de comodato sem custo adicional." },
  { q: "Tem fidelidade?", a: "Nossos planos residenciais não possuem fidelidade obrigatória. Planos comerciais e combos podem ter condições específicas — consulte ao contratar." },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="w-full">
      <h2 className="text-xl font-extrabold text-neutral-900 mb-6">Perguntas frequentes</h2>
      <div className="space-y-2">
        {faqItems.map((item, i) => (
          <div key={i} className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-4 text-left"
            >
              <span className="font-bold text-neutral-900 text-[15px] pr-4">{item.q}</span>
              <ChevronDown className={`w-5 h-5 text-neutral-400 shrink-0 transition-transform duration-200 ${open === i ? "rotate-180 text-primary" : ""}`} />
            </button>
            {open === i && (
              <div className="px-6 pb-5 text-neutral-600 text-[15px] leading-relaxed border-t border-neutral-100 pt-4">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
