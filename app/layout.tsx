import type { Metadata, Viewport } from "next";
import "./globals.css";
import PwaInstall from "@/components/PwaInstall";

export const metadata: Metadata = {
  title: "CAM Dashboard",
  description: "Dashboard Regalos y Piñatas — Grupo Comercial CAM",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CAM Dashboard",
  },
};

export const viewport: Viewport = {
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-gray-50 font-sans antialiased">
        <PwaInstall />
        <div className="max-w-md mx-auto min-h-dvh">
          {children}
        </div>
      </body>
    </html>
  );
}
