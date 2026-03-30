"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function CadastroPage() {
  const { user, register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", cpf: "", password: "", address: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push("/area-do-assinante");
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      router.push("/area-do-assinante");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F4F5F7] pt-[120px] pb-20 flex items-start justify-center px-4">
        <div className="w-full max-w-lg bg-white rounded-2xl border border-black/5 shadow-sm p-10 mt-8">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-neutral-900">Criar conta</h1>
            <p className="text-neutral-500 mt-2">Preencha seus dados para assinar um plano Plus.</p>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { label: "Nome completo", name: "name", type: "text", placeholder: "João da Silva" },
              { label: "E-mail", name: "email", type: "email", placeholder: "joao@email.com.br" },
              { label: "CPF", name: "cpf", type: "text", placeholder: "000.000.000-00" },
              { label: "Senha", name: "password", type: "password", placeholder: "Mínimo 6 caracteres" },
              { label: "Endereço completo (opcional)", name: "address", type: "text", placeholder: "Rua das Flores, 123" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-bold text-neutral-700 mb-1.5">{field.label}</label>
                <input
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.name as keyof typeof form]}
                  onChange={handleChange}
                  required={field.name !== "address"}
                  className="w-full h-12 px-4 rounded-xl border-2 border-neutral-200 text-neutral-900 font-medium text-[15px] focus:outline-none focus:border-primary transition-colors bg-white"
                />
              </div>
            ))}

            <button type="submit" disabled={loading}
              className="w-full h-12 rounded-full bg-primary text-white font-bold text-[16px] mt-2 hover:bg-primary-dark transition-colors disabled:opacity-60">
              {loading ? "Criando conta..." : "Criar minha conta"}
            </button>
          </form>

          <p className="text-center text-neutral-500 text-sm mt-6">
            Já tem conta?{" "}
            <Link href="/login" className="text-primary font-bold hover:underline">Entrar</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
