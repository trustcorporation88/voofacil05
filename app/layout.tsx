import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/session-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "VooFácil — Todas as Cias em Um Só Lugar",
  description: "Compare preços de voos em tempo real com LATAM, Azul, Gol e mais. Receba alertas de preço grátis por e-mail quando a passagem cair.",
  keywords: "passagem aérea barata, voos baratos, comparar voos, alerta de preço, LATAM, Azul, Gol",
  openGraph: {
    title: "VooFácil — Todas as Cias em Um Só Lugar",
    description: "Compare preços de voos em tempo real. Alerta de preço grátis por e-mail.",
    url: "https://www.vooscortex.com.br",
    siteName: "VooFácil",
    locale: "pt_BR",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://www.vooscortex.com.br" },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Travelpayouts Script */}
        <script
          async
          src="//www.travelpayouts.com/weedle/widget.js?marker=720173"
          charSet="utf-8"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
