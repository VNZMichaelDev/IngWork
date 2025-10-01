import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ConstruMatch - Conecta Clientes con Profesionales de la Construcción",
  description: "Marketplace para conectar clientes con profesionales de la construcción. Encuentra expertos especializados, recibe propuestas y gestiona tus proyectos de obra en un solo lugar.",
  keywords: "construcción, proyectos, profesionales, marketplace, obras, arquitectura, ingeniería civil, contratistas",
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
