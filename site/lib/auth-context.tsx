"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, getUser, getToken, setToken, setUser, clearToken, login as apiLogin, register as apiRegister } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; cpf: string; password: string; address?: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = getToken();
    const u = getUser();
    if (t && u) { setTokenState(t); setUserState(u); }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await apiLogin({ email, password });
    setToken(res.token);
    setUser(res.user);
    setTokenState(res.token);
    setUserState(res.user);
  };

  const register = async (data: { name: string; email: string; cpf: string; password: string; address?: string }) => {
    const res = await apiRegister(data);
    setToken(res.token);
    setUser(res.user);
    setTokenState(res.token);
    setUserState(res.user);
  };

  const logout = () => {
    clearToken();
    setTokenState(null);
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
