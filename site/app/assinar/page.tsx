"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { subscribe, Plan } from "@/lib/api";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Check, QrCode, FileText, Loader2 } from "lucide-react";

import { Suspense } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function AssinarContent() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("plano");

  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    cep: "",
    houseNumber: "",
    reference: "",
    paymentMethod: "PIX" as "PIX" | "BOLETO",
  });

  useEffect(() => {
    if (!planId) return;
    fetch(`${API}/plans/${planId}`)
      .then(r => r.json())
      .then(data => { setPlan(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [planId]);

  useEffect(() => {
    if (!authLoading && !user && planId) {
      router.push(`/login?redirect=/assinar?plano=${planId}`);
    }
  }, [authLoading, user, planId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !planId) return;
    setSubmitting(true);
    setError("");
    try {
      await subscribe({ planId, ...form }, token);
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao assinar plano.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!planId) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#F4F5F7] pt-[120px] pb-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-neutral-900 mb-4">Nenhum plano selecionado</h1>
            <Link href="/#planos" className="text-primary font-bold hover:underline">Ver planos disponíveis</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (authLoading || loading || !user) return null;

  if (success) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#F4F5F7] pt-[120px] pb-20 flex items-center justify-center px-4">
          <div className="text-center max-w-lg bg-white rounded-2xl border border-black/5 shadow-sm p-12">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-600 mx-auto mb-6">
              <Check className="w-10 h-10" strokeWidth={3} />
            </div>
            <h1 className="text-3xl font-extrabold text-neutral-900 mb-3">Assinatura realizada!</h1>
            <p className="text-neutral-500 text-lg mb-2">Seu plano <strong className="text-neutral-900">{plan?.name}</strong> foi contratado com sucesso.</p>
            <p className="text-neutral-400 text-sm mb-8">Nossa equipe entrará em contato para agendar a instalação no seu endereço.</p>
            <Link href="/area-do-assinante" className="inline-block px-8 py-3 rounded-full bg-primary text-white font-bold hover:bg-primary-dark transition-colors">
              Ir para minha área
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const inputClass = "w-full h-12 px-4 rounded-xl border-2 border-neutral-200 text-neutral-900 font-medium text-[15px] focus:outline-none focus:border-primary transition-colors";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F4F5F7] pt-[120px] pb-20">
        <div className="container mx-auto px-6 lg:px-12 py-10 max-w-4xl">
          <h1 className="text-3xl font-extrabold text-neutral-900 mb-2">Finalizar assinatura</h1>
          <p className="text-neutral-500 mb-8">Complete as informações para ativar seu plano.</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 sticky top-[140px]">
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">Plano selecionado</p>
                <h3 className="text-xl font-extrabold text-neutral-900 mb-1">{plan?.name}</h3>
                <p className="text-primary font-extrabold text-2xl mb-4">
                  R$ {plan?.price.toFixed(2).replace(".", ",")}<span className="text-neutral-400 text-sm font-medium">/mês</span>
                </p>
                <div className="space-y-2 mb-4">
                  {plan?.features.split(",").map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-neutral-600">
                      <Check className="w-4 h-4 text-green-500" strokeWidth={3} />
                      {f.trim()}
                    </div>
                  ))}
                </div>
                <Link href="/#planos" className="text-primary text-xs font-bold hover:underline">← Trocar plano</Link>
              </div>
            </div>

            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
                  <h2 className="text-lg font-extrabold text-neutral-900 mb-5">Endereço de instalação</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-neutral-700 mb-1.5">CEP</label>
                      <input type="text" placeholder="27600-000" required value={form.cep}
                        onChange={e => setForm({ ...form, cep: e.target.value })} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-neutral-700 mb-1.5">Número da casa/apto</label>
                      <input type="text" placeholder="333" required value={form.houseNumber}
                        onChange={e => setForm({ ...form, houseNumber: e.target.value })} className={inputClass} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-bold text-neutral-700 mb-1.5">Ponto de referência (opcional)</label>
                    <input type="text" placeholder="Próximo ao mercado, casa azul..." value={form.reference}
                      onChange={e => setForm({ ...form, reference: e.target.value })} className={inputClass} />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
                  <h2 className="text-lg font-extrabold text-neutral-900 mb-5">Forma de pagamento</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button type="button" onClick={() => setForm({ ...form, paymentMethod: "PIX" })}
                      className={`flex items-center gap-4 p-5 rounded-xl border-2 transition-all ${
                        form.paymentMethod === "PIX" ? "border-primary bg-primary/5" : "border-neutral-200 hover:border-neutral-300"
                      }`}>
                      <QrCode className={`w-8 h-8 ${form.paymentMethod === "PIX" ? "text-primary" : "text-neutral-400"}`} />
                      <div className="text-left">
                        <p className="font-bold text-neutral-900">Pix</p>
                        <p className="text-xs text-neutral-500">Código gerado na fatura</p>
                      </div>
                    </button>
                    <button type="button" onClick={() => setForm({ ...form, paymentMethod: "BOLETO" })}
                      className={`flex items-center gap-4 p-5 rounded-xl border-2 transition-all ${
                        form.paymentMethod === "BOLETO" ? "border-primary bg-primary/5" : "border-neutral-200 hover:border-neutral-300"
                      }`}>
                      <FileText className={`w-8 h-8 ${form.paymentMethod === "BOLETO" ? "text-primary" : "text-neutral-400"}`} />
                      <div className="text-left">
                        <p className="font-bold text-neutral-900">Boleto</p>
                        <p className="text-xs text-neutral-500">Vencimento em 7 dias</p>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                  <p className="text-blue-800 font-bold text-sm mb-1">📅 Sobre a instalação</p>
                  <p className="text-blue-700 text-sm leading-relaxed">
                    Após confirmar sua assinatura, nossa equipe técnica entrará em contato para agendar o melhor dia e horário para a instalação da fibra óptica no seu endereço.
                  </p>
                </div>

                {error && (
                  <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">{error}</div>
                )}

                <button type="submit" disabled={submitting}
                  className="w-full h-14 rounded-full bg-primary text-white font-bold text-lg hover:bg-primary-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {submitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Processando...</>
                  ) : (
                    `Confirmar assinatura — R$ ${plan?.price.toFixed(2).replace(".", ",")}/mês`
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function AssinarPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F4F5F7] pt-[120px] pb-20 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-neutral-500 font-medium">Carregando checkout...</p>
      </div>
    }>
      <AssinarContent />
    </Suspense>
  );
}
