import { Gamepad2, Wifi, Monitor, Briefcase } from "lucide-react";

export function AdvantagesSection() {
  return (
    <section className="py-24 bg-surface" id="vantagens">
      <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold font-heading tracking-tight text-on-surface">
            A revolução da sua conexão
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ minHeight: "500px" }}>
          {/* Card 1: Large — Work From Home (col-span-2) */}
          <div className="md:col-span-2 text-white rounded-xl p-10 flex flex-col justify-end relative overflow-hidden min-h-[280px] group bg-secondary bg-cover bg-center" style={{ backgroundImage: "url('/images/lote_6.png')" }}>
            <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/70 to-secondary/30 z-10" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl z-10" />
            <div className="relative z-20">
              <h3 className="text-2xl md:text-3xl font-extrabold font-heading mb-3 italic">
                Trabalhe de casa sem travar
              </h3>
              <p className="text-white/80 max-w-md leading-relaxed font-medium">
                Estabilidade absoluta para reuniões de vídeo e transferências de arquivos pesados.
              </p>
            </div>
          </div>

          {/* Card 2: Ping Ultra-Baixo */}
          <div className="bg-primary text-on-primary rounded-xl p-8 flex flex-col items-center justify-center text-center min-h-[280px] relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-extrabold font-heading italic mb-2">
                Ping Ultra-Baixo
              </h3>
              <p className="text-on-primary/70 text-sm leading-relaxed">
                Ideal para gamers que buscam a vitória em cada milissegundo.
              </p>
            </div>
          </div>

          {/* Card 3: Wi-Fi 6 Mesh */}
          <div className="bg-surface-container-lowest rounded-xl p-8 flex flex-col items-start justify-center min-h-[220px] shadow-ambient">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-5">
              <Wifi className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-extrabold font-heading text-on-surface mb-2">
              Wi-Fi 6 Mesh
            </h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Sinal potente em cada centímetro da sua casa, sem pontos cegos.
            </p>
          </div>

          {/* Card 4: Large — Streaming 4K & 8K (col-span-2) */}
          <div className="md:col-span-2 text-white rounded-xl p-10 flex flex-col justify-end relative overflow-hidden min-h-[220px] bg-tertiary bg-cover bg-center" style={{ backgroundImage: "url('/images/lote_7.png')" }}>
            <div className="absolute inset-0 bg-gradient-to-t from-tertiary/90 via-tertiary/70 to-tertiary/30 z-10" />
            <div className="absolute top-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl z-10" />
            <div className="relative z-20 flex items-end justify-between gap-8">
              <div>
                <h3 className="text-2xl md:text-3xl font-extrabold font-heading italic mb-3">
                  Diversão em 4K e 8K
                </h3>
                <p className="text-white/80 max-w-md leading-relaxed font-medium">
                  Streaming em altíssima definição em múltiplas telas simultâneas sem buffering.
                </p>
              </div>
              <div className="hidden md:flex w-16 h-16 bg-white/20 backdrop-blur rounded-full items-center justify-center shrink-0">
                <Monitor className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
