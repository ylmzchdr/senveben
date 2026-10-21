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
        {/* Google Analytics ve Harici Scriptler */}
      </head>
      <body className="min-h-screen bg-[#160c08] text-[#fff5df] antialiased selection:bg-[#ffc928] selection:text-[#160c08]">
        <Providers>
          {/* Dil seçeneklerini ve karanlık butonları görünür kılan akıllı CSS */}
          <style dangerouslySetInnerHTML={{__html: `
            input, select, textarea {
              background-color: #21170f !important;
              border: 1px solid #5b4027 !important;
              color: #fff5df !important;
            }
            .bg-card, [class*="bg-card"], div[class*="rounded-xl"] {
              background-color: #1f120c !important;
              border: 1px solid #35271b !important;
            }
            /* Üst menüdeki arama, dil ve tüm buton simgelerini altın sarısı yap */
            svg, .icon, [class*="icon-"], button i {
              color: #ffc928 !important;
              fill: #ffc928 !important;
            }
            /* Dil seçeneği yuvarlak alanlarını ve metinlerini zorla görünür yap */
            [class*="language"], [class*="lang"], .dropdown, [class*="select-"] {
              color: #ffc928 !important;
              border-color: #5b4027 !important;
            }
          `}} />
          <div className="relative flex min-h-screen flex-col bg-[#160c08] text-[#fff5df]">
            <main className="flex-1 bg-[#160c08] text-[#fff5df]">
              {children}
            </main>
          </div>
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
