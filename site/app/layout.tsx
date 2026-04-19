import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Manrope } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import { LocationProvider } from "@/lib/location-context";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { LunaChatWidget } from "@/components/layout/LunaChatWidget";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Plus Internet | High-Velocity Connectivity",
  description: "Internet Fibra Óptica de alta performance para sua casa e empresa. Ultravelocidade, estabilidade garantida e suporte premium.",
  keywords: "internet, provedor de internet, fibra óptica, plus internet, wi-fi 6, ultravelocidade",
  openGraph: {
    title: "Plus Internet | High-Velocity Connectivity",
    description: "Assine já e transforme sua experiência de conexão com fibra óptica de verdade.",
    url: "https://plusinternet.com.br",
    siteName: "Plus Internet",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={`${plusJakartaSans.variable} ${manrope.variable} antialiased min-h-[100dvh]`}
    >
      <body className="min-h-[100dvh] flex flex-col font-body bg-surface text-on-surface">
        <LocationProvider>
          <AuthProvider>
            {children}
            <CookieConsent />
            <LunaChatWidget />
          </AuthProvider>
        </LocationProvider>
      </body>
    </html>
  );
}
