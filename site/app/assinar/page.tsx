"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { subscribe, Plan } from "@/lib/api";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Check, QrCode, FileText, Loader2, ArrowLeft, ShieldCheck, MapPin } from "lucide-react";

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
      .then((r) => r.json())
      .then((data) => {
        setPlan(data);
        setLoading(false);
      })
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
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-on-surface mb-4">Nenhum plano selecionado</h1>
          <Link href="/planos" className="text-primary font-bold hover:underline">
            Ver planos disponíveis
          </Link>
        </div>
      </div>
    );
  }

  if (authLoading || loading || !user) {
    return null; /* Will show suspense fallback in AssinarPage */
  }

  if (success) {
    return (
      <div className="min-h-screen bg-surface kinetic-bg px-6 py-20 flex flex-col items-center justify-center">
        <div className="text-center max-w-lg bg-surface-container-lowest rounded-2xl shadow-ambient-lg p-12">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center text-success mx-auto mb-6">
            <Check className="w-10 h-10" strokeWidth={3} />
          </div>
          <h1 className="text-3xl font-extrabold font-heading tracking-tight text-on-surface mb-3">
            Assinatura realizada!
          </h1>
          <p className="text-on-surface-variant text-lg mb-2">
            Seu plano <strong className="text-on-surface">{plan?.name}</strong> foi contratado com sucesso.
          </p>
          <p className="text-outline text-sm mb-8">
            Nossa equipe entrará em contato para agendar a instalação no seu endereço.
          </p>
          <Link
            href="/area-do-assinante"
            className="inline-flex px-8 py-4 rounded-xl bg-primary text-on-primary font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20"
          >
            Ir para a Área do Assinante
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Minimal Transactional Header */}
      <header className="w-full bg-surface-container-lowest border-b border-surface-container">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <Link href="/planos" className="flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>
          <Link href="/" className="text-xl font-black text-primary italic tracking-tighter font-heading">
            Plus Internet
          </Link>
          <div className="flex items-center gap-2 text-xs font-bold text-success/80 bg-success/5 px-3 py-1.5 rounded-full border border-success/10">
            <ShieldCheck className="w-4 h-4 text-success" />
            <span className="hidden sm:inline uppercase tracking-widest">Ambiente Seguro</span>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-8">
        {/* Left Col: Forms (7 cols) */}
        <div className="lg:col-span-7 lg:w-[58%] order-2 lg:order-1">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold font-heading text-on-surface mb-2 tracking-tight">
              Finalizar Pedido
            </h1>
            <p className="text-on-surface-variant">
              Falta pouco. Complete os dados para agendar sua instalação.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Endereço */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-ambient p-8 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold font-heading text-on-surface">Endereço de Instalação</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-on-surface-variant ml-1">CEP</label>
                  <input
                    type="text"
                    placeholder="00000-000"
                    required
                    value={form.cep}
                    onChange={(e) => setForm({ ...form, cep: e.target.value })}
                    className="w-full bg-surface-container-low border-none rounded-[1rem] px-4 py-4 text-on-surface font-medium focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-on-surface-variant ml-1">Número</label>
                  <input
                    type="text"
                    placeholder="Ex: 333"
                    required
                    value={form.houseNumber}
                    onChange={(e) => setForm({ ...form, houseNumber: e.target.value })}
                    className="w-full bg-surface-container-low border-none rounded-[1rem] px-4 py-4 text-on-surface font-medium focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline"
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-on-surface-variant ml-1">Complemento / Referência</label>
                  <input
                    type="text"
                    placeholder="Casa fundos, próx ao mercado..."
                    value={form.reference}
                    onChange={(e) => setForm({ ...form, reference: e.target.value })}
                    className="w-full bg-surface-container-low border-none rounded-[1rem] px-4 py-4 text-on-surface font-medium focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline"
                  />
                </div>
              </div>
            </div>

            {/* Pagamento */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-ambient p-8 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold font-heading text-on-surface">Forma de Pagamento</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
                <label className={`relative z-10 flex cursor-pointer p-5 rounded-2xl border-2 transition-all ${
                    form.paymentMethod === "PIX" ? "border-primary bg-primary/5" : "border-surface-container hover:border-outline"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    className="peer sr-only"
                    checked={form.paymentMethod === "PIX"}
                    onChange={() => setForm({ ...form, paymentMethod: "PIX" })}
                  />
                  <div className="flex items-start gap-4">
                    <QrCode className={`w-8 h-8 ${form.paymentMethod === "PIX" ? "text-primary" : "text-outline"}`} />
                    <div>
                      <span className={`block font-bold mb-1 ${form.paymentMethod === "PIX" ? "text-primary" : "text-on-surface"}`}>PIX</span>
                      <span className="text-xs text-on-surface-variant leading-tight block">Código gerado instantaneamente</span>
                    </div>
                  </div>
                </label>

                <label className={`relative z-10 flex cursor-pointer p-5 rounded-2xl border-2 transition-all ${
                    form.paymentMethod === "BOLETO" ? "border-primary bg-primary/5" : "border-surface-container hover:border-outline"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    className="peer sr-only"
                    checked={form.paymentMethod === "BOLETO"}
                    onChange={() => setForm({ ...form, paymentMethod: "BOLETO" })}
                  />
                  <div className="flex items-start gap-4">
                    <FileText className={`w-8 h-8 ${form.paymentMethod === "BOLETO" ? "text-primary" : "text-outline"}`} />
                    <div>
                      <span className={`block font-bold mb-1 ${form.paymentMethod === "BOLETO" ? "text-primary" : "text-on-surface"}`}>Boleto</span>
                      <span className="text-xs text-on-surface-variant leading-tight block">Vencimento para 7 dias corridos</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 bg-error/10 border border-error/20 text-error rounded-xl text-sm font-medium">
                {error}
              </div>
            )}
          </form>
        </div>

        {/* Right Col: Order Summary (5 cols) -> Dark Theme */}
        <div className="lg:col-span-5 lg:w-[42%] order-1 lg:order-2">
          <div className="bg-slate-900 text-white rounded-3xl p-8 sticky top-6 shadow-2xl overflow-hidden">
            {/* Blurs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-800/50 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Resumo do Pedido</h2>
              
              <div className="mb-6">
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Plano Escolhido</p>
                <h3 className="text-4xl font-extrabold font-heading tracking-tight mb-2">{plan?.name}</h3>
                <div className="space-y-3 mt-6">
                  {plan?.features.split(",").map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                      <Check className="w-5 h-5 text-primary shrink-0" strokeWidth={3} />
                      {f.trim()}
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px w-full bg-slate-800 my-8" />

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Mensalidade</span>
                  <span className="font-bold">R$ {plan?.price.toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Taxa de Instalação</span>
                  <span className="font-bold text-success">Grátis</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Equipamento (Comodato)</span>
                  <span className="font-bold text-success">Grátis</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8 pt-6 border-t border-slate-800">
                <span className="text-slate-400 font-bold">Total Mensal</span>
                <div className="text-right flex items-baseline justify-end gap-1">
                  <span className="text-lg font-bold text-primary">R$</span>
                  <span className="text-5xl font-extrabold tracking-tight">{plan?.price.toFixed(2).split(".")[0]}</span>
                  <span className="text-xl font-bold text-primary">,{plan?.price.toFixed(2).split(".")[1] || "00"}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Concluindo pedido...</>
                ) : (
                  "Finalizar Assinatura"
                )}
              </button>

              <p className="text-center text-xs text-slate-500 mt-6 leading-relaxed">
                Ao finalizar, você concorda com nossos Termos de Contratação e autoriza a análise de viabilidade técnica.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AssinarPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-on-surface-variant font-medium">Carregando checkout...</p>
        </div>
      }
    >
      <AssinarContent />
    </Suspense>
  );
}
