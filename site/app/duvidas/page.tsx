"use client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Phone, MessageCircle, Bot, ArrowRight, Wrench } from "lucide-react";
import Link from "next/link";
import { FaqSection } from "@/components/sections/FaqSection";

export default function DuvidasPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full pt-32 pb-20">
        {/* Hero */}
        <section className="px-6 max-w-7xl mx-auto mb-20">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-extrabold font-heading text-on-surface tracking-tight leading-tight mb-6">
              Como podemos <span className="text-primary italic">acelerar</span> sua solução hoje?
            </h1>
            <p className="text-xl text-on-surface-variant leading-relaxed">
              Respostas rápidas para problemas comuns ou atendimento humano e IA para resolver o impossível.
            </p>
          </div>
        </section>

        {/* Quick Actions Bento Grid */}
        <section className="px-6 max-w-7xl mx-auto mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Luna AI Card (Featured) */}
            <button 
              onClick={() => window.dispatchEvent(new Event('open-luna-chat'))}
              className="md:col-span-1 bg-primary text-on-primary rounded-2xl p-8 flex flex-col justify-between text-left hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 relative overflow-hidden group min-h-[220px]"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center relative">
                    <Bot className="w-6 h-6 text-white" />
                    {/* Pulsing indicator */}
                    <span className="absolute top-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-primary animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-none">Luna IA</h3>
                    <span className="text-[10px] font-black uppercase tracking-widest text-on-primary/70">Online agora</span>
                  </div>
                </div>
                <h4 className="text-2xl font-black font-heading mb-2 italic">Assistente Virtual</h4>
                <p className="text-on-primary/80 text-sm leading-relaxed">
                  Diagnóstico de rede automático em menos de 1 minuto.
                </p>
              </div>
            </button>

            {/* WhatsApp Card */}
            <a 
              href="https://wa.me/5524981206500" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-surface-container-lowest text-on-surface rounded-2xl p-8 flex flex-col justify-between shadow-ambient hover:-translate-y-2 transition-all min-h-[220px]"
            >
              <div>
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center text-success mb-6">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold font-heading mb-2">WhatsApp</h4>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-4">
                  Fale com um atendente real na nossa central da sua região.
                </p>
              </div>
              <span className="font-bold text-primary flex items-center gap-2 text-sm">
                (24) 98120-6500 <ArrowRight className="w-4 h-4" />
              </span>
            </a>

            {/* Phone Card */}
            <a 
              href="tel:+5524981206500"
              className="bg-surface-container-lowest text-on-surface rounded-2xl p-8 flex flex-col justify-between shadow-ambient hover:-translate-y-2 transition-all min-h-[220px]"
            >
              <div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                  <Phone className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold font-heading mb-2">Central de Voz</h4>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-4">
                  Suporte técnico e financeiro por telefone, 24 horas por dia.
                </p>
              </div>
              <span className="font-bold text-primary flex items-center gap-2 text-sm">
                Ligar Agora <ArrowRight className="w-4 h-4" />
              </span>
            </a>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-6 max-w-7xl mx-auto mb-24">
          <FaqSection />
        </section>

        {/* Support Banner CTA */}
        <section className="px-6 max-w-7xl mx-auto">
          <div className="bg-secondary text-on-secondary rounded-2xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-ambient-lg border border-secondary">
            <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute left-0 bottom-0 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 max-w-xl text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-extrabold font-heading mb-4">
                Ainda com problemas?
              </h2>
              <p className="text-on-secondary/80 text-lg leading-relaxed">
                Nossa equipe técnica atua diretamente na sua região. Abra um chamado no sistema e agende uma visita técnica sem custos.
              </p>
            </div>
            
            <div className="relative z-10 shrink-0">
              <Link
                href="/login?redirect=/area-do-assinante"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-secondary rounded-xl font-bold hover:scale-105 active:scale-95 transition-transform shadow-xl"
              >
                <Wrench className="w-5 h-5" /> Abrir Chamado
              </Link>
            </div>
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
}
