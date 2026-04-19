"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Track scroll for enhanced glass effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsMobileMenuOpen(false); }, [pathname]);

  const navLinks = [
    { label: "Planos", href: "/planos" },
    { label: "Vantagens", href: "/#vantagens" },
    { label: "Suporte", href: "/duvidas" },
    { label: "Área do Assinante", href: "/area-do-assinante" },
  ];

  const isActive = (href: string) => {
    if (href === "/planos") return pathname === "/planos";
    if (href === "/duvidas") return pathname === "/duvidas";
    if (href === "/area-do-assinante") return pathname === "/area-do-assinante";
    return false;
  };

  return (
    <header className="fixed top-0 w-full z-50">
      <nav
        className={`w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-ambient"
            : "bg-white/60 backdrop-blur-md"
        }`}
      >
        <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-black text-primary italic tracking-tighter font-heading"
          >
            Plus Internet
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 font-heading font-bold tracking-tight">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`transition-colors ${
                  isActive(item.href)
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  href="/area-do-assinante"
                  className="flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-on-surface-variant hover:text-primary hover:scale-105 transition-all"
                >
                  <User className="w-4 h-4" />
                  {user.name.split(" ")[0]}
                </Link>
                <button
                  onClick={logout}
                  title="Sair"
                  className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-6 py-2 rounded-xl font-bold text-on-surface-variant hover:scale-105 active:opacity-80 transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/cadastro"
                  className="px-6 py-2 bg-primary text-on-primary rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 active:opacity-80 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-on-surface p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-surface-container absolute top-full left-0 w-full flex flex-col py-6 px-8 gap-1 shadow-ambient-lg">
          <nav className="flex flex-col gap-1">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`px-4 py-3 rounded-xl font-heading font-bold transition-all ${
                  isActive(item.href)
                    ? "bg-primary/5 text-primary"
                    : "text-on-surface hover:bg-surface-container-low"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-surface-container">
            {user ? (
              <>
                <Link
                  href="/area-do-assinante"
                  className="w-full py-3 rounded-xl bg-primary text-on-primary font-bold flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" /> Minha Área
                </Link>
                <button
                  onClick={logout}
                  className="w-full py-3 rounded-xl bg-surface-container text-on-surface font-bold flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/cadastro"
                  className="w-full py-3 rounded-xl bg-primary text-on-primary font-bold flex items-center justify-center"
                >
                  Sign Up
                </Link>
                <Link
                  href="/login"
                  className="w-full py-3 rounded-xl bg-surface-container text-on-surface font-bold flex items-center justify-center"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
