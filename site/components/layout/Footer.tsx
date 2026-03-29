import Link from "next/link";
import { Wifi, MapPin, Phone, Mail, Share2 } from "lucide-react";
import { AnimatedLogo } from "@/components/ui/AnimatedLogo";

export function Footer() {
  return (
    <footer className="bg-[#04080e] border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <AnimatedLogo />
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Internet de verdade. Velocidade que você sente. Conectando pessoas e negócios com tecnologia de fibra óptica.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 font-bold text-xs uppercase tracking-widest">
                IN
              </a>
              <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 font-bold text-xs uppercase tracking-widest">
                FB
              </a>
              <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:bg-primary hover:border-primary hover:text-white transition-all duration-300">
                <Share2 className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold text-lg text-white mb-6">Planos</h4>
            <ul className="space-y-4">
              <li><Link href="/planos" className="text-white/50 hover:text-primary hover:translate-x-1 block transition-all text-sm">Residencial</Link></li>
              <li><Link href="/planos" className="text-white/50 hover:text-primary hover:translate-x-1 block transition-all text-sm">Comercial</Link></li>
              <li><Link href="/planos" className="text-white/50 hover:text-primary hover:translate-x-1 block transition-all text-sm">Combo + Streaming</Link></li>
              <li><Link href="/cobertura" className="text-white/50 hover:text-primary hover:translate-x-1 block transition-all text-sm">Área de Cobertura</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg text-white mb-6">Suporte</h4>
            <ul className="space-y-4">
              <li><Link href="/duvidas" className="text-white/50 hover:text-primary hover:translate-x-1 block transition-all text-sm">Central de Ajuda</Link></li>
              <li><Link href="/area-do-assinante" className="text-white/50 hover:text-primary hover:translate-x-1 block transition-all text-sm">2ª Via de Boleto</Link></li>
              <li><Link href="/teste-velocidade" className="text-white/50 hover:text-primary hover:translate-x-1 block transition-all text-sm">Teste de Velocidade</Link></li>
              <li><Link href="/politica-de-privacidade" className="text-white/50 hover:text-primary hover:translate-x-1 block transition-all text-sm">Privacidade</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg text-white mb-6">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-white/50 leading-relaxed">Rua Dr. Figueiredo, nº 333 lj B<br/>Centro - Valença, RJ</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm text-white/50">(24) 98129-0647 / 98120-6500</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm text-white/50">atendimento@plustv.tv.br</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-white/40">© {new Date().getFullYear()} Plus Multiplayer Internet e TV LTDA.</p>
          <div className="flex gap-6">
            <span className="text-sm text-white/40">CNPJ: 08.580.493/0001-98</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
