import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IngWork - Conecta Clientes con Ingenieros",
  description: "Marketplace para conectar clientes con ingenieros profesionales. Crea proyectos, recibe propuestas y gestiona el trabajo en un solo lugar.",
  keywords: "ingenieros, proyectos, freelance, marketplace, desarrollo, consultoría",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico", 
    apple: "/ingwork logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`antialiased`}>
        {children}
      </body>
    </html>
  );
}
