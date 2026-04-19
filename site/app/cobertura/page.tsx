"use client";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { MapPin, CheckCircle2, Search, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Leaflet must be rendered client-side only (no SSR)
const CoverageMap = dynamic(() => import("@/components/map/CoverageMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] rounded-2xl bg-surface-container-high flex flex-col items-center justify-center animate-pulse">
      <MapPin className="w-8 h-8 text-outline mb-3 opacity-50" />
      <p className="text-on-surface-variant text-sm font-bold uppercase tracking-widest">Carregando Mapa...</p>
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
  const [search, setSearch] = useState("");

  const filteredBairros = bairros.filter(b => b.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Hero Section */}
          <div className="mb-12 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 text-success text-xs font-bold uppercase tracking-widest mb-6">
              <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
              100% Fibra Óptica Ativa
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold font-heading text-on-surface tracking-tight mb-4">
              Internet que chega até <span className="text-primary italic">você.</span>
            </h1>
            <p className="text-xl text-on-surface-variant leading-relaxed">
              Atendemos dezenas de bairros em Valença/RJ com a infraestrutura mais robusta da região. Explore o mapa ou busque seu CEP.
            </p>
          </div>

          {/* Main Grid: Map + Bairros */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[700px] mb-20">
            {/* Map Area (8 cols) */}
            <div className="lg:col-span-8 bg-surface-container-lowest rounded-2xl shadow-ambient overflow-hidden relative">
              {/* CoverageMap component spans full height/width */}
              <div className="absolute inset-0 z-0">
                 <CoverageMap />
              </div>
              
              {/* Floating Map Header */}
              <div className="absolute top-6 left-6 right-6 z-10 flex items-center justify-between pointer-events-none">
                <div className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg border border-white/20 pointer-events-auto">
                  <h2 className="text-lg font-bold font-heading">Mapa de Operação</h2>
                  <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest mt-1">Valença — RJ</p>
                </div>
              </div>
            </div>

            {/* Sidebar Bairros (4 cols) */}
            <div className="lg:col-span-4 bg-surface-container-lowest rounded-2xl shadow-ambient flex flex-col overflow-hidden">
              <div className="p-6 border-b border-surface-container">
                <h3 className="font-bold text-lg font-heading mb-4 text-on-surface">Bairros Atendidos</h3>
                
                {/* Search Input */}
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
                  <input
                    type="text"
                    placeholder="Buscar bairro..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-surface-container-low border-none rounded-xl pl-12 pr-4 py-3 text-sm text-on-surface font-bold focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline/70"
                  />
                </div>
              </div>

              {/* Scrollable List */}
              <div className="flex-1 overflow-y-auto no-scrollbar p-6 bg-surface-container-lowest">
                {filteredBairros.length === 0 ? (
                  <div className="text-center text-on-surface-variant py-10 font-bold">
                    Nenhum bairro encontrado.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredBairros.map((bairro, i) => (
                      <div 
                        key={i} 
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 transition-colors group cursor-default"
                      >
                        <CheckCircle2 className="w-5 h-5 text-success shrink-0" strokeWidth={3} />
                        <span className="text-on-surface font-bold text-sm group-hover:text-primary transition-colors">{bairro}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 bg-surface-container-low border-t border-surface-container">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3 text-center">
                  Não achou seu bairro?
                </p>
                <a
                  href="https://wa.me/5524981206500"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-on-surface text-surface py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-transform"
                >
                  Consultar Viabilidade <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
