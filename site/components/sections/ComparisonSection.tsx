import { Check, X } from "lucide-react";

export function ComparisonSection() {
  const features = [
    { name: "Fibra Óptica Pura" },
    { name: "Streamings Inclusos" },
    { name: "Suporte em 24h" },
  ];

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1">
            <h2 className="text-4xl font-headline font-extrabold text-on-surface mb-6">Mais por muito menos</h2>
            <p className="text-on-surface-variant text-lg mb-8">Compare e veja por que a Plus Internet é a escolha inteligente para quem não abre mão de qualidade e preço justo.</p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low">
                <Check className="text-primary w-6 h-6" strokeWidth={3} />
                <span className="font-bold">Sem taxas escondidas</span>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low">
                <Check className="text-primary w-6 h-6" strokeWidth={3} />
                <span className="font-bold">Upgrade de velocidade anual</span>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full overflow-hidden rounded-xl shadow-2xl">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-primary text-on-primary">
                  <th className="p-5 font-headline font-bold">Vantagem</th>
                  <th className="p-5 font-headline font-bold text-center">Plus</th>
                  <th className="p-5 font-headline font-bold text-center opacity-70">Outros</th>
                </tr>
              </thead>
              <tbody className="bg-surface-container-lowest">
                {features.map((feature, i) => (
                  <tr key={i} className={i !== features.length - 1 ? "border-b border-surface-container" : ""}>
                    <td className="p-5 font-medium">{feature.name}</td>
                    <td className="p-5 text-center">
                      <Check className="text-primary w-6 h-6 mx-auto" strokeWidth={3} />
                    </td>
                    <td className="p-5 text-center">
                      <X className="text-on-surface-variant opacity-30 w-6 h-6 mx-auto" strokeWidth={3} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
