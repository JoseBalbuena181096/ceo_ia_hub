import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ChatProvider } from "@/components/chat/chat-provider";
import { createClient } from "@/lib/supabase/server";

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
    default: "VIAD HUB",
    template: "%s | VIAD HUB",
  },
  description: "Clínicas de Entrenamiento de IA — Consorcio Educativo de Oriente.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="es">
      <body
        className={`${monda.variable} ${nexa.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
        <ChatProvider userId={user?.id ?? null} />
        <Toaster />
      </body>
    </html>
  );
}
