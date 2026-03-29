"use client";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { MapPin, CheckCircle2 } from "lucide-react";
import Link from "next/link";

// Leaflet must be rendered client-side only (no SSR)
const CoverageMap = dynamic(() => import("@/components/map/CoverageMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[480px] rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-neutral-500 text-sm font-medium">Carregando mapa...</p>
      </div>
    </div>
  ),
});

// Import leaflet CSS globally
import "leaflet/dist/leaflet.css";

const bairros = [
  "Água Fria", "Alicacio", "Aparecida", "Barroso", "Belo Horizonte", "Benfica",
  "Biquinha", "Carambita (Av Duque Costa)", "Centro", "Cruzeiro", "Fátima",
  "Jardim Dona Angelina", "Jardim Valença", "João Bonito (cond. Vieira)",
  "João Dias", "Laranjeiras", "Monte Belo", "Monte Douro", "Osório",
  "Parque Pentagna", "Ponte Funda", "Santa Cruz", "São Cristóvão",
  "São José das Palmeiras", "Serra da Glória", "Spalla 1", "Spalla 2",
  "Torres Homem", "Vadinho Fonseca", "Varginha"
];

export default function CoberturaPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F4F5F7] pt-[120px] pb-20">
        {/* Hero */}
        <div className="bg-[#080b12] py-12">
          <div className="container mx-auto px-6 lg:px-12 flex items-center gap-3">
            <MapPin className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-3xl font-extrabold text-white">Área de Cobertura</h1>
              <p className="text-white/50">Fibra óptica 100% em {bairros.length} bairros de Valença/RJ</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 lg:px-12 py-10">

          {/* Interactive Map */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-extrabold text-neutral-900">Mapa interativo</h2>
                <p className="text-sm text-neutral-500 font-medium mt-0.5">Clique em qualquer bairro no mapa para detalhes</p>
              </div>
              <span className="hidden sm:flex items-center gap-2 text-xs text-neutral-500 font-medium">
                <span className="w-3 h-3 rounded-full bg-primary inline-block" /> Cobertura ativa
              </span>
            </div>
            <CoverageMap />
          </div>

          {/* Bairros List */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="px-6 md:px-10 py-6 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-neutral-900">Bairros atendidos</h2>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">{bairros.length} regiões</span>
            </div>
            <div className="px-6 md:px-10 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-8">
              {bairros.map((bairro, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" strokeWidth={2.5} />
                  <span className="text-neutral-700 font-medium text-[15px]">{bairro}</span>
                </div>
              ))}
            </div>
            <div className="px-6 md:px-10 py-6 border-t border-neutral-100 bg-neutral-50 flex flex-col sm:flex-row items-center gap-4 justify-between">
              <p className="text-neutral-500 text-sm font-medium">Não encontrou seu bairro?</p>
              <a
                href="https://wa.me/5524981206500"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-colors"
              >
                Consultar cobertura via WhatsApp
              </a>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/#residencial" className="text-primary font-bold hover:underline">← Ver planos disponíveis</Link>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
