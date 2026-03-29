"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "luna" | "user";
  options?: string[]; // Quick action chips
  widget?: "upgrade_card"; // Special UI widgets
}

export function LunaChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: "1", 
      text: "Olá! Eu sou a Luna, a IA da Plus Internet. Como posso melhorar o seu dia hoje?", 
      sender: "luna",
      options: [
        "Sem conexão com a internet",
        "Internet lenta",
        "Queda intermitente",
        "Solicitar mudança de plano",
        "Dúvida sobre fatura"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Listen for the custom event to open the chat
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-luna-chat", handleOpen);
    return () => window.removeEventListener("open-luna-chat", handleOpen);
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = (textInput?: string) => {
    const textToSend = textInput || inputValue;
    if (!textToSend.trim()) return;

    const newUserMsg: Message = { id: Date.now().toString(), text: textToSend, sender: "user" };
    setMessages((prev) => {
      // Remove options from previous messages when user replies
      const updatedMessages = prev.map(m => ({ ...m, options: undefined }));
      return [...updatedMessages, newUserMsg];
    });
    setInputValue("");

    // Transactional State Machine (Mock)
    setTimeout(() => {
      if (textToSend === "Solicitar mudança de plano") {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          text: "Excelente! Notei que seu plano atual é de 500 MEGA. Deseja fazer um UPGRADE para nossa conexão premium de 1 GIGA (R$199,90/mês) ou deseja ver opções de downgrade?",
          sender: "luna",
          options: ["Quero fazer o Upgrade (1 GIGA)", "Ver todas as opções"]
        }]);
      } else if (textToSend === "Quero fazer o Upgrade (1 GIGA)") {
         setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          text: "Pronto! Upgrade realizado com sucesso no nosso sistema ERP. O novo perfil de 1 GIGA (+ Paramount e Max) já está provisionado no seu roteador. Mais alguma coisa?",
          sender: "luna",
          widget: "upgrade_card"
        }]);
      } else {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          text: "Estou realizando um diagnóstico no seu contrato agora mesmo usando nossa integração Mikrotik/OLT. Aguarde um instante...",
          sender: "luna"
        }]);
      }
    }, 1000);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            key="luna-chat"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[550px] max-h-[85vh] bg-[#0A0A0B]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="h-20 bg-gradient-to-r from-[#FF0080]/10 to-[#E10098]/10 border-b border-white/5 px-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF0080] to-[#E10098] flex items-center justify-center shadow-[0_0_20px_rgba(255,0,128,0.4)]">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#00E676] border-2 border-[#0A0A0B]" />
                </div>
                <div>
                  <h3 className="text-white font-black text-lg leading-tight flex items-center gap-1">Luna IA <Sparkles className="w-3 h-3 text-[#FF0080]" /></h3>
                  <p className="text-[#00E676] text-xs font-bold uppercase tracking-wider">Online</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                aria-label="Fechar chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className="flex flex-col w-full">
                  <div className={`flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                     <div className={`flex max-w-[85%] gap-3 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                        
                        {msg.sender === "luna" && (
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-auto">
                            <Bot className="w-4 h-4 text-primary" />
                          </div>
                        )}

                        <div className={`p-4 rounded-2xl ${
                          msg.sender === "user" 
                            ? "bg-white/10 text-white rounded-br-sm" 
                            : "bg-primary text-white rounded-bl-sm shadow-[0_0_15px_rgba(255,0,128,0.2)]"
                        }`}>
                           <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                           
                           {/* Special Native Widgets */}
                           {msg.widget === "upgrade_card" && (
                             <div className="mt-4 p-3 bg-black/30 rounded-xl border border-white/20">
                               <p className="text-[10px] text-white/60 uppercase tracking-widest font-bold mb-1">Novo Plano Ativo</p>
                               <h4 className="text-xl font-black text-white italic">1 GIGA <span className="text-[#00E676] text-xs">ONLINE</span></h4>
                               <p className="text-xs text-white/80 mt-1">Sua fatura foi reajustada automaticamente no Asaas.</p>
                             </div>
                           )}
                        </div>
                     </div>
                  </div>

                  {/* Suggestion Chips (only show for Luna and if no user reply exists yet) */}
                  {msg.options && msg.options.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 ml-11">
                      {msg.options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(option)}
                          className="px-4 py-2 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-bold hover:bg-primary hover:text-white transition-all shadow-[0_0_10px_rgba(255,0,128,0.1)] text-left"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#15151A] border-t border-white/5 shrink-0">
               <div className="relative flex items-center">
                 <input 
                   type="text"
                   value={inputValue}
                   onChange={(e) => setInputValue(e.target.value)}
                   onKeyDown={(e) => e.key === "Enter" && handleSend()}
                   placeholder="Digite como a Luna pode te ajudar..."
                   className="w-full h-12 bg-black/50 border border-white/10 rounded-full pl-6 pr-14 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors placeholder:text-white/30"
                 />
                 <button 
                   onClick={() => handleSend()}
                   disabled={!inputValue.trim()}
                   className="absolute right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                   aria-label="Enviar mensagem"
                 >
                   <Send className="w-4 h-4 ml-0.5" />
                 </button>
               </div>
               <p className="text-center text-[10px] text-white/30 font-medium uppercase tracking-widest mt-3">Powered by Plus IA Engine</p>
            </div>
          </motion.div>
        ) : (
          <motion.button 
            key="luna-button"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-12 z-50 bg-[#15151A]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center gap-4 shadow-[0_0_30px_rgba(255,0,128,0.2)] hover:bg-[#1A1A20] hover:border-primary/50 transition-colors cursor-pointer group text-left"
          >
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF0080] to-[#E10098] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
               <MessageCircle className="w-5 h-5 text-white" />
             </div>
             <div>
               <p className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none mb-1">Luna IA</p>
               <p className="text-sm font-bold text-white leading-none">Precisa de ajuda?</p>
             </div>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
