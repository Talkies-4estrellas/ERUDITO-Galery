import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import { ToastProvider } from "@/components/ToastProvider";
import AuroraFondo from "@/components/AuroraFondo";
import BarraNavInferior from "@/components/BarraNavInferior";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ERUDITO Galery",
  description: "Galería de arte — exposiciones y obras destacadas",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >

      {/* En celular los campos van a 16 px: con menos, iOS hace zoom al enfocarlos y la página queda cortada. */}
      <body suppressHydrationWarning className="min-h-full flex flex-col pb-[calc(6rem+env(safe-area-inset-bottom))] sm:pb-0 max-sm:[&_:is(input:not([type=checkbox],[type=radio],[type=range]),textarea,select)]:text-[16px]">
        {/* Previene el flash al leer localStorage antes del primer paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('erudito-tema');document.documentElement.setAttribute('data-theme',t==='claro'?'light':'dark');}catch(e){}})();`,
          }}
        />
        <AuroraFondo />
        <ToastProvider>
          {children}
          <Footer />
          <BarraNavInferior />
        </ToastProvider>
      </body>
    </html>
  );
}
