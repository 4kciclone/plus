"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin, ChevronDown, Check, Loader2, Navigation } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "@/lib/location-context";

export function CitySelector() {
  const { city, stateCode, isValenca, loading, detectLocation, setCityManually } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/5 hover:text-white transition-all group border border-transparent hover:border-white/10"
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
        ) : (
          <MapPin className={`w-3.5 h-3.5 ${isValenca ? "text-primary" : "text-amber-400"}`} />
        )}
        <span className="text-[11px] font-bold uppercase tracking-widest transition-colors">
          {city} / {stateCode}
        </span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-72 bg-[#0d1117] border border-white/10 rounded-2xl shadow-2xl z-[100] overflow-hidden backdrop-blur-xl"
          >
            {/* Header / Info */}
            <div className="p-4 border-b border-white/5 bg-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Sua Localização</span>
                {isValenca ? (
                  <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[9px] font-black uppercase tracking-wider border border-green-500/20">
                    Área de Cobertura
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[9px] font-black uppercase tracking-wider border border-amber-500/20">
                    Breve em sua região
                  </span>
                )}
              </div>
              <p className="text-white font-bold text-sm">{city}, {stateCode}</p>
              {!isValenca && (
                <p className="text-[11px] text-white/50 mt-1 font-medium leading-relaxed">
                  Ainda não atendemos em {city}, mas você pode consultar a cobertura em Valença.
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="p-2">
              <button
                onClick={async () => {
                  await detectLocation();
                  setIsOpen(false);
                }}
                disabled={loading}
                className="w-full h-10 px-3 rounded-lg flex items-center gap-3 text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm font-bold group"
              >
                <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" /> : <Navigation className="w-3.5 h-3.5 text-primary" />}
                </div>
                Detectar Automaticamente
              </button>

              <div className="h-px bg-white/5 my-2 mx-2" />

              <div className="px-3 pb-2 pt-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/30 block mb-2">Cidades Atendidas</span>
                <button
                  onClick={() => {
                    setCityManually("Valença", "RJ");
                    setIsOpen(false);
                  }}
                  className={`w-full h-10 px-3 rounded-lg flex items-center justify-between transition-all text-sm font-bold ${isValenca ? "bg-primary/10 text-primary" : "text-white/70 hover:text-white hover:bg-white/5"}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${isValenca ? "bg-primary animate-pulse" : "bg-white/20"}`} />
                    Valença / RJ
                  </div>
                  {isValenca && <Check className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-[#080b12] p-3 border-t border-white/5">
              <a 
                href="/cobertura" 
                className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary-light flex items-center justify-center gap-2 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Ver Mapa de Cobertura Completo →
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
