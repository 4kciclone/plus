import type { Metadata } from "next";
import { Sora, DM_Sans } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { LunaChatWidget } from "@/components/layout/LunaChatWidget";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Plus Internet | Velocidade que você sente",
  description: "Internet Fibra Óptica Premium de ultra velocidade para sua casa e empresa com Wi-Fi 6 incluso.",
  keywords: "internet, provedor de internet, fibra óptica, plus internet, wi-fi 6",
  openGraph: {
    title: "Plus Internet | Velocidade que você sente",
    description: "Assine já e transforme sua experiência de conexão.",
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
      className={`${sora.variable} ${dmSans.variable} antialiased min-h-[100dvh]`}
    >
      <body className="min-h-[100dvh] flex flex-col font-sans bg-[#F4F5F7] text-neutral-900">
        <AuthProvider>
          {children}
          <CookieConsent />
          <LunaChatWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
