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
          <div className="flex flex-wrap justify-center md:justify-end gap-8 w-full md:w-auto">
            <div className="text-[#00CCFF] font-black text-2xl tracking-tighter italic">DISNEY+</div>
            <div className="text-white font-black text-2xl tracking-tighter italic">MAX</div>
            <div className="text-[#E10098] font-black text-2xl tracking-tighter italic">DEEZER</div>
            <div className="text-white font-black text-2xl tracking-tighter italic border-b-2 border-primary">PARAMOUNT+</div>
          </div>
        </div>
      </div>
    </section>
  );
}
