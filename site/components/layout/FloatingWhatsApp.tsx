import { MessageCircle } from "lucide-react";

export function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/5524981206500"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-16 h-16 bg-success text-black rounded-full shadow-[0_0_20px_rgba(0,230,118,0.4)] hover:shadow-[0_0_40px_rgba(0,230,118,0.8)] hover:-translate-y-2 transition-all duration-300"
      aria-label="Fale conosco no WhatsApp"
    >
      <MessageCircle className="w-8 h-8" />
    </a>
  );
}
