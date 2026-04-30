import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Voo Fácil - Encontre os melhores voos",
  description:
    "Compare preços de voos em tempo real e receba alertas quando o preço cair.",
  icons: {
    icon: "/favicon.svg",
  },
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
        {children}
      </body>
    </html>
  );
}
