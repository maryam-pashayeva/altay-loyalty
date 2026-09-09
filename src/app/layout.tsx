import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/lib/session";

const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Altaywash Loyalty",
  description:
    "Altaywash loyallıq proqramı — bonus balansı, QR kart, kampaniyalar və yuma tarixçəsi.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Altaywash", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#f1f5f9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="az" className={inter.variable}>
      <body className="font-sans antialiased">
        <SessionProvider>
          <div className="app-shell">{children}</div>
        </SessionProvider>
      </body>
    </html>
  );
}
