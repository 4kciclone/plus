"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { LogIn, UserPlus, ArrowRight } from "lucide-react";
import { Suspense } from "react";

function LoginContent() {
  const { login, register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Login form
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Register form
  const [regForm, setRegForm] = useState({ name: "", email: "", cpf: "", password: "", address: "" });
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      router.push(redirect || "/area-do-assinante");
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : "Erro ao entrar.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    setRegLoading(true);
    try {
      await register(regForm);
      router.push("/area-do-assinante");
    } catch (err: unknown) {
      setRegError(err instanceof Error ? err.message : "Erro ao cadastrar.");
    } finally {
      setRegLoading(false);
    }
  };

  const handleRegChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegForm({ ...regForm, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Minimal Header */}
      <header className="w-full z-50 bg-white/80 backdrop-blur-xl border-b border-surface-container">
        <div className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
          <Link href="/" className="text-2xl font-black text-primary italic tracking-tighter font-headline">
            Plus Internet
          </Link>
          <Link href="/" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">
            Voltar ao site
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-ambient overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-surface-container">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-4 text-center font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
                activeTab === "login"
                  ? "text-primary border-b-2 border-primary bg-primary/5"
                  : "text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              <LogIn className="w-4 h-4" />
              Entrar na Conta
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-4 text-center font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
                activeTab === "register"
                  ? "text-primary border-b-2 border-primary bg-primary/5"
                  : "text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Criar Cadastro
            </button>
          </div>

          <div className="p-8">
            {/* Login View */}
            {activeTab === "login" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-headline font-extrabold text-on-surface">Bem-vindo de volta</h2>
                  <p className="text-sm text-on-surface-variant mt-1">Insira seus dados para acessar sua área do assinante.</p>
                </div>

                {loginError && (
                  <div className="mb-6 px-4 py-3 bg-error/10 text-error rounded-xl text-sm font-medium border border-error/20">
                    {loginError}
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant ml-1 uppercase tracking-wider">E-mail</label>
                    <input
                      type="email"
                      placeholder="seu@email.com"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      required
                      className="w-full bg-surface-container-low border border-surface-container rounded-xl px-4 py-3 text-on-surface font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-outline"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-on-surface-variant ml-1 uppercase tracking-wider">Senha</label>
                      <button type="button" className="text-xs font-bold text-primary hover:underline">
                        Esqueceu a senha?
                      </button>
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                      className="w-full bg-surface-container-low border border-surface-container rounded-xl px-4 py-3 text-on-surface font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-outline"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full bg-primary text-white py-3.5 mt-2 rounded-xl font-bold hover:bg-primary-dim active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-60"
                  >
                    {loginLoading ? "Entrando..." : "Acessar Conta"}
                  </button>
                </form>
              </div>
            )}

            {/* Register View */}
            {activeTab === "register" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-headline font-extrabold text-on-surface">Nova Assinatura</h2>
                  <p className="text-sm text-on-surface-variant mt-1">Preencha seus dados para começar.</p>
                </div>

                {regError && (
                  <div className="mb-6 px-4 py-3 bg-error/10 text-error rounded-xl text-sm font-medium border border-error/20">
                    {regError}
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant ml-1 uppercase tracking-wider">Nome Completo</label>
                    <input
                      name="name"
                      type="text"
                      placeholder="Como deseja ser chamado?"
                      value={regForm.name}
                      onChange={handleRegChange}
                      required
                      className="w-full bg-surface-container-low border border-surface-container rounded-xl px-4 py-3 text-on-surface font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-outline"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-on-surface-variant ml-1 uppercase tracking-wider">CPF</label>
                      <input
                        name="cpf"
                        type="text"
                        placeholder="000.000.000-00"
                        value={regForm.cpf}
                        onChange={handleRegChange}
                        required
                        className="w-full bg-surface-container-low border border-surface-container rounded-xl px-4 py-3 text-on-surface font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-outline"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-on-surface-variant ml-1 uppercase tracking-wider">Telefone</label>
                      <input
                        name="phone"
                        type="text"
                        placeholder="(00) 00000-0000"
                        className="w-full bg-surface-container-low border border-surface-container rounded-xl px-4 py-3 text-on-surface font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-outline"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant ml-1 uppercase tracking-wider">E-mail</label>
                    <input
                      name="email"
                      type="email"
                      placeholder="contato@exemplo.com"
                      value={regForm.email}
                      onChange={handleRegChange}
                      required
                      className="w-full bg-surface-container-low border border-surface-container rounded-xl px-4 py-3 text-on-surface font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-outline"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant ml-1 uppercase tracking-wider">Senha de Acesso</label>
                    <input
                      name="password"
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                      value={regForm.password}
                      onChange={handleRegChange}
                      required
                      className="w-full bg-surface-container-low border border-surface-container rounded-xl px-4 py-3 text-on-surface font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-outline"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={regLoading}
                    className="w-full bg-on-surface text-white py-3.5 mt-2 rounded-xl font-bold hover:bg-neutral-800 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {regLoading ? "Criando..." : "Confirmar Cadastro"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center">Carregando...</div>}>
      <LoginContent />
    </Suspense>
  );
}
