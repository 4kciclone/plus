export function StatsSection() {
  return (
    <section className="py-8 bg-[#E10098] w-full">
      <div className="container mx-auto px-6 lg:px-12 flex flex-wrap items-center justify-around gap-6 text-white text-center">
        <div className="flex flex-col items-center">
          <span className="text-3xl font-extrabold">100%</span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-white/90">Fibra Óptica</span>
        </div>
        <div className="w-px h-10 bg-white/20 hidden md:block"></div>
        <div className="flex flex-col items-center">
          <span className="text-3xl font-extrabold">+10 Mil</span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-white/90">Regiões Atendidas</span>
        </div>
        <div className="w-px h-10 bg-white/20 hidden md:block"></div>
        <div className="flex flex-col items-center">
          <span className="text-3xl font-extrabold">24/7</span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-white/90">Atendimento Técnico</span>
        </div>
      </div>
    </section>
  );
}
