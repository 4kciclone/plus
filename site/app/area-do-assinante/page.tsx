"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { getMySubscriptions, getMyInvoices, getMyTickets, Subscription, Invoice, Ticket } from "@/lib/api";
import { 
  LayoutDashboard, Receipt, HelpCircle, Gauge, Settings, ArrowUpCircle, 
  Wifi, Download, Upload, ArrowRight, CreditCard, QrCode, FileText, 
  Sparkles, Ticket as TicketIcon, Router, KeyRound, History, Star, LogOut
} from "lucide-react";

export default function AreaAssinantePage() {
  const { user, token, logout, loading } = useAuth();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState<"dashboard" | "faturas" | "suporte" | "plano" | "ajustes">("dashboard");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (token) {
      Promise.all([getMySubscriptions(token), getMyInvoices(token), getMyTickets(token)])
        .then(([subs, invs, ticks]) => {
          setSubscriptions(subs);
          setInvoices(invs);
          setTickets(ticks);
          setLoadingData(false);
        })
        .catch(() => setLoadingData(false));
    }
  }, [token]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (loading || loadingData) {
    return <div className="min-h-screen bg-surface flex items-center justify-center font-bold text-primary">Carregando sua conexão...</div>;
  }

  const mainSub = subscriptions[0];
  const pendingInvoice = invoices.find(i => i.status === "pending") || invoices[0];
  const firstName = user?.name?.split(" ")[0] || "Visitante";

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col md:flex-row">
      {/* SideNavBar Component */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-white border-r border-slate-100 z-40 hidden md:flex flex-col p-4">
        <div className="text-xl font-black text-primary mb-8 px-4 italic tracking-tighter">Plus Internet</div>
        
        <div className="flex items-center gap-3 mb-8 px-4">
          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold uppercase">
            {firstName.charAt(0)}
          </div>
          <div>
            <p className="font-headline text-sm font-bold text-on-surface">Minha Conexão</p>
            <p className="text-xs text-on-surface-variant">Premium Fiber</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <button 
            onClick={() => setActiveTab("dashboard")} 
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 transition-transform ${activeTab === 'dashboard' ? 'bg-primary/10 text-primary hover:translate-x-1' : 'text-slate-500 hover:bg-slate-100 hover:translate-x-1'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-headline text-sm font-semibold">Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab("faturas")} 
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 transition-transform ${activeTab === 'faturas' ? 'bg-primary/10 text-primary hover:translate-x-1' : 'text-slate-500 hover:bg-slate-100 hover:translate-x-1'}`}
          >
            <Receipt className="w-5 h-5" />
            <span className="font-headline text-sm font-semibold">Faturas</span>
          </button>
          <button 
            onClick={() => setActiveTab("suporte")} 
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 transition-transform ${activeTab === 'suporte' ? 'bg-primary/10 text-primary hover:translate-x-1' : 'text-slate-500 hover:bg-slate-100 hover:translate-x-1'}`}
          >
            <HelpCircle className="w-5 h-5" />
            <span className="font-headline text-sm font-semibold">Suporte</span>
          </button>
          <button 
            onClick={() => setActiveTab("plano")} 
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 transition-transform ${activeTab === 'plano' ? 'bg-primary/10 text-primary hover:translate-x-1' : 'text-slate-500 hover:bg-slate-100 hover:translate-x-1'}`}
          >
            <Gauge className="w-5 h-5" />
            <span className="font-headline text-sm font-semibold">Detalhes do Plano</span>
          </button>
          <button 
            onClick={() => setActiveTab("ajustes")} 
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 transition-transform ${activeTab === 'ajustes' ? 'bg-primary/10 text-primary hover:translate-x-1' : 'text-slate-500 hover:bg-slate-100 hover:translate-x-1'}`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-headline text-sm font-semibold">Ajustes</span>
          </button>
        </nav>

        <div className="space-y-3 mt-auto">
          <button className="w-full bg-primary/5 text-primary py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/10 transition-all opacity-80 hover:opacity-100">
            <ArrowUpCircle className="w-5 h-5" />
            Upgrade Plan
          </button>
          <button onClick={handleLogout} className="w-full text-on-surface-variant py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-all">
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="md:ml-64 p-6 md:p-12 min-h-screen pb-24 md:pb-12 w-full">
        {/* Welcome Header */}
        <header className="mb-12">
          {activeTab === "dashboard" && (
            <>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-2">
                Olá, {firstName}. <span className="text-primary">Bem-vindo</span> à sua central de conexões.
              </h1>
              <p className="text-on-surface-variant text-lg">Sua fibra está operando em alta performance hoje.</p>
            </>
          )}
          {activeTab === "faturas" && (
            <>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-2">
                Minhas <span className="text-primary">Faturas</span>
              </h1>
              <p className="text-on-surface-variant text-lg">Gerencie seu histórico de pagamentos e boletos ativos.</p>
            </>
          )}
          {activeTab === "suporte" && (
             <>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-2">
                Central de <span className="text-primary">Suporte</span>
              </h1>
              <p className="text-on-surface-variant text-lg">Precisa de ajuda? Acompanhe e abra novos chamados técnicos.</p>
            </>
          )}
          {(activeTab === "plano" || activeTab === "ajustes") && (
             <>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-2">
                Em <span className="text-primary">Construção</span>
              </h1>
              <p className="text-on-surface-variant text-lg">Esta seção estará liberada na próxima versão da plataforma.</p>
            </>
          )}
        </header>

        {activeTab === "dashboard" && (
          <div className="animate-in fade-in duration-300">
            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Main Plan Card */}
              <section className="lg:col-span-2 bg-surface-container-lowest rounded-lg p-8 shadow-[0_20px_40px_rgba(44,47,49,0.06)] flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute -right-12 -top-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-12">
                    <div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${mainSub?.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${mainSub?.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                        Status: {mainSub?.status === 'active' ? 'Ativo' : (mainSub?.status || 'Sem plano')}
                      </span>
                      <h2 className="text-3xl font-black text-on-surface">{mainSub?.plan?.name || "Plus Fiber Standard"}</h2>
                      <p className="text-on-surface-variant mt-1">Plano Residencial Premium</p>
                    </div>
                    <div className="p-4 bg-surface-container rounded-xl">
                      <Wifi className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-surface-container-low rounded-xl p-6 flex items-center gap-5 border-l-4 border-primary">
                      <div className="p-3 bg-white rounded-full shadow-sm">
                        <Download className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Download</p>
                        <p className="text-3xl font-black text-on-surface">{mainSub?.plan?.speed?.replace('M', '') || '500'}<span className="text-lg font-medium">Mbps</span></p>
                      </div>
                    </div>
                    <div className="bg-surface-container-low rounded-xl p-6 flex items-center gap-5 border-l-4 border-secondary">
                      <div className="p-3 bg-white rounded-full shadow-sm">
                        <Upload className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Upload</p>
                        <p className="text-3xl font-black text-on-surface">{parseInt(mainSub?.plan?.speed || '500') / 2}<span className="text-lg font-medium">Mbps</span></p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex gap-4 relative z-10">
                  <button className="text-primary font-bold text-sm flex items-center gap-2 hover:underline">
                    Ver detalhes do contrato <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </section>

              {/* Billing Card */}
              <section className="bg-surface-container-lowest rounded-lg p-8 shadow-[0_20px_40px_rgba(44,47,49,0.06)] border border-outline-variant/10">
                <h3 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-primary" />
                  Fatura {pendingInvoice ? "Atual" : "Em Dia"}
                </h3>
                
                <div className="mb-8">
                  <p className="text-on-surface-variant text-sm mb-1">
                    {pendingInvoice 
                      ? `Vencimento em ${new Date(pendingInvoice.dueDate).toLocaleDateString('pt-BR')}`
                      : "Nenhuma fatura pendente"
                    }
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-on-surface-variant">R$</span>
                    <span className="text-5xl font-black text-on-surface">
                      {pendingInvoice ? pendingInvoice.amount.toString().replace('.', ',') : "0,00"}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <button className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50" disabled={!pendingInvoice}>
                    <QrCode className="w-5 h-5" />
                    Copiar Código PIX
                  </button>
                  <button className="w-full bg-surface-container text-on-surface py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-surface-container-high transition-colors disabled:opacity-50" disabled={!pendingInvoice}>
                    <FileText className="w-5 h-5" />
                    Visualizar PDF
                  </button>
                </div>

                <div className="mt-12 p-4 bg-secondary-container/20 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-secondary shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-on-secondary-container">Dica de Velocidade</p>
                      <p className="text-xs text-on-secondary-container/80 mt-1">Coloque seu roteador em um local central para cobrir 100% da sua residência.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Support History & Network Status */}
              <section className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Tickets */}
                <div className="bg-surface-container-low rounded-lg p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-on-surface">Histórico de Suporte</h3>
                    <button className="text-primary font-bold text-sm hover:underline">Abrir Chamado</button>
                  </div>
                  
                  <div className="space-y-4">
                    {tickets.length > 0 ? (
                      tickets.slice(0, 2).map((t, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl flex items-center justify-between group cursor-pointer hover:bg-white/80 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-surface-container flex items-center justify-center rounded-full text-primary shrink-0">
                              <TicketIcon className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-bold text-on-surface truncate max-w-[150px] sm:max-w-xs">{t.subject}</p>
                              <p className="text-xs text-on-surface-variant">Ticket #{t.id.slice(-5)} • {new Date(t.createdAt).toLocaleDateString('pt-BR')}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shrink-0 ${
                            t.status === 'closed' ? 'bg-secondary-container text-on-secondary-container' : 'bg-primary/10 text-primary'
                          }`}>
                            {t.status === 'closed' ? 'Resolvido' : 'Pendente'}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-on-surface-variant font-medium text-sm">Você não tem chamados abertos.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Network Graphic / Status */}
                <div className="bg-inverse-surface rounded-lg p-8 text-white relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-20">
                    <svg className="w-full h-full preserve-3d" viewBox="0 0 400 100">
                      <path d="M0 80 Q 50 20, 100 80 T 200 80 T 300 80 T 400 80" fill="none" stroke="url(#gradient)" strokeWidth="2" />
                      <defs>
                        <linearGradient id="gradient" x1="0%" x2="100%" y1="0%" y2="0%">
                          <stop offset="0%" style={{ stopColor: '#b90035', stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: '#ff7481', stopOpacity: 1 }} />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-4 text-primary-fixed">
                        <div className="w-2 h-2 rounded-full bg-primary-fixed animate-pulse" />
                        <span className="text-xs font-black uppercase tracking-widest">Live Network Monitor</span>
                      </div>
                      <h3 className="text-3xl font-black mb-2">Conexão Estável</h3>
                      <p className="text-outline-variant text-sm max-w-[240px]">Sua região não apresenta oscilações no momento. Experiência de jogo e streaming otimizada.</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-8">
                      <div>
                        <p className="text-[10px] text-outline-variant uppercase font-bold tracking-widest">Latência (Ping)</p>
                        <p className="text-2xl font-bold">12ms</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-outline-variant uppercase font-bold tracking-widest">Estabilidade</p>
                        <p className="text-2xl font-bold">99.9%</p>
                      </div>
                    </div>
                  </div>
                </div>

              </section>
            </div>

            {/* Additional Actions / Support */}
            <section className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-white p-6 rounded-xl flex flex-col items-center text-center hover:translate-y-[-4px] transition-transform shadow-sm cursor-pointer">
                <Router className="text-primary w-8 h-8 mb-4" />
                <p className="font-bold text-on-surface">Reiniciar Modem</p>
                <p className="text-xs text-on-surface-variant mt-1 hidden sm:block">Resolva problemas de conexão remotamente</p>
              </div>
              <div className="bg-white p-6 rounded-xl flex flex-col items-center text-center hover:translate-y-[-4px] transition-transform shadow-sm cursor-pointer">
                <KeyRound className="text-primary w-8 h-8 mb-4" />
                <p className="font-bold text-on-surface">Senha do Wi-Fi</p>
                <p className="text-xs text-on-surface-variant mt-1 hidden sm:block">Altere o nome e a senha da sua rede</p>
              </div>
              <div className="bg-white p-6 rounded-xl flex flex-col items-center text-center hover:translate-y-[-4px] transition-transform shadow-sm cursor-pointer">
                <History className="text-primary w-8 h-8 mb-4" />
                <p className="font-bold text-on-surface">Minhas Faturas</p>
                <p className="text-xs text-on-surface-variant mt-1 hidden sm:block">Acesse o histórico completo de pagamentos</p>
              </div>
              <div className="bg-white p-6 rounded-xl flex flex-col items-center text-center hover:translate-y-[-4px] transition-transform shadow-sm cursor-pointer">
                <Star className="text-primary w-8 h-8 mb-4" />
                <p className="font-bold text-on-surface">Programa Plus+</p>
                <p className="text-xs text-on-surface-variant mt-1 hidden sm:block">Troque seus pontos por benefícios</p>
              </div>
            </section>
          </div>
        )}

        {/* Faturas Tab Content */}
        {activeTab === "faturas" && (
          <div className="animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-surface-container-lowest">
                <h3 className="font-bold text-xl font-headline">Histórico Financeiro</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {invoices.length > 0 ? invoices.map((inv) => (
                  <div key={inv.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${inv.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-rose-100 text-rose-600'}`}>
                        <Receipt className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-on-surface text-lg">Fatura {new Date(inv.dueDate).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p>
                        <p className="text-sm text-on-surface-variant font-medium">Vencimento: {new Date(inv.dueDate).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 justify-between md:justify-end w-full md:w-auto">
                      <div className="text-left md:text-right">
                        <p className="font-black text-2xl">R$ {inv.amount.toString().replace('.', ',')}</p>
                        <span className={`inline-block border px-2 py-0.5 rounded-md mt-1 text-[10px] font-bold uppercase tracking-wider ${inv.status === 'paid' ? 'text-green-600 border-green-200 bg-green-50' : 'text-rose-600 border-rose-200 bg-rose-50'}`}>
                          {inv.status === 'paid' ? 'Pagamento Confirmado' : 'Aguardando Pagamento'}
                        </span>
                      </div>
                      
                      <div className="flex gap-2 shrink-0">
                        <button className="p-3 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-colors border border-transparent hover:border-primary/20" title="Visualizar PDF">
                          <FileText className="w-5 h-5" />
                        </button>
                        {inv.status !== 'paid' && (
                          <button className="p-3 bg-primary text-white hover:bg-primary-dim rounded-xl transition-colors shadow-sm hover:scale-105 active:scale-95" title="Pagar com PIX">
                            <QrCode className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="p-12 text-center flex flex-col items-center data-empty">
                    <Receipt className="w-16 h-16 text-slate-200 mb-4" />
                    <p className="text-slate-500 font-medium">Você não possui faturas emitidas.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Suporte Tab Content */}
        {activeTab === "suporte" && (
          <div className="animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-surface-container-lowest flex justify-between items-center">
                <h3 className="font-bold text-xl font-headline">Meus Chamados</h3>
                <button className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-primary-dim transition-all hover:scale-105 active:scale-95">
                  Novo Chamado
                </button>
              </div>
              <div className="divide-y divide-slate-100">
                {tickets.length > 0 ? tickets.map((t) => (
                  <div key={t.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start sm:items-center gap-4">
                      <div className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center ${t.status === 'closed' ? 'bg-slate-100 text-slate-500' : 'bg-primary/10 text-primary'}`}>
                        <TicketIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-on-surface text-lg">{t.subject}</p>
                        <p className="text-sm text-on-surface-variant line-clamp-2 mt-1 max-w-xl">{t.message}</p>
                        <p className="text-xs font-medium text-slate-400 mt-2">
                          Aberto em {new Date(t.createdAt).toLocaleDateString('pt-BR')} • Protocolo #{t.id.slice(-6).toUpperCase()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        t.status === 'closed' ? 'bg-slate-100 text-slate-500' : 'bg-primary text-white'
                      }`}>
                        {t.status === 'closed' ? 'Resolvido' : 'Em Análise'}
                      </span>
                      <button className="mt-0 sm:mt-3 text-sm font-bold text-primary hover:underline">
                        Ver detalhes
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="p-12 text-center flex flex-col items-center data-empty">
                    <HelpCircle className="w-16 h-16 text-slate-200 mb-4" />
                    <p className="text-slate-500 font-medium">Você não tem chamados abertos.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 flex justify-around p-4 z-50">
        <button onClick={() => setActiveTab("dashboard")} className={`flex flex-col items-center ${activeTab === 'dashboard' ? 'text-primary' : 'text-slate-400'}`}>
          <LayoutDashboard className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold">Início</span>
        </button>
        <button onClick={() => setActiveTab("faturas")} className={`flex flex-col items-center ${activeTab === 'faturas' ? 'text-primary' : 'text-slate-400'}`}>
          <Receipt className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold">Faturas</span>
        </button>
        <button onClick={() => setActiveTab("plano")} className={`flex flex-col items-center ${activeTab === 'plano' ? 'text-primary' : 'text-slate-400'}`}>
          <Gauge className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold">Plano</span>
        </button>
        <button onClick={() => setActiveTab("ajustes")} className={`flex flex-col items-center ${activeTab === 'ajustes' ? 'text-primary' : 'text-slate-400'}`}>
          <Settings className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold">Ajustes</span>
        </button>
      </nav>
    </div>
  );
}
