"use client";
import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export function LeadCaptureSection() {
  const [form, setForm] = useState({ name: "", phone: "", cep: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Olá! Sou ${form.name}, meu CEP é ${form.cep} e meu telefone é ${form.phone}. Gostaria de ser Plus!`;
    window.open(`https://wa.me/5524981206500?text=${encodeURIComponent(text)}`, "_blank");
    setSent(true);
  };

  return (
    <section className="py-24 bg-surface-container-low" id="contato">
      <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold font-heading tracking-tight text-on-surface mb-4">
            Consulte Disponibilidade
          </h2>
          <p className="text-on-surface-variant text-lg max-w-xl mx-auto">
            Deixe seus dados e nossa equipe entrará em contato com a melhor oferta para você.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-surface-container-lowest rounded-xl p-8 md:p-12 shadow-ambient">
          {sent ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-extrabold text-on-surface mb-2 font-heading">
                Mensagem enviada!
              </h3>
              <p className="text-on-surface-variant">
                Confira sua conversa no WhatsApp.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-on-surface-variant ml-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    placeholder="Seu nome"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-surface-container-highest border-none rounded-[1rem] px-4 py-4 text-on-surface font-medium focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-on-surface-variant ml-1">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="(00) 00000-0000"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-surface-container-highest border-none rounded-[1rem] px-4 py-4 text-on-surface font-medium focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-semibold text-on-surface-variant ml-1">
                    CEP da Instalação
                  </label>
                  <input
                    type="text"
                    placeholder="00000-000"
                    required
                    value={form.cep}
                    onChange={(e) => setForm({ ...form, cep: e.target.value })}
                    className="w-full bg-surface-container-highest border-none rounded-[1rem] px-4 py-4 text-on-surface font-medium focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline"
                  />
                </div>
                <button
                  type="submit"
                  className="px-10 py-4 rounded-xl bg-primary text-on-primary font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Send className="w-4 h-4" />
                  Verificar
                </button>
              </div>

              <p className="text-outline text-xs text-center pt-2">
                Ao enviar, você será redirecionado ao WhatsApp da Plus.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
