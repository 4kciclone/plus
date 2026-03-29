"use client";
import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Loader2, TicketCheck, RotateCcw } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const TECHNICAL_SUBJECTS = [
  "Sem conexão com a internet",
  "Internet lenta",
  "Queda intermitente",
  "Problema com o roteador",
];

type Message = {
  role: "user" | "assistant";
  content: string;
};

interface Props {
  subject: string;
  userName: string;
  token: string;
  onOpenTicket: (history: Message[]) => void;
  onClose: () => void;
}

export function AISupportChat({ subject, userName, token, onOpenTicket, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Start the conversation automatically
  useEffect(() => {
    if (!started) {
      setStarted(true);
      sendMessage(null, []);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = async (userText: string | null, history: Message[]) => {
    const newMessages: Message[] = userText
      ? [...history, { role: "user", content: userText }]
      : history;

    if (userText) setMessages(newMessages);
    setLoading(true);
    setInput("");

    const payload = userText
      ? newMessages
      : [{ role: "user", content: `Olá, estou com o seguinte problema: ${subject}` }];

    try {
      const res = await fetch(`${API}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: payload,
          context: {
            subject,
            userName,
            clientId: "001",
            cpf: "000.000.000-00",
            region: "Centro",
            macAddress: "AA:BB:CC:DD:EE:FF",
          },
        }),
      });

      const data: { reply: string; openTicket?: boolean } = await res.json();

      const assistantMessage: Message = { role: "assistant", content: data.reply };
      const updatedMessages = userText
        ? [...newMessages, assistantMessage]
        : [{ role: "user", content: `Estou com o seguinte problema: ${subject}` } as Message, assistantMessage];
      setMessages(updatedMessages);

      if (data.openTicket) {
        setTimeout(() => onOpenTicket(updatedMessages), 1500);
      }
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Tive um problema ao verificar sua conexão. Vou abrir um chamado para nossa equipe técnica.",
      }]);
      setTimeout(() => onOpenTicket(messages), 1500);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || loading) return;
    sendMessage(input.trim(), messages);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden border border-neutral-200" style={{ height: "min(600px, 90vh)" }}>
        
        {/* Header */}
        <div className="bg-[#080b12] px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-extrabold text-sm leading-none">Luna</p>
              <p className="text-white/40 text-[11px] font-medium">Assistente Plus • Online agora</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-neutral-50">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-2`}>
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-primary text-white rounded-br-sm"
                    : "bg-white text-neutral-800 border border-neutral-200 rounded-bl-sm shadow-sm"
                }`}
              >
                {msg.content.replace("ABRIR_CHAMADO", "").trim()}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-white border border-neutral-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="text-xs text-neutral-400 font-medium">Verificando sua rede...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Footer: input */}
        <div className="px-4 py-3 bg-white border-t border-neutral-100 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenTicket(messages)}
              title="Abrir chamado diretamente"
              className="text-xs text-neutral-400 hover:text-primary transition-colors font-bold flex items-center gap-1 shrink-0"
            >
              <TicketCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Pular</span>
            </button>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder="Digite sua resposta..."
              disabled={loading}
              className="flex-1 h-10 px-4 rounded-full border border-neutral-200 text-sm focus:outline-none focus:border-primary transition-colors disabled:opacity-50 disabled:bg-neutral-50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-[#c5007e] transition-colors disabled:opacity-40"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[10px] text-neutral-300 text-center mt-2 font-medium">
            Luna é uma IA. Em emergências, ligue <span className="text-primary">(24) 98120‑6500</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper: should we intercept with AI before the ticket form?
export function shouldIntercept(subject: string): boolean {
  return TECHNICAL_SUBJECTS.some(s => s === subject);
}
