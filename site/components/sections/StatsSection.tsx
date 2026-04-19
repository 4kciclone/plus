import { Zap, Clock, Signal } from "lucide-react";

export function StatsSection() {
  const stats = [
    { icon: Clock, value: "2ms", label: "Latência Média" },
    { icon: Signal, value: "99.9%", label: "Uptime Garantido" },
    { icon: Zap, value: "100%", label: "Fibra Óptica Pura" },
  ];

  return (
    <section className="relative z-10 -mt-16 px-4 max-w-7xl mx-auto mb-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-8 shadow-[0_20px_40px_rgba(44,47,49,0.06)] flex flex-col items-center text-center kinetic-layer"
          >
            <stat.icon className="text-primary w-10 h-10 mb-4" strokeWidth={2} />
            <div className="text-4xl font-headline font-extrabold text-on-surface mb-1">
              {stat.value}
            </div>
            <p className="text-on-surface-variant font-medium">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
