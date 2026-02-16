import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Assistente AI para Professores",
  description:
    "Ferramenta online para auxiliar professores da rede estadual de ensino com planejamento semanal e formatação de ocorrências",
  keywords: ["educação", "professores", "AI", "IA", "planejamento", "ocorrência"],
  authors: [{ name: "Professores AI" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://professores-ai.vercel.app",
    siteName: "Assistente AI para Professores",
    title: "Assistente AI para Professores",
    description:
      "Ferramenta online para auxiliar professores com inteligência artificial",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
