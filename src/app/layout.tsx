import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Simulador de Economia | Advance Sistemas",
  description: "Simule custos de jornada e oportunidades de melhoria em um protótipo demonstrativo da Advance Sistemas.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
