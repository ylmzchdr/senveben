import Type { Metadata } from "next";
import Script from "next/script";
import Providers from "@/components/Providers";
import CookieConsent from "@/components/CookieConsent";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://senveben.com.tr"),
  title: {
    default: "SenVeBen | Türkiye'nin Arkadaşlık ve Tanışma Platformu",
    template: "%s | SenVeBen",
  },
  description:
    "SenVeBen, Türkiye'nin 81 ilinden yeni insanlarla tanışmak, arkadaşlık kurmak ve güvenli bağlantılar oluşturmak için modern bir arkadaşlık platformudur.",
  keywords: [
    "SenVeBen",
    "arkadaşlık sitesi",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="dark" style={{ colorScheme: "dark" }}>
      <head>
        {/* Google Analytics ve Harici Scriptler Buraya Gelecek */}
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-background bg-[#160c08]">
        <Providers>
          <div className="relative flex min-h-screen flex-col bg-background text-foreground bg-[#160c08]">
            <main className="flex-1 bg-background text-foreground bg-[#160c08]">
              {children}
            </main>
          </div>
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
