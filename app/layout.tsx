import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Generador QHSE — Wirin Ambiental",
  description: "Generador Dinámico de Documentos QHSE para Wirin Ambiental. Crea y exporta documentos de Seguridad y Salud Ocupacional conformes al estándar legal chileno.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Roboto+Condensed:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
