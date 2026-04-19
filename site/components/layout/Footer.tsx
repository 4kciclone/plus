"use client";
import Link from "next/link";
import { Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-surface-container bg-white mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-8 py-12 max-w-7xl mx-auto">
        {/* Brand */}
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="text-lg font-black text-primary italic tracking-tighter font-heading">
            Plus Internet
          </Link>
          <p className="text-on-surface-variant text-sm leading-relaxed mt-4 max-w-xs">
            High-Velocity Connectivity para quem não aceita menos que o topo, fibra óptica de verdade.
          </p>
          <p className="font-heading text-sm text-on-surface-variant mt-4">
            © {new Date().getFullYear()} Plus Internet.
          </p>
        </div>

        {/* Empresa */}
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-on-surface mb-2">Empresa</h4>
          <Link href="/planos" className="text-on-surface-variant hover:text-primary text-sm transition-all">
            Planos
          </Link>
          <Link href="/cobertura" className="text-on-surface-variant hover:text-primary text-sm transition-all">
            Área de Cobertura
          </Link>
          <Link href="/duvidas" className="text-on-surface-variant hover:text-primary text-sm transition-all">
            FAQ
          </Link>
        </div>

        {/* Legal */}
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-on-surface mb-2">Legal</h4>
          <Link href="/politica-de-privacidade" className="text-on-surface-variant hover:text-primary text-sm transition-all">
            Privacidade
          </Link>
          <Link href="/politica-de-privacidade" className="text-on-surface-variant hover:text-primary text-sm transition-all">
            Termos de Uso
          </Link>
        </div>

        {/* Contato */}
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-on-surface mb-2">Contato</h4>
          <div className="flex items-center gap-2 text-on-surface-variant text-sm">
            <Phone className="w-4 h-4 text-primary" />
            <span>(24) 98129-0647</span>
          </div>
          <div className="flex items-center gap-2 text-on-surface-variant text-sm">
            <Mail className="w-4 h-4 text-primary" />
            <span>atendimento@plustv.tv.br</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-surface-container py-6 px-8 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-on-surface-variant text-xs">
          © {new Date().getFullYear()} Plus Multiplayer Internet e TV LTDA. CNPJ: 08.580.493/0001-98
        </p>
        <p className="text-on-surface-variant text-xs">
          High-Velocity Connectivity.
        </p>
      </div>
    </footer>
  );
}
