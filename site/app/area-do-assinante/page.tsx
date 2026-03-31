"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { getMySubscriptions, getMyInvoices, getMyTickets, Subscription, Invoice, Ticket } from "@/lib/api";
import { FileText, TicketCheck, Wifi, LogOut, Copy, Check } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

type Tab = "plano" | "faturas" | "chamados";

export default function AreaAssinantePage() {
  const { user, token, logout, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("plano");
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const loadData = () => {
      Promise.all([
        getMySubscriptions(token!),
        getMyInvoices(token!),
        getMyTickets(token!),
      ]).then(([subs, invs, ticks]) => {
        setSubscriptions(subs);
        setInvoices(invs);
        setTickets(ticks);
        setLoadingData(false);
      }).catch(() => setLoadingData(false));
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("pt-BR");
  const formatCurrency = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      ACTIVE: "bg-green-100 text-green-700",
      OPEN: "bg-blue-100 text-blue-700",
      PENDING: "bg-yellow-100 text-yellow-700",
      PAID: "bg-green-100 text-green-700",
      OVERDUE: "bg-red-100 text-red-700",
      RESOLVED: "bg-neutral-100 text-neutral-600",
      CANCELLED: "bg-neutral-100 text-neutral-500 line-through",
      WAITING_USER: "bg-orange-100 text-orange-700 gap-1 animate-pulse",
      AWAITING_SCHEDULE: "bg-purple-100 text-purple-700 gap-1 animate-pulse",
      SCHEDULED: "bg-blue-100 text-blue-700",
      PENDING_INSTALL: "bg-yellow-100 text-yellow-700",
    };
    const labels: Record<string, string> = {
      ACTIVE: "Ativo", OPEN: "Aberto", PENDING: "Pendente",
      PAID: "Pago", OVERDUE: "Vencida", RESOLVED: "Resolvido", CANCELLED: "Cancelado",
      WAITING_USER: "Aguardando Agendamento", SCHEDULED: "Agendado",
      PENDING_INSTALL: "Aguardando Equipe", AWAITING_SCHEDULE: "Escolha seu Horário",
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center ${map[status] || "bg-neutral-100 text-neutral-600"}`}>
        {status === 'WAITING_USER' && <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1" />}
        {labels[status] || status}
      </span>
    );
  };

  const handleScheduleVisit = async (ticketId: string, slot: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/tickets/${ticketId}/visit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ visitScheduled: slot })
      });
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleScheduleInstallation = async (subId: string, slot: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/subscriptions/${subId}/schedule`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ chosenSlot: slot })
      });
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || !user) return null;

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "plano", label: "Meu Plano", icon: <Wifi className="w-4 h-4" /> },
    { id: "faturas", label: "Faturas", icon: <FileText className="w-4 h-4" /> },
    { id: "chamados", label: "Chamados", icon: <TicketCheck className="w-4 h-4" /> },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F4F5F7] pt-[120px] pb-20">
        {/* Header */}
        <div className="bg-white border-b border-neutral-200">
          <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between py-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">Área do Assinante</p>
              <h1 className="text-2xl font-extrabold text-neutral-900">Olá, {user.name.split(" ")[0]}!</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-neutral-500 hover:text-red-600 transition-colors font-bold text-sm"
            >
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </div>

          {/* Tabs */}
          <div className="container mx-auto px-6 lg:px-12 flex gap-0">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-6 py-3 font-bold text-sm border-b-[3px] transition-colors ${
                  tab === t.id
                    ? "border-primary text-primary"
                    : "border-transparent text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-6 lg:px-12 py-8">
          {loadingData && (
            <div className="flex items-center justify-center py-20 text-neutral-400 font-bold">Carregando...</div>
          )}

          {/* MÉU PLANO */}
          {!loadingData && tab === "plano" && (
            <div className="space-y-4 max-w-2xl">
              {subscriptions.length === 0 ? (
                <div className="bg-white rounded-2xl border border-neutral-200 p-10 text-center">
                  <Wifi className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-xl font-extrabold text-neutral-900 mb-2">Nenhum plano ativo</h3>
                  <p className="text-neutral-500 mb-6">Você ainda não assinou nenhum plano da Plus.</p>
                  <Link href="/#planos" className="inline-block px-8 py-3 rounded-full bg-primary text-white font-bold hover:bg-[#c5007e] transition-colors">
                    Ver planos disponíveis
                  </Link>
                </div>
              ) : subscriptions.map(sub => (
                <div key={sub.id} className="bg-white rounded-2xl border border-neutral-200 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-1">Plano Atual</p>
                      <h3 className="text-2xl font-extrabold text-neutral-900">{sub.plan.name}</h3>
                      <p className="text-primary font-bold text-xl mt-1">{formatCurrency(sub.plan.price)}<span className="text-neutral-400 text-sm font-medium">/mês</span></p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(sub.status)}
                      <span className="text-xs text-neutral-400 font-medium">Desde {formatDate(sub.startDate)}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-neutral-100 flex flex-wrap gap-2">
                    {sub.plan.features.split(",").map((f: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-neutral-100 text-neutral-700 text-xs font-bold rounded-full">{f}</span>
                    ))}
                  </div>

                  {/* Installation Slot Selection */}
                  {sub.status === 'AWAITING_SCHEDULE' && (sub as any).installationOptions && (
                    <div className="mt-4 p-4 border border-purple-200 bg-purple-50/50 rounded-xl">
                      <p className="font-bold text-sm text-purple-800 mb-3">📅 Escolha o melhor horário para instalação:</p>
                      <div className="flex flex-wrap gap-2">
                        {(() => {
                          try {
                            const opts = JSON.parse((sub as any).installationOptions);
                            return opts.map((opt: string, idx: number) => (
                              <button
                                key={idx}
                                onClick={() => handleScheduleInstallation(sub.id, opt)}
                                className="px-4 py-2 bg-white border-2 border-purple-200 text-purple-700 font-bold text-xs rounded-xl hover:bg-purple-100 hover:border-purple-300 transition-colors"
                              >
                                {opt}
                              </button>
                            ));
                          } catch(e) { return null; }
                        })()}
                      </div>
                    </div>
                  )}

                  {sub.status === 'SCHEDULED' && (sub as any).installationTime && (
                    <div className="mt-4 p-3 border border-blue-200 bg-blue-50/50 rounded-xl flex items-center gap-2">
                      <span className="text-blue-600">📅</span>
                      <span className="font-bold text-sm text-blue-800">Instalação agendada para: {(sub as any).installationTime}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* FATURAS */}
          {!loadingData && tab === "faturas" && (
            <div className="space-y-3 max-w-2xl">
              {invoices.length === 0 ? (
                <div className="bg-white rounded-2xl border border-neutral-200 p-10 text-center">
                  <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                  <p className="text-neutral-500 font-bold">Nenhuma fatura encontrada.</p>
                </div>
              ) : invoices.map(inv => (
                <div key={inv.id} className="bg-white rounded-2xl border border-neutral-200 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-1">Fatura</p>
                      <p className="text-2xl font-extrabold text-neutral-900">{formatCurrency(inv.amount)}</p>
                      <p className="text-sm text-neutral-500 font-medium mt-1">Vence em {formatDate(inv.dueDate)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      {getStatusBadge(inv.status)}
                      {inv.status === "PENDING" && inv.pixCode && (
                        <button
                          onClick={() => copyToClipboard(inv.pixCode!, inv.id)}
                          className="flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                        >
                          {copied === inv.id ? <><Check className="w-4 h-4" /> Copiado!</> : <><Copy className="w-4 h-4" /> Copiar Pix</>}
                        </button>
                      )}
                    </div>
                  </div>
                  {inv.status === "PENDING" && inv.pixCode && (
                    <div className="mt-4 pt-4 border-t border-neutral-100 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                      <div className="bg-white p-2 border border-neutral-200 rounded-lg shrink-0">
                        <QRCodeSVG value={inv.pixCode} size={100} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">Código Pix Copia e Cola</p>
                        <div className="bg-neutral-50 rounded-lg p-3 text-xs font-mono text-neutral-600 break-all border border-neutral-200 select-all">
                          {inv.pixCode}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* CHAMADOS */}
          {!loadingData && tab === "chamados" && (
            <div className="space-y-4 max-w-2xl">
              <Link
                href="/suporte"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#c5007e] transition-colors mb-2"
              >
                <TicketCheck className="w-4 h-4" /> Abrir novo chamado
              </Link>

              {tickets.length === 0 ? (
                <div className="bg-white rounded-2xl border border-neutral-200 p-10 text-center">
                  <TicketCheck className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                  <p className="text-neutral-500 font-bold">Nenhum chamado aberto.</p>
                </div>
              ) : tickets.map(ticket => (
                <div key={ticket.id} className="bg-white rounded-2xl border border-neutral-200 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-extrabold text-neutral-900 mb-1">{ticket.subject}</p>
                      <p className="text-sm text-neutral-600 leading-relaxed">{ticket.message}</p>
                      <p className="text-xs text-neutral-400 font-medium mt-3">Aberto em {formatDate(ticket.createdAt)}</p>

                      {ticket.status === 'WAITING_USER' && ticket.visitOptions && (
                        <div className="mt-4 p-4 border border-orange-200 bg-orange-50/50 rounded-xl">
                          <p className="font-bold text-sm text-orange-800 mb-3">Escolha o melhor horário para a visita técnica:</p>
                          <div className="flex flex-wrap gap-2">
                            {(() => {
                              try {
                                const opts = JSON.parse(ticket.visitOptions);
                                return opts.map((opt: string, idx: number) => (
                                  <button
                                    key={idx}
                                    onClick={() => handleScheduleVisit(ticket.id, opt)}
                                    className="px-4 py-2 bg-white border-2 border-orange-200 text-orange-700 font-bold text-xs rounded-xl hover:bg-orange-100 hover:border-orange-300 transition-colors"
                                  >
                                    {opt}
                                  </button>
                                ));
                              } catch(e) { return null; }
                            })()}
                          </div>
                        </div>
                      )}

                      {ticket.status === 'SCHEDULED' && ticket.visitScheduled && (
                        <div className="mt-4 p-3 border border-blue-200 bg-blue-50/50 rounded-xl flex items-center gap-2">
                          <span className="text-blue-600">📅</span>
                          <span className="font-bold text-sm text-blue-800">Visita técnica agendada para: {ticket.visitScheduled}</span>
                        </div>
                      )}

                    </div>
                    <div>{getStatusBadge(ticket.status)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
