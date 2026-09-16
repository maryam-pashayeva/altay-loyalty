import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/lib/session";
import { LanguageProvider } from "@/lib/i18n";

const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter" });

/**
 * Rəqəmlər, nişanlar və bölmə başlıqları üçün. Barlow nəqliyyat lövhələri
 * üçün çəkilmiş qroteskdir — dövlət nişanı və sayğac dili ilə eyni ailədən.
 * Mətn üçün istifadə olunmur; yalnız vurğu rolunda.
 */
const display = Barlow_Condensed({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow",
});

export const metadata: Metadata = {
  title: "Altaywash Loyalty",
  description:
    "Altaywash loyallıq proqramı — bonus balansı, QR kart, kampaniyalar və yuma tarixçəsi.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Altaywash", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#eef2f7",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="az" className={`${inter.variable} ${display.variable}`}>
      <body className="font-sans antialiased">
        <LanguageProvider>
          <SessionProvider>
            <div className="app-shell">{children}</div>
          </SessionProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
