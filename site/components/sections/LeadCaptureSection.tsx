"use client";
import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export function LeadCaptureSection() {
  const [form, setForm] = useState({ name: "", phone: "", bairro: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Olá! Sou ${form.name}, moro no bairro ${form.bairro} e meu telefone é ${form.phone}. Gostaria de ser Plus!`;
    window.open(`https://wa.me/5524981206500?text=${encodeURIComponent(text)}`, "_blank");
    setSent(true);
  };

  return (
    <section className="py-20 bg-[#080b12]" id="contato">
      <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
        <div className="bg-[#111827] rounded-3xl border border-white/5 overflow-hidden flex flex-col lg:flex-row">
          {/* Info */}
          <div className="lg:w-1/2 p-10 lg:p-14 flex flex-col justify-center">
            <span className="text-primary font-bold text-xs uppercase tracking-widest mb-4">Eu quero ser Plus!</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
              Fale com a gente em 1 clique
            </h2>
            <p className="text-white/50 text-lg leading-relaxed">
              Preencha seus dados abaixo — sem enrolação, sem cadastro longo. Nós te chamamos no WhatsApp para finalizar tudo rapidinho.
            </p>
          </div>

          {/* Form */}
          <div className="lg:w-1/2 p-10 lg:p-14 bg-[#0d1220]">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <CheckCircle2 className="w-16 h-16 text-green-400 mb-4" />
                <h3 className="text-2xl font-extrabold text-white mb-2">Mensagem enviada!</h3>
                <p className="text-white/50">Confira sua conversa no WhatsApp.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-white/70 mb-1.5">Seu nome</label>
                  <input
                    type="text"
                    placeholder="João Silva"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border-2 border-white/10 text-white font-medium text-[15px] bg-transparent focus:outline-none focus:border-primary transition-colors placeholder:text-white/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/70 mb-1.5">Telefone / WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="(24) 99999-9999"
                    required
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border-2 border-white/10 text-white font-medium text-[15px] bg-transparent focus:outline-none focus:border-primary transition-colors placeholder:text-white/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/70 mb-1.5">Bairro</label>
                  <input
                    type="text"
                    placeholder="Centro, Serra da Glória..."
                    required
                    value={form.bairro}
                    onChange={e => setForm({ ...form, bairro: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border-2 border-white/10 text-white font-medium text-[15px] bg-transparent focus:outline-none focus:border-primary transition-colors placeholder:text-white/20"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-12 rounded-full bg-primary text-white font-bold text-[15px] hover:bg-[#c5007e] transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Quero ser Plus!
                </button>
                <p className="text-white/20 text-xs text-center">Ao enviar, você será redirecionado ao WhatsApp da Plus.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
