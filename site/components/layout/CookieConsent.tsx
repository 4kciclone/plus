"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Cookie } from "lucide-react";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("plus-cookie-consent");
    if (!consent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("plus-cookie-consent", "accepted");
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem("plus-cookie-consent", "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[60] p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-neutral-200 shadow-xl p-6 md:flex md:items-center md:gap-6">
        <div className="flex items-start gap-3 flex-1 mb-4 md:mb-0">
          <Cookie className="w-6 h-6 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-neutral-900 font-bold text-sm mb-1">Nós usamos cookies 🍪</p>
            <p className="text-neutral-500 text-[13px] leading-relaxed">
              Utilizamos cookies para melhorar sua experiência de navegação, personalizar conteúdo e analisar o tráfego do site. 
              Ao clicar em &quot;Aceitar&quot;, você concorda com o uso de cookies conforme nossa{" "}
              <Link href="/politica-de-privacidade" className="text-primary font-bold hover:underline">
                Política de Privacidade
              </Link>.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={reject}
            className="px-5 py-2.5 rounded-full border-2 border-neutral-200 text-neutral-700 font-bold text-sm hover:border-neutral-300 transition-colors"
          >
            Rejeitar
          </button>
          <button
            onClick={accept}
            className="px-5 py-2.5 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-colors"
          >
            Aceitar
          </button>
        </div>
        <button onClick={reject} className="absolute top-3 right-3 md:hidden text-neutral-400 hover:text-neutral-600">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
