"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  { name: "Carlos S.", bairro: "Centro", text: "A melhor internet que já tive. Estabilidade incrível para jogar online, o ping não passa de 15ms nas minhas partidas. Simplesmente outro nível, não troco por nenhuma grande.", rating: 5 },
  { name: "Mariana F.", bairro: "Jardim das Flores", text: "Suporte super rápido! Diferente das outras operadoras que te deixam horas na linha, a Plus resolveu meu problema pelo WhatsApp em 10 minutos. Atendimento humanizado e perfeito.", rating: 5 },
  { name: "Roberto M.", bairro: "Vila Nova", text: "Trabalho em home office e a conexão não cai de jeito nenhum. A velocidade de upload é essencial pro meu trabalho como designer, e a Plus entrega exatamente o que promete no contrato.", rating: 5 },
];

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-32 container mx-auto px-6 relative overflow-hidden">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 tracking-tight">Quem usa, recomenda</h2>
        <p className="text-white/60 text-lg max-w-2xl mx-auto">A satisfação dos nossos clientes é o nosso maior prêmio. Veja de quem já vive a experiência Plus na região.</p>
      </div>

      <div className="max-w-5xl mx-auto relative px-4">
        <div className="bg-surface/30 border border-white/5 backdrop-blur-xl rounded-[2rem] p-10 md:p-16 text-center relative shadow-2xl transition-all duration-500">
          <Quote className="w-24 h-24 text-white/5 absolute -top-4 -left-4 -rotate-12" />
          
          <div className="flex justify-center gap-1.5 mb-8">
            {[...Array( testimonials[current].rating )].map((_, i) => (
              <Star key={i} className="w-7 h-7 fill-success text-success filter drop-shadow-[0_0_10px_rgba(0,230,118,0.5)]" />
            ))}
          </div>
          
          <p className="text-2xl md:text-4xl font-medium text-white/90 leading-snug md:leading-normal mb-12 italic tracking-tight min-h-[160px] md:min-h-[120px] flex items-center justify-center">
            "{testimonials[current].text}"
          </p>
          
          <div>
            <div className="font-heading font-bold text-xl mb-1">{testimonials[current].name}</div>
            <div className="text-white/40 text-sm uppercase tracking-widest font-semibold">Cliente em {testimonials[current].bairro}</div>
          </div>
        </div>
        
        <div className="flex justify-center gap-4 mt-10">
          <button onClick={prev} className="w-14 h-14 rounded-full border border-white/10 bg-surface/50 flex items-center justify-center text-white/50 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={next} className="w-14 h-14 rounded-full border border-white/10 bg-surface/50 flex items-center justify-center text-white/50 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
