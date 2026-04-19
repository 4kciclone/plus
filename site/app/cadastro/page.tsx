"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function CadastroPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/area-do-assinante");
    } else {
      router.push("/login");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <p className="text-on-surface-variant font-medium">Redirecionando...</p>
    </div>
  );
}
