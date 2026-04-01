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

    // Transactional State Machine — Luna IA
    setTimeout(() => {
      const lower = textToSend.toLowerCase();

      // === Mudança de Plano ===
      if (textToSend === "Solicitar mudança de plano") {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          text: "Notei que seu plano atual é de 500 MEGA. Deseja fazer um UPGRADE para nossa conexão premium de 1 GIGA (R$199,90/mês) ou deseja ver opções de downgrade?",
          sender: "luna",
          options: ["Quero fazer o Upgrade (1 GIGA)", "Ver todas as opções", "Manter plano atual"]
        }]);
      } else if (textToSend === "Quero fazer o Upgrade (1 GIGA)") {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          text: "Upgrade realizado com sucesso! O novo perfil de 1 GIGA (+ Paramount e Max) já está provisionado no seu roteador. A fatura foi reajustada automaticamente.",
          sender: "luna",
          widget: "upgrade_card"
        }]);
      } else if (textToSend === "Ver todas as opções") {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          text: "Aqui estão nossos planos disponíveis:\n\n⚡ 100 Mega — R$ 79,90/mês\n🚀 300 Mega — R$ 99,90/mês\n💎 500 Mega — R$ 149,90/mês (seu atual)\n🏆 1 Giga — R$ 199,90/mês\n\nQual desses te interessa?",
          sender: "luna",
          options: ["Quero fazer o Upgrade (1 GIGA)", "Manter plano atual"]
        }]);
      } else if (textToSend === "Manter plano atual") {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          text: "Tudo certo! Seu plano continua o mesmo. Se precisar de algo mais, é só mandar! 😊",
          sender: "luna",
          options: ["Sem conexão com a internet", "Dúvida sobre fatura"]
        }]);

      // === Dúvida sobre fatura ===
      } else if (textToSend === "Dúvida sobre fatura" || lower.includes("fatura") || lower.includes("boleto") || lower.includes("pix") || lower.includes("pagamento")) {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          text: "Consultei seu histórico financeiro 🔎\n\nSua última fatura foi de R$ 149,90 com vencimento em 10/04/2026.\n\n• Status: Pendente\n• Código Pix disponível na Área do Assinante\n\nO que mais posso ajudar?",
          sender: "luna",
          options: ["Acessar Área do Assinante", "Solicitar 2ª via", "Falar com financeiro"]
        }]);
      } else if (textToSend === "Solicitar 2ª via") {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          text: "A 2ª via da sua fatura foi enviada para o email cadastrado! Você também pode acessá-la na Área do Assinante, aba Faturas. O código Pix está disponível para pagamento imediato.",
          sender: "luna",
          options: ["Acessar Área do Assinante", "Outra dúvida"]
        }]);
      } else if (textToSend === "Falar com financeiro") {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          text: "Vou transferir você para o setor financeiro! 📞\n\nEnquanto isso, você pode ligar diretamente para:\n📱 (24) 99999-0001 (WhatsApp)\n🕐 Horário: Seg-Sex, 8h às 18h\n\nOu acesse a Área do Assinante para gerar o Pix automaticamente.",
          sender: "luna",
          options: ["Acessar Área do Assinante", "Outra dúvida"]
        }]);

      // === Sem conexão ===
      } else if (textToSend === "Sem conexão com a internet" || lower.includes("sem internet") || lower.includes("sem conexão") || lower.includes("não conecta")) {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          text: "Entendi! Vou fazer um diagnóstico rápido na sua conexão... 🔍",
          sender: "luna"
        }]);

        setTimeout(() => {
          setMessages((prev) => [...prev, {
            id: (Date.now() + 2).toString(),
            text: "✅ Diagnóstico concluído!\n\n• Sinal OLT: Normal (-18.5 dBm)\n• Status PPPoE: Ativo\n• Última queda registrada: Nenhuma\n\nSua conexão parece estável no nosso lado. Vamos tentar reiniciar o roteador remotamente?",
            sender: "luna",
            options: ["Reiniciar roteador", "Agendar visita técnica", "Já resolvi, obrigado!"]
          }]);
        }, 2000);

      // === Internet lenta ===
      } else if (textToSend === "Internet lenta" || lower.includes("lenta") || lower.includes("lento") || lower.includes("velocidade")) {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          text: "Executando teste de velocidade na sua porta... 📊",
          sender: "luna"
        }]);

        setTimeout(() => {
          setMessages((prev) => [...prev, {
            id: (Date.now() + 2).toString(),
            text: "📊 Resultado do teste:\n\n• Download: 487 Mbps\n• Upload: 248 Mbps\n• Latência: 4ms\n• Plano contratado: 500 Mega\n\nSua velocidade está dentro do esperado (97.4%)! Se o Wi-Fi está lento, pode ser interferência no canal. Quer que eu otimize o canal do seu roteador?",
            sender: "luna",
            options: ["Otimizar canal Wi-Fi", "Agendar visita técnica", "Está bom, obrigado!"]
          }]);
        }, 2500);

      // === Queda intermitente ===
      } else if (textToSend === "Queda intermitente" || lower.includes("queda") || lower.includes("cai") || lower.includes("instável")) {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          text: "Analisando o histórico de estabilidade da sua conexão... 🔄",
          sender: "luna"
        }]);

        setTimeout(() => {
          setMessages((prev) => [...prev, {
            id: (Date.now() + 2).toString(),
            text: "📋 Relatório de estabilidade (últimas 24h):\n\n• Reconexões PPPoE: 0\n• Perda de pacotes: 0.01%\n• Uptime do roteador: 14 dias\n• Alertas de rede na região: Nenhum\n\nSua rede está estável! As quedas podem ser no Wi-Fi. Quer que eu reinicie o roteador ou agende uma visita técnica?",
            sender: "luna",
            options: ["Reiniciar roteador", "Agendar visita técnica", "Trocar canal Wi-Fi"]
          }]);
        }, 2000);

      // === Ações de resolução ===
      } else if (textToSend === "Reiniciar roteador") {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          text: "🔄 Enviando comando de reinicialização ao seu roteador via TR-069...",
          sender: "luna"
        }]);

        setTimeout(() => {
          setMessages((prev) => [...prev, {
            id: (Date.now() + 2).toString(),
            text: "✅ Roteador reiniciado com sucesso! Aguarde 2 minutos para ele reconectar. Se o problema persistir, posso agendar uma visita técnica.",
            sender: "luna",
            options: ["Resolveu, obrigado!", "Agendar visita técnica"]
          }]);
        }, 3000);

      } else if (textToSend === "Otimizar canal Wi-Fi" || textToSend === "Trocar canal Wi-Fi") {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          text: "📡 Analisando interferência nos canais...\n\nAlterando:\n• 2.4 GHz: Canal 1 → Canal 6\n• 5 GHz: Canal 36 → Canal 149\n\n✅ Pronto! Os novos canais têm menor interferência na sua região. Se usar a rede 5G (Familia_Plus_5G), reconecte agora.",
          sender: "luna",
          options: ["Resolveu, obrigado!", "Preciso de mais ajuda"]
        }]);

      } else if (textToSend === "Agendar visita técnica") {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          text: "📅 Posso abrir um chamado técnico para visita! Nosso suporte vai propor os horários disponíveis e você escolhe o melhor.\n\nVocê pode abrir o chamado diretamente pela Área do Assinante → aba Chamados → \"Abrir novo chamado\".",
          sender: "luna",
          options: ["Acessar Área do Assinante", "Outra dúvida"]
        }]);

      // === Navegação ===
      } else if (textToSend === "Acessar Área do Assinante") {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          text: "Te redirecionando para a Área do Assinante... 🚀",
          sender: "luna"
        }]);
        setTimeout(() => { window.location.href = "/area-do-assinante"; }, 1500);

      // === Encerramento ===
      } else if (lower.includes("obrigado") || lower.includes("resolveu") || lower.includes("valeu") || textToSend === "Está bom, obrigado!" || textToSend === "Já resolvi, obrigado!" || textToSend === "Resolveu, obrigado!") {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          text: "Fico feliz em ajudar! 💜 Se precisar de algo mais, é só chamar. A Plus Internet está sempre aqui pra você! ⚡",
          sender: "luna"
        }]);

      // === Outra dúvida / Voltar ao menu ===
      } else if (textToSend === "Outra dúvida" || textToSend === "Preciso de mais ajuda") {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          text: "Claro! Como posso ajudar? 😊",
          sender: "luna",
          options: [
            "Sem conexão com a internet",
            "Internet lenta",
            "Queda intermitente",
            "Solicitar mudança de plano",
            "Dúvida sobre fatura"
          ]
        }]);

      // === Fallback inteligente ===
      } else {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          text: "Entendi sua solicitação! Vou te direcionar para as opções que posso ajudar agora. Escolha abaixo:",
          sender: "luna",
          options: [
            "Sem conexão com a internet",
            "Internet lenta",
            "Dúvida sobre fatura",
            "Solicitar mudança de plano",
            "Agendar visita técnica"
          ]
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
