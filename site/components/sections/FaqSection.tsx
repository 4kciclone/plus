"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqCategory {
  title: string;
  items: { q: string; a: string }[];
}

const faqData: FaqCategory[] = [
  {
    title: "Problemas Técnicos",
    items: [
      { q: "Minha internet caiu. O que eu faço?", a: "Primeiro, reinicie o roteador desligando da tomada por 30 segundos e ligando novamente. Se o problema persistir, clique em Luna IA acima para um diagnóstico rápido ou abra um chamado técnico em sua conta." },
      { q: "Luz LOS piscando em vermelho", a: "Isso indica que o sinal óptico não está chegando ao seu modem. Verifique se o cabo fino amarelo não está dobrado ou quebrado. Caso esteja tudo normal, abra um chamado urgente." },
      { q: "O Wi-Fi não alcança alguns cômodos", a: "O sinal Wi-Fi pode sofrer interferência de paredes e espelhos. A Plus oferece pontos adicionais de rede Mesh para cobertura total. Fale com nosso suporte para verificar a disponibilidade." }
    ]
  },
  {
    title: "Financeiro",
    items: [
      { q: "Como acessar a 2ª via da fatura?", a: "Você pode acessar a versão PDF, copiar o código PIX ou linha digitável direto no nosso App oficial ou clicando em Área do Assinante no menu principal." },
      { q: "Qual o prazo para baixa bancária?", a: "Pagamentos via PIX são compensados em até 5 minutos, aos finais de semana inclusive. Pagamentos via boleto demoram até 2 dias úteis." },
      { q: "Estou sem conexão por falta de pagamento", a: "Realize o pagamento via PIX. Assim que for compensado no sistema (até 5 minutos), sua conexão voltará automaticamente. Você não precisa enviar comprovante." }
    ]
  },
  {
    title: "Assinatura e Instalação",
    items: [
      { q: "Qual o prazo para a instalação nova?", a: "A Plus realiza as instalações em Valença e região em até 48 horas úteis, dependendo da rota técnica e da viabilidade. A visita é gratuita." },
      { q: "Posso mudar meu plano?", a: "Sim, o upgrade para planos mais altos não tem custo e é aplicado em até 1 hora. O downgrade está sujeito a verificação de prazos promocionais e encerramento de ciclo mensal." },
      { q: "O modem é meu?", a: "Os roteadores da Plus são fornecidos em regime de comodato. Eles pertencem à Plus Internet e devem ser devolvidos em perfeito funcionamento em caso de encerramento do contrato." }
    ]
  }
];

export function FaqSection() {
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [openItem, setOpenItem] = useState<number | null>(null);

  const handleCategoryChange = (index: number) => {
    setActiveCategory(index);
    setOpenItem(null); // Close everything when switching tabs
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      
      {/* Sidebar: Categories (4 columns) */}
      <div className="lg:col-span-4">
        <div className="sticky top-24 bg-surface-container-lowest rounded-2xl p-6 shadow-ambient">
          <h2 className="text-xl font-bold font-heading mb-6 text-on-surface">Categorias</h2>
          <nav className="flex flex-col gap-2">
            {faqData.map((category, i) => (
              <button
                key={i}
                onClick={() => handleCategoryChange(i)}
                className={`text-left px-5 py-4 rounded-xl font-bold transition-all ${
                  activeCategory === i
                    ? "bg-primary text-on-primary shadow-lg shadow-primary/20"
                    : "text-on-surface-variant hover:bg-surface-container-low"
                }`}
              >
                {category.title}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content: Accordions (8 columns) */}
      <div className="lg:col-span-8">
        <div className="bg-surface-container-lowest rounded-2xl shadow-ambient overflow-hidden">
          {faqData[activeCategory].items.map((item, i) => (
            <div 
              key={i} 
              className={`border-surface-container transition-colors ${
                i !== faqData[activeCategory].items.length - 1 ? "border-b" : ""
              } ${openItem === i ? "bg-primary/5" : ""}`}
            >
              <button
                onClick={() => setOpenItem(openItem === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left group"
              >
                <span className={`font-bold text-lg pr-4 transition-colors ${
                  openItem === i ? "text-primary" : "text-on-surface group-hover:text-primary"
                }`}>
                  {item.q}
                </span>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                  openItem === i ? "bg-primary text-on-primary rotate-180" : "bg-surface-container text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary"
                }`}>
                  <ChevronDown className="w-4 h-4" strokeWidth={3} />
                </span>
              </button>
              
              <div 
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                  openItem === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-6 pt-0 text-on-surface-variant leading-relaxed">
                    {item.a}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
