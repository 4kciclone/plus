"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Users, Ticket, Activity, CalendarCheck, Search, ShieldAlert, Cpu, Wrench, Menu, X, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function AdminDashboard() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  
  const [stats, setStats] = useState({ totalUsers: 0, totalSubscriptions: 0, newSubscriptions: 0, openTickets: 0 });
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [tab, setTab] = useState<"VISAO_GERAL" | "ASSINATURAS" | "CHAMADOS">("VISAO_GERAL");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user || user.email !== "admin@plusinternet.com.br") {
       router.push("/login?redirect=/admin");
       return;
    }

    // Load admin data
    fetch(`${API}/admin/dashboard`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setStats(data));

    fetch(`${API}/admin/subscriptions`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setSubscriptions(data));

    fetch(`${API}/admin/tickets`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setTickets(data));

  }, [user, token, loading, router]);

  const activateSubscription = async (id: string) => {
    await fetch(`${API}/admin/subscriptions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: "ACTIVE", installationDate: new Date().toISOString() })
    });
    // refresh list
    const res = await fetch(`${API}/admin/subscriptions`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setSubscriptions(data);
  };

  const resolveTicket = async (id: string) => {
    await fetch(`${API}/admin/tickets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: "RESOLVED" })
    });
    const res = await fetch(`${API}/admin/tickets`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setTickets(data);
  };

  const scheduleVisitOptions = async (ticketId: string) => {
    const opts = ["Amanhã - Manhã", "Amanhã - Tarde", "Depois de Amanhã - Manhã", "Depois de Amanhã - Tarde"];
    await fetch(`${API}/admin/tickets/${ticketId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: "WAITING_USER", visitOptions: opts })
    });
    const res = await fetch(`${API}/admin/tickets`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setTickets(data);
  };

  if (loading || !user || user.email !== "admin@plusinternet.com.br") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
         <div className="flex flex-col items-center gap-4">
            <Activity className="w-8 h-8 text-primary animate-pulse" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Autenticando Nível Administrativo...</p>
         </div>
      </div>
    );
  }

  const tabs = [
    { id: "VISAO_GERAL", label: "Dashboard", icon: Activity },
    { id: "ASSINATURAS", label: "Instalações", icon: Cpu },
    { id: "CHAMADOS", label: "Suporte N1", icon: Wrench },
  ];

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 p-6 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <Link href="/" className="text-2xl font-black text-white italic tracking-tighter mb-8 block font-heading">
          Plus <span className="text-primary tracking-normal">Admin</span>
        </Link>

        <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary border border-primary/30 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="truncate">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Acesso Root</p>
            <p className="font-bold text-white text-sm truncate">{user.name}</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {tabs.map((t) => {
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => { setTab(t.id as any); setMobileMenuOpen(false); }}
                className={`flex items-center gap-3 px-4 py-4 rounded-xl font-bold transition-all text-left ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <t.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-500"}`} />
                {t.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto relative z-10 pt-6">
        <a href="/" target="_blank" className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-bold transition-colors">
          Site Público <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-primary/30">
      
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <span className="text-xl font-black text-white italic font-heading">Plus Admin</span>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-slate-800 rounded-lg text-white">
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            className="fixed inset-0 z-40 bg-slate-900 lg:hidden"
          >
            <Sidebar />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex h-screen overflow-hidden">
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-80 shrink-0 h-full">
          <Sidebar />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 h-full overflow-y-auto bg-slate-950 p-6 md:p-10 relative">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              
              {/* VISO GERAL */}
              {tab === "VISAO_GERAL" && (
                <div className="max-w-7xl mx-auto">
                  <header className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white font-heading tracking-tight mb-2">Painel de Controle</h1>
                    <p className="text-slate-400">Resumo de operações da rede Plus Internet.</p>
                  </header>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {[
                      { label: "Assinaturas Ativas", value: stats.totalSubscriptions, icon: Activity, color: "text-emerald-500", rawColor: "emerald" },
                      { label: "Novas Instalações", value: stats.newSubscriptions, icon: CalendarCheck, color: "text-orange-500", rawColor: "orange" },
                      { label: "Tickets Abertos", value: stats.openTickets, icon: Ticket, color: "text-primary", rawColor: "primary" },
                      { label: "Total de Clientes", value: stats.totalUsers, icon: Users, color: "text-blue-500", rawColor: "blue" },
                    ].map((s, i) => (
                      <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-${s.rawColor}-500/10 rounded-full blur-2xl group-hover:bg-${s.rawColor}-500/20 transition-colors`} />
                        <div className="relative z-10">
                          <s.icon className={`w-6 h-6 mb-4 ${s.color}`} />
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{s.label}</p>
                          <p className={`text-4xl font-black tracking-tighter ${s.color}`}>{s.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ASSINATURAS */}
              {tab === "ASSINATURAS" && (
                <div className="max-w-7xl mx-auto">
                  <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-extrabold text-white font-heading tracking-tight mb-1">Logística de Instalações</h1>
                      <p className="text-slate-400">Acompanhe novos pedidos e faturamentos iniciais.</p>
                    </div>
                  </header>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                     <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                          <thead className="bg-slate-950/50 border-b border-slate-800 text-xs font-bold uppercase tracking-widest text-slate-500">
                            <tr>
                              <th className="px-6 py-5">Cliente</th>
                              <th className="px-6 py-5">Pacote</th>
                              <th className="px-6 py-5">Viabilidade / Endereço</th>
                              <th className="px-6 py-5">Status</th>
                              <th className="px-6 py-5 text-right">Ação Operacional</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/50">
                            {subscriptions.length === 0 ? (
                              <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">Nenhum contrato recente.</td></tr>
                            ) : subscriptions.map(sub => (
                              <tr key={sub.id} className="hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-5">
                                  <p className="font-bold text-white text-base">{sub.user.name}</p>
                                  <p className="text-slate-500 font-mono text-xs">{sub.user.cpf}</p>
                                </td>
                                <td className="px-6 py-5">
                                  <span className="font-bold text-primary">{sub.plan.name}</span>
                                </td>
                                <td className="px-6 py-5">
                                  <p className="text-slate-300">CEP {sub.cep} <span className="text-slate-600 px-1">•</span> Nº {sub.houseNumber}</p>
                                </td>
                                <td className="px-6 py-5">
                                  {sub.status === "PENDING_INSTALL" 
                                    ? <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-full text-[10px] font-black uppercase tracking-widest"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"/>A Instalar</span> 
                                    : <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest">Ativo</span>}
                                </td>
                                <td className="px-6 py-5 text-right">
                                  {sub.status === "PENDING_INSTALL" && (
                                    <button onClick={() => activateSubscription(sub.id)} className="px-4 py-2 bg-slate-800 hover:bg-emerald-500/20 hover:text-emerald-500 text-white font-bold text-xs rounded-lg transition-colors border border-slate-700 hover:border-emerald-500/30">
                                      Confirmar Instalação
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                     </div>
                  </div>
                </div>
              )}

              {/* CHAMADOS */}
              {tab === "CHAMADOS" && (
                <div className="max-w-7xl mx-auto">
                  <header className="mb-10">
                    <h1 className="text-3xl font-extrabold text-white font-heading tracking-tight mb-1">NOC & Suporte N1</h1>
                    <p className="text-slate-400">Tickets escalados pela Luna IA ou abertos manualmente.</p>
                  </header>

                  <div className="grid gap-4">
                     {tickets.length === 0 ? (
                       <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
                         <ShieldAlert className="w-16 h-16 text-slate-800 mx-auto mb-4" />
                         <p className="text-slate-400 font-bold">Nenhum chamado aberto. A rede está verde.</p>
                       </div>
                     ) : tickets.map(ticket => (
                       <div key={ticket.id} className={`bg-slate-900 border rounded-2xl p-6 transition-colors ${ticket.status === 'OPEN' ? 'border-primary/50 shadow-lg shadow-primary/5' : 'border-slate-800'}`}>
                          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                            
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-3 mb-3">
                                {ticket.status === 'OPEN' ? (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"/> Em Aberto
                                  </span>
                                ) : ticket.status === 'WAITING_USER' ? (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    Aguardando Agendamento Cliente
                                  </span>
                                ) : ticket.status === 'SCHEDULED' ? (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    Agendado: {ticket.visitScheduled}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 border border-slate-700 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    Resolvido
                                  </span>
                                )}
                                <span className="font-mono text-xs text-slate-600">ID: {ticket.id}</span>
                              </div>
                              <h3 className="font-extrabold text-white text-xl mb-1">{ticket.subject}</h3>
                              <p className="text-sm font-bold text-slate-400 mb-4">Aberto por: <span className="text-slate-300">{ticket.user.name}</span></p>
                              
                              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50 text-slate-300 font-mono text-sm">
                                {ticket.message}
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap lg:flex-col items-center lg:items-end gap-3 shrink-0">
                               {ticket.status === 'OPEN' && (
                                 <>
                                  <button onClick={() => scheduleVisitOptions(ticket.id)} className="w-full sm:w-auto text-sm px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-orange-500/20 text-center">
                                    Exigir Visita Técnica
                                  </button>
                                  <button onClick={() => resolveTicket(ticket.id)} className="w-full sm:w-auto text-sm px-6 py-3 bg-slate-800 hover:bg-emerald-500/20 hover:text-emerald-500 hover:border-emerald-500/30 text-white font-bold rounded-xl transition-colors border border-slate-700 text-center">
                                    Baixa Sistêmica (Resolvido)
                                  </button>
                                 </>
                               )}
                            </div>
                          </div>
                       </div>
                     ))}
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

        </main>
      </div>

    </div>
  );
}
