export function TestimonialSection() {
  return (
    <section className="py-20 bg-[#F4F5F7]">
      <div className="container mx-auto px-6 lg:px-12 text-left md:text-center">
        <h2 className="text-[13px] font-bold uppercase tracking-widest text-[#666] mb-3">Avaliações</h2>
        <h3 className="text-3xl font-heading font-extrabold text-neutral-900 mb-12">O que dizem de nós</h3>
        
        <div className="flex flex-col lg:flex-row justify-center gap-6 max-w-5xl mx-auto">
          {[
            { text: "Instalação perfeita e internet veloz toda a semana. A jogatina não cai nunca. Achei fantástico!", name: "Lucas M.", role: "Assinante 500 Mega" },
            { text: "Melhor custo-benefício da região. A equipe técnica é ágil e resolve tudo rápido pelo WhatsApp.", name: "Ana P.", role: "Assinante 800 Mega" },
          ].map((t, i) => (
            <div key={i} className="flex-1 bg-white border border-neutral-200 p-8 rounded-2xl text-left shadow-sm">
              <div className="flex items-center gap-1 mb-5 text-[#E10098]">
                <span className="text-2xl">★</span><span className="text-2xl">★</span><span className="text-2xl">★</span><span className="text-2xl">★</span><span className="text-2xl">★</span>
              </div>
              <p className="text-neutral-700 italic text-lg mb-6 leading-relaxed">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500 font-bold">{t.name[0]}</div>
                <div>
                    <div className="font-extrabold text-neutral-900">{t.name}</div>
                    <div className="text-[13px] font-medium text-neutral-500 uppercase tracking-wide mt-0.5">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
