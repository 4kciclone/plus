"use client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FaqSection } from "@/components/sections/FaqSection";
import { Phone, MessageCircle, Bot } from "lucide-react";
import Link from "next/link";

export default function DuvidasPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F4F5F7] pt-[120px] pb-20">
        <div className="bg-[#080b12] py-12">
          <div className="container mx-auto px-6 lg:px-12">
            <h1 className="text-3xl font-extrabold text-white mb-2">Central de Dúvidas</h1>
            <p className="text-white/50">Resolva problemas técnicos de forma inteligente com a Luna IA.</p>
          </div>
        </div>

        <div className="container mx-auto px-6 lg:px-12 py-10 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Options */}
            <div className="lg:col-span-1 space-y-4">
              <a href="https://wa.me/5524981206500" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 bg-white rounded-2xl border border-neutral-200 shadow-[0_4px_12px_rgba(0,0,0,0.03)] p-5 hover:border-[#25D366]/50 hover:shadow-[0_8px_24px_rgba(37,211,102,0.1)] transition-all group">
                <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366] shrink-0 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-extrabold text-neutral-900 text-[15px]">WhatsApp</p>
                  <p className="text-xs text-neutral-500 font-medium">(24) 98120‑6500</p>
                </div>
              </a>

              <a href="tel:+5524981206500"
                className="flex items-center gap-4 bg-white rounded-2xl border border-neutral-200 shadow-[0_4px_12px_rgba(0,0,0,0.03)] p-5 hover:border-primary/50 hover:shadow-[0_8px_24px_rgba(255,0,128,0.1)] transition-all group">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-extrabold text-neutral-900 text-[15px]">Ligar</p>
                  <p className="text-xs text-neutral-500 font-medium">(24) 98120‑6500</p>
                </div>
              </a>

              <Link href="/teste-velocidade"
                className="flex items-center gap-4 bg-white rounded-2xl border border-neutral-200 shadow-[0_4px_12px_rgba(0,0,0,0.03)] p-5 hover:border-blue-500/50 hover:shadow-[0_8px_24px_rgba(59,130,246,0.1)] transition-all group">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-110 transition-transform">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="M12 12L15 8"/><circle cx="12" cy="12" r="10"/></svg>
                </div>
                <div>
                  <p className="font-extrabold text-neutral-900 text-[15px]">Teste de Velocidade</p>
                  <p className="text-xs text-neutral-500 font-medium">Meça sua internet</p>
                </div>
              </Link>

              {/* AI Banner */}
              <button 
                onClick={() => window.dispatchEvent(new Event('open-luna-chat'))}
                className="w-full text-left bg-gradient-to-br from-[#FF0080]/5 to-[#9D00FF]/5 border border-[#FF0080]/20 rounded-2xl p-5 shadow-[0_4px_12px_rgba(255,0,128,0.05)] hover:border-[#FF0080]/50 hover:shadow-[0_8px_24px_rgba(255,0,128,0.15)] transition-all group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF0080] to-[#9D00FF] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-extrabold text-neutral-900 text-[15px]">Luna — IA da Plus</p>
                    <p className="text-[10px] text-primary font-bold uppercase tracking-[0.15em]">Diagnóstico automático</p>
                  </div>
                </div>
                <p className="text-xs text-neutral-600 font-medium leading-relaxed mt-3">
                  Para problemas técnicos, a Luna verifica sua conexão em tempo real antes de abrir o chamado.
                </p>
              </button>
            </div>

            {/* FAQ Form Integration Area */}
            <div className="lg:col-span-2">
               <div className="bg-white/0 p-0 h-full">                 
                 {/* Re-use the existing FAQ Section but force it into this container */}
                 <div className="faq-container-override w-full">
                    <FaqSection />
                 </div>
               </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
