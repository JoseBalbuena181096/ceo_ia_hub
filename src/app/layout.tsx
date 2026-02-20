import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const monda = localFont({
  src: "./fonts/Monda.ttf",
  variable: "--font-monda",
  display: "swap",
});

const nexa = localFont({
  src: [
    { path: "./fonts/NexaLight.otf", weight: "300", style: "normal" },
    { path: "./fonts/NexaRegular.otf", weight: "400", style: "normal" },
    { path: "./fonts/NexaXBold.otf", weight: "700", style: "normal" },
    { path: "./fonts/NexaHeavy.otf", weight: "900", style: "normal" },
  ],
  variable: "--font-nexa",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "VIAD HUB IA",
    template: "%s | VIAD HUB IA",
  },
  description: "Plataforma de Inteligencia Artificial de la Vicerrectoría de Inteligencia Artificial y Desarrollo Tecnológico Aplicado (VIAD) del Consorcio Educativo Oriente.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${monda.variable} ${nexa.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
