export function StreamingSection() {
  return (
    <section className="py-16 bg-[#111]">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="max-w-xl">
            <span className="text-[#E10098] font-bold text-xs uppercase tracking-widest">Entretenimento</span>
            <h2 className="text-3xl font-heading font-extrabold text-white mt-2 mb-4">Seus streamings favoritos já inclusos</h2>
            <p className="text-white/60 font-medium text-lg">Assinando os Combos de Fibra e TV da Plus, você leva conteúdo de ponta sem surpresas na fatura!</p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-10 opacity-70 grayscale hover:grayscale-0 transition-all duration-500 w-full md:w-auto">
            <div className="text-white font-extrabold text-2xl tracking-widest uppercase">MAX</div>
            <div className="text-white font-extrabold text-2xl tracking-widest uppercase">DEEZER</div>
            <div className="text-white font-extrabold text-2xl tracking-widest uppercase">PARAMOUNT+</div>
          </div>
        </div>
      </div>
    </section>
  );
}
