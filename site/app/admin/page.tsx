"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Navbar } from "@/components/layout/Navbar";
import { Users, Ticket, Activity, CalendarCheck, CheckCircle2, Search, ArrowRight, UserCog } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function AdminDashboard() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  
  const [stats, setStats] = useState({ totalUsers: 0, totalSubscriptions: 0, newSubscriptions: 0, openTickets: 0 });
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [tab, setTab] = useState<"VISAO_GERAL" | "ASSINATURAS" | "CHAMADOS">("VISAO_GERAL");

  useEffect(() => {
    if (loading) return;
    if (!user || user.email !== "admin@plusinternet.com.br") {
       router.push("/login");
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

  if (loading || !user) return <div className="min-h-screen pt-32 text-center text-primary font-bold">Carregando painel...</div>;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F4F5F7] pt-[100px] pb-20">
        
        {/* Header Admin */}
        <div className="bg-neutral-900 border-b border-primary/20 pt-8 pb-12">
          <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-primary/20 text-primary uppercase text-[10px] font-black tracking-widest px-2.5 py-1 rounded-sm">
                  Ambiente Restrito
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-white">Painel da Equipe</h1>
              <p className="text-neutral-400 mt-1">Gerencie clientes, instalações e suporte técnico da Plus.</p>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-2 bg-neutral-800 p-1.5 rounded-xl border border-neutral-700/50">
               {["VISAO_GERAL", "ASSINATURAS", "CHAMADOS"].map(t => (
                 <button 
                  key={t}
                  onClick={() => setTab(t as any)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${tab === t ? "bg-primary text-white shadow-md shadow-primary/20" : "text-neutral-400 hover:text-white"}`}
                 >
                   {t.replace("_", " ")}
                 </button>
               ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 lg:px-12 py-8 -mt-8 relative z-10">
          
          {tab === "VISAO_GERAL" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Assinaturas Ativas", value: stats.totalSubscriptions, icon: Activity, color: "text-blue-500", bg: "bg-blue-50" },
                { title: "Para Instalar", value: stats.newSubscriptions, icon: CalendarCheck, color: "text-orange-500", bg: "bg-orange-50" },
                { title: "Chamados Abertos", value: stats.openTickets, icon: Ticket, color: "text-red-500", bg: "bg-red-50" },
                { title: "Total de Clientes", value: stats.totalUsers, icon: Users, color: "text-primary", bg: "bg-primary/10" },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bg}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                  <h3 className="text-neutral-500 font-bold text-sm">{stat.title}</h3>
                  <p className="text-4xl font-extrabold text-neutral-900 mt-1">{stat.value}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "ASSINATURAS" && (
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                 <h2 className="text-xl font-extrabold text-neutral-900">Agenda de Instalações</h2>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead className="bg-neutral-50 border-b border-neutral-100">
                     <tr>
                       <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase">Cliente</th>
                       <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase">Plano</th>
                       <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase">Endereço</th>
                       <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase">Status</th>
                       <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase text-right">Ação</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-neutral-100">
                     {subscriptions.length === 0 ? (
                       <tr><td colSpan={5} className="p-8 text-center text-neutral-500">Nenhuma assinatura.</td></tr>
                     ) : subscriptions.map(sub => (
                       <tr key={sub.id} className="hover:bg-neutral-50/50">
                         <td className="px-6 py-4">
                            <p className="font-bold text-neutral-900">{sub.user.name}</p>
                            <p className="text-xs text-neutral-500">{sub.user.cpf}</p>
                         </td>
                         <td className="px-6 py-4 font-medium text-neutral-700">{sub.plan.name}</td>
                         <td className="px-6 py-4">
                            <p className="text-sm text-neutral-700">CEP {sub.cep}</p>
                            <p className="text-xs text-neutral-500">Nº {sub.houseNumber}</p>
                         </td>
                         <td className="px-6 py-4">
                           {sub.status === "PENDING_INSTALL" 
                             ? <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">A Instalar</span> 
                             : <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Ativo</span>}
                         </td>
                         <td className="px-6 py-4 text-right">
                           {sub.status === "PENDING_INSTALL" && (
                             <button onClick={() => activateSubscription(sub.id)} className="text-white bg-primary px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary-dark transition-colors">
                               Marcar Instalado
                             </button>
                           )}
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          )}

          {tab === "CHAMADOS" && (
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                 <h2 className="text-xl font-extrabold text-neutral-900">Suporte Técnico N1 (Triado por Luna)</h2>
               </div>
               <div className="p-6 grid gap-4">
                  {tickets.length === 0 ? (
                    <p className="text-center text-neutral-500">Sem chamados abertos.</p>
                  ) : tickets.map(ticket => (
                    <div key={ticket.id} className="border border-neutral-200 p-5 rounded-xl">
                      <div className="flex items-start justify-between mb-3">
                         <div>
                           <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase ${ticket.status === 'OPEN' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                             {ticket.status}
                           </span>
                           <h3 className="font-extrabold text-neutral-900 text-lg mt-2">{ticket.subject}</h3>
                           <p className="text-sm font-medium text-neutral-500">Aberto por: {ticket.user.name}</p>
                         </div>
                         <div className="flex gap-2">
                           {ticket.status === 'OPEN' && (
                             <>
                               <button 
                                 onClick={() => {
                                    const opts = ["Amanhã - Manhã", "Amanhã - Tarde", "Depois de Amanhã - Manhã", "Depois de Amanhã - Tarde"];
                                    fetch(`${API}/admin/tickets/${ticket.id}`, {
                                      method: "PUT",
                                      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                                      body: JSON.stringify({ status: "WAITING_USER", visitOptions: opts })
                                    }).then(() => {
                                      fetch(`${API}/admin/tickets`, { headers: { Authorization: `Bearer ${token}` } })
                                        .then(res => res.json()).then(setTickets);
                                    });
                                 }}
                                 className="text-sm px-4 py-2 bg-orange-100 text-orange-700 font-bold rounded-xl hover:bg-orange-200 transition-colors"
                               >
                                 Agendar Visita
                               </button>
                               <button 
                                 onClick={() => resolveTicket(ticket.id)} 
                                 className="text-sm px-4 py-2 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary/5 transition-colors"
                               >
                                 Resolvido (Backend)
                               </button>
                             </>
                           )}
                           {ticket.status === 'WAITING_USER' && (
                             <span className="text-sm px-4 py-2 bg-neutral-100 text-neutral-500 font-bold rounded-xl flex items-center gap-1">
                               ⏱ Aguardando Cliente
                             </span>
                           )}
                           {ticket.status === 'SCHEDULED' && (
                             <span className="text-sm px-4 py-2 bg-blue-100 text-blue-700 font-bold rounded-xl flex items-center gap-1">
                               📅 Agendado: {ticket.visitScheduled}
                             </span>
                           )}
                         </div>
                      </div>
                      <div className="bg-neutral-50 p-4 rounded-xl text-sm text-neutral-700 font-mono mt-3 whitespace-pre-wrap">
                        {ticket.message}
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

        </div>
      </main>
    </>
  );
}
