"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, MapPin, LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { AnimatedLogo } from "@/components/ui/AnimatedLogo";

const STATE_MAP: Record<string, string> = {
  "acre": "AC", "alagoas": "AL", "amapá": "AP", "amazonas": "AM", "bahia": "BA",
  "ceará": "CE", "distrito federal": "DF", "espírito santo": "ES", "goiás": "GO",
  "maranhão": "MA", "mato grosso": "MT", "mato grosso do sul": "MS", "minas gerais": "MG",
  "pará": "PA", "paraíba": "PB", "paraná": "PR", "pernambuco": "PE", "piauí": "PI",
  "rio de janeiro": "RJ", "rio grande do norte": "RN", "rio grande do sul": "RS",
  "rondônia": "RO", "roraima": "RR", "santa catarina": "SC", "são paulo": "SP",
  "sergipe": "SE", "tocantins": "TO",
};

function useGeolocation() {
  const [location, setLocation] = useState("Valença / RJ");
  const [loading, setLoading] = useState(false);

  const requestLocation = () => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=pt-BR`,
            { headers: { "User-Agent": "PlusInternet/1.0" } }
          );
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.village || data.address?.municipality || "Sua região";
          const stateName = (data.address?.state || "").toLowerCase();
          const stateCode = data.address?.state_code?.toUpperCase() || STATE_MAP[stateName] || "";
          setLocation(stateCode ? `${city} / ${stateCode}` : city);
        } catch {
          setLocation("Valença / RJ");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
      },
      { timeout: 8000 }
    );
  };

  return { location, loading, requestLocation };
}

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const { location, loading: geoLoading, requestLocation } = useGeolocation();

  const [activeSegment, setActiveSegment] = useState("residencial");

  // Track active segment from URL hash
  useEffect(() => {
    const updateActive = () => {
      const hash = window.location.hash;
      if (hash.includes("comercial")) setActiveSegment("comercial");
      else if (hash.includes("residencial")) setActiveSegment("residencial");
    };
    updateActive();
    window.addEventListener("hashchange", updateActive);
    return () => window.removeEventListener("hashchange", updateActive);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsMobileMenuOpen(false); }, [pathname]);

  const navLinks = [
    { label: "Planos de Fibra", href: "/#residencial" },
    { label: "Combos + TV", href: "/#combo" },
    { label: "Vantagens", href: "/#vantagens" },
    { label: "Cobertura", href: "/cobertura" },
    { label: "Dúvidas", href: "/duvidas" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 flex flex-col shadow-md">
      {/* Top Bar */}
      <div className="bg-[#111] border-b border-white/5 h-[40px] w-full hidden md:flex items-center justify-between px-6 lg:px-12 text-[11px] font-bold uppercase tracking-widest text-white/50">
        <div className="flex items-center gap-6 h-full">
          <Link 
            href="/#residencial" 
            onClick={() => setActiveSegment("residencial")}
            className={`h-full flex items-center border-b-[3px] transition-colors ${activeSegment === "residencial" ? "text-white border-primary" : "border-transparent hover:text-white hover:border-white/30"}`}
          >
            Residencial
          </Link>
          <Link 
            href="/#comercial" 
            onClick={() => setActiveSegment("comercial")}
            className={`h-full flex items-center border-b-[3px] transition-colors ${activeSegment === "comercial" ? "text-white border-primary" : "border-transparent hover:text-white hover:border-white/30"}`}
          >
            Comercial
          </Link>
        </div>
        <button
          onClick={requestLocation}
          className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors"
          title="Clique para detectar sua localização"
        >
          {geoLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <MapPin className="w-3.5 h-3.5" />
          )}
          <span>{location}</span>
        </button>
      </div>

      <div className="bg-[#080b12]/95 backdrop-blur-md h-[80px] w-full flex items-center justify-between px-6 lg:px-12 relative">
        <Link href="/" className="flex items-center z-10">
          <AnimatedLogo compact />
        </Link>
        
        <nav className="hidden lg:flex items-center gap-2 font-medium text-[15px] absolute left-1/2 -translate-x-1/2">
          {navLinks.map((item) => (
            <Link 
              key={item.label} 
              href={item.href} 
              className="px-4 py-2 text-white/90 hover:text-primary transition-colors font-bold rounded-full hover:bg-white/5"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 z-10">
          {user ? (
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/area-do-assinante"
                className="flex items-center gap-2 px-5 py-2 rounded-full border-2 border-primary/40 text-white font-bold text-sm hover:bg-primary/10 transition-colors"
              >
                <User className="w-4 h-4 text-primary" />
                {user.name.split(" ")[0]}
              </Link>
              <button
                onClick={logout}
                title="Sair"
                className="p-2 text-white/50 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <Link href="/login" className="text-white/80 hover:text-white font-bold text-sm transition-colors">
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className="flex items-center gap-2 h-10 px-6 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#c5007e] transition-colors"
              >
                Assinar agora
              </Link>
            </div>
          )}

          <button 
            className="md:hidden text-white/90 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0a0f18] border-t border-white/5 absolute top-full left-0 w-full h-[100vh] flex flex-col py-6 px-6 gap-6 overflow-y-auto">
          <button
            onClick={requestLocation}
            className="flex items-center text-white/50 gap-2 font-bold text-xs uppercase tracking-widest border-b border-white/5 pb-4"
          >
            {geoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
            <span>{location}</span>
          </button>
          
          <nav className="flex flex-col gap-5 text-lg font-bold text-white/90">
            {navLinks.map((item) => (
              <Link key={item.label} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="flex flex-col gap-3 mt-4 border-t border-white/5 pt-6">
            {user ? (
              <>
                <Link href="/area-do-assinante" className="w-full h-12 rounded-full bg-primary text-white font-bold flex items-center justify-center gap-2">
                  <User className="w-4 h-4" /> Minha área
                </Link>
                <button onClick={logout} className="w-full h-12 rounded-full border-2 border-white/10 text-white/70 font-bold flex items-center justify-center gap-2 hover:border-red-400 hover:text-red-400 transition-colors">
                  <LogOut className="w-4 h-4" /> Sair
                </button>
              </>
            ) : (
              <>
                <Link href="/cadastro" className="w-full h-12 rounded-full bg-primary text-white font-bold flex items-center justify-center">Assinar agora</Link>
                <Link href="/login" className="w-full h-12 rounded-full border-2 border-white/10 text-white font-bold flex items-center justify-center">Entrar</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
