import { CheckCircle2, Zap, Headphones, Wifi } from "lucide-react";

export function AdvantagesSection() {
  const advantages = [
    { title: "Ultra Velocidade", text: "Fibra óptica de ponta a ponta garantindo estabilidade.", icon: Zap },
    { title: "Wi-Fi 6 Incluso", text: "Roteadores de última geração em regime de comodato grátis.", icon: Wifi },
    { title: "Suporte Regional 24/7", text: "Atendimento humano e especializado na sua região.", icon: Headphones },
    { title: "Download Ilimitado", text: "Baixe o que quiser, sem limites absurdos ou bloqueios.", icon: CheckCircle2 }
  ];

  return (
    <section className="py-20 bg-white" id="vantagens">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="mb-12">
          <h2 className="text-[13px] font-bold uppercase tracking-widest text-[#666] mb-3">Vantagens</h2>
          <h3 className="text-3xl font-heading font-extrabold text-neutral-900 border-b-2 border-[#E10098] w-min pb-2 whitespace-nowrap">Por que escolher a Plus?</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((adv, i) => (
            <div key={i} className="flex flex-col items-start p-6 bg-neutral-50 rounded-xl border border-neutral-200">
              <div className="w-12 h-12 bg-[#E10098]/10 rounded-full flex items-center justify-center text-[#E10098] mb-4">
                <adv.icon className="w-5 h-5 stroke-[2.5px]" />
              </div>
              <h4 className="text-[19px] font-extrabold text-neutral-900 mb-2">{adv.title}</h4>
              <p className="text-neutral-600 font-medium text-[15px] leading-relaxed">{adv.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
