const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(fetchOptions.headers as Record<string, string> || {}),
  };

  const res = await fetch(`${API_BASE}${path}`, { ...fetchOptions, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Erro na requisição");
  return data as T;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("plus_token");
}

export function setToken(token: string) {
  localStorage.setItem("plus_token", token);
}

export function clearToken() {
  localStorage.removeItem("plus_token");
  localStorage.removeItem("plus_user");
}

export function getUser() {
  if (typeof window === "undefined") return null;
  const u = localStorage.getItem("plus_user");
  return u ? JSON.parse(u) : null;
}

export function setUser(user: object) {
  localStorage.setItem("plus_user", JSON.stringify(user));
}

// --- Auth ---
export async function register(data: { name: string; email: string; cpf: string; password: string; address?: string }) {
  return apiFetch<{ token: string; user: User }>("/auth/register", { method: "POST", body: JSON.stringify(data) });
}

export async function login(data: { email: string; password: string }) {
  return apiFetch<{ token: string; user: User }>("/auth/login", { method: "POST", body: JSON.stringify(data) });
}

export async function getMe(token: string) {
  return apiFetch<User>("/auth/me", { token });
}

// --- Plans ---
export async function getPlans(): Promise<Plan[]> {
  return apiFetch<Plan[]>("/plans");
}

// --- Subscriptions ---
export async function subscribe(data: { planId: string; cep: string; houseNumber: string; reference?: string; paymentMethod: string }, token: string) {
  return apiFetch<Subscription>("/subscriptions", { method: "POST", body: JSON.stringify(data), token });
}

export async function getMySubscriptions(token: string) {
  return apiFetch<Subscription[]>("/subscriptions/my", { token });
}

// --- Tickets ---
export async function createTicket(data: { subject: string; message: string }, token: string) {
  return apiFetch<Ticket>("/tickets", { method: "POST", body: JSON.stringify(data), token });
}

export async function getMyTickets(token: string) {
  return apiFetch<Ticket[]>("/tickets/my", { token });
}

// --- Invoices ---
export async function getMyInvoices(token: string) {
  return apiFetch<Invoice[]>("/invoices/my", { token });
}

export async function getInvoice(id: string, token: string) {
  return apiFetch<Invoice & { boletoCode: string }>(`/invoices/${id}`, { token });
}

// --- Types ---
export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  address?: string;
  role: string;
  createdAt: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  category: string;
  speed: string | null;
  features: string;
  popular: boolean;
}

export interface Subscription {
  id: string;
  status: string;
  startDate: string;
  cep: string;
  houseNumber: string;
  reference: string | null;
  paymentMethod: string;
  installationDate: string | null;
  installationTime: string | null;
  plan: Plan;
}

export interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: string;
  visitOptions?: string | null;
  visitScheduled?: string | null;
  createdAt: string;
}

export interface Invoice {
  id: string;
  amount: number;
  dueDate: string;
  status: string;
  pixCode: string | null;
}
