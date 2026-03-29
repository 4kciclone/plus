"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import { Suspense } from "react";

function LoginContent() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      router.push(redirect || "/area-do-assinante");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao entrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F4F5F7] pt-[120px] pb-20 flex items-start justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl border border-black/5 shadow-sm p-10 mt-8">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-neutral-900">Entrar</h1>
            <p className="text-neutral-500 mt-2">Acesse sua área do assinante.</p>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-1.5">E-mail</label>
              <input type="email" placeholder="joao@email.com.br" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required
                className="w-full h-12 px-4 rounded-xl border-2 border-neutral-200 text-neutral-900 font-medium text-[15px] focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-1.5">Senha</label>
              <input type="password" placeholder="Sua senha" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required
                className="w-full h-12 px-4 rounded-xl border-2 border-neutral-200 text-neutral-900 font-medium text-[15px] focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <button type="submit" disabled={loading}
              className="w-full h-12 rounded-full bg-primary text-white font-bold text-[16px] mt-2 hover:bg-primary-dark transition-colors disabled:opacity-60">
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="text-center text-neutral-500 text-sm mt-6">
            Não tem conta?{" "}
            <Link href="/cadastro" className="text-primary font-bold hover:underline">Criar conta grátis</Link>
          </p>
        </div>
      </main>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F4F5F7] pt-[120px] pb-20 flex flex-col items-center justify-center gap-4">
        <p className="text-neutral-500 font-medium">Carregando...</p>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
