"use client";

import { useState } from "react";
import AuthDialog from "@/components/AuthDialog";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [authTab, setAuthTab] = useState<"login" | "register" | null>(null);

  return (
    <div className="min-h-screen bg-[#1F0F08] text-amber-50 flex flex-col font-sans">
      {/* HEADER / NAVABAR */}
      <header className="w-full border-b border-amber-900/40 bg-[#160A05]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xl">
              ♥
            </div>
            <div>
              <span className="text-2xl font-black tracking-wider text-amber-400 uppercase block leading-none">
                SenVeBen
              </span>
              <span className="text-[10px] tracking-widest text-amber-300/60 uppercase font-semibold">
                Daha Fazla Aşk
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-amber-200/80">
            <a href="#" className="hover:text-amber-400 transition-colors">Ana Sayfa</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Benim Sayfam</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Beğeniler</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Mesajlar</a>
            <a href="#" className="text-amber-400 font-semibold hover:text-amber-300">Premium</a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1 bg-[#120703] border border-amber-900/50 rounded-lg px-2 py-1 text-xs text-amber-300/80 font-mono">
              <span className="text-amber-400 font-bold">TR</span>
              <span className="text-amber-900">|</span>
              <span>EN</span>
              <span className="text-amber-900">|</span>
              <span>RU</span>
              <span className="text-amber-900">|</span>
              <span>AR</span>
            </div>

            <Button
              variant="outline"
              onClick={() => setAuthTab("login")}
              className="border-amber-900/60 bg-[#140804] text-amber-200 hover:bg-[#2A1309] hover:text-amber-100 rounded-xl px-4 h-9 text-xs font-semibold"
            >
              Giriş Yap
            </Button>
            <Button
              onClick={() => setAuthTab("register")}
              className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl px-4 h-9 text-xs shadow-lg shadow-amber-500/10"
            >
              Üye Ol
            </Button>
          </div>
        </div>
      </header>

      {/* CANLI BANT */}
      <div className="w-full bg-[#140804] border-b border-amber-900/30 py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-900/20 border border-amber-700/30 text-amber-300/90 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            CANLI GÖRÜNTÜLÜ • ANINDA MESAJ • 5 DİLDE İLETİŞİM
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center w-full">
          
          {/* SOL TARAFF */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/30 border border-amber-700/40 text-amber-300 text-xs font-semibold">
              <span className="text-amber-400">📍</span>
              81 ilden canlı üyeler
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-amber-50 tracking-tight leading-[1.15]">
              Aradığın kişi belki de sadece{" "}
              <span className="text-amber-400 block sm:inline">birkaç kilometre</span>{" "}
              uzakta.
            </h1>

            <p className="text-base sm:text-lg text-amber-200/70 max-w-xl leading-relaxed">
              Türkiye'nin 81 ilinde ve ilçelerinde yeni insanları keşfet. Sana uygun profilleri bul, beğen, eşleş ve tanış. Karşılıklı eşleştiğin kişilerle anında görüntülü konuş.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Button
                onClick={() => setAuthTab("register")}
                className="h-12 px-8 text-sm bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl shadow-xl shadow-amber-500/10 flex items-center justify-center gap-2"
              >
                <span>👤+</span> Ücretsiz Üye Ol
              </Button>
              <Button
                variant="outline"
                className="h-12 px-8 text-sm border-amber-900/60 bg-[#140804] text-amber-200 hover:bg-[#2A1309] rounded-xl flex items-center justify-center gap-2"
              >
                <span>🎥</span> Canlı Görüntülü Konuş
              </Button>
            </div>

            <div className="flex items-center gap-4 pt-2 text-xs text-amber-300/60">
              <div className="flex items-center gap-1.5 border border-amber-900/40 rounded-full px-3 py-1 bg-[#140804]/50">
                <span className="text-emerald-400">✓</span> Güvenli bağlantı
              </div>
              <div className="flex items-center gap-1.5 border border-amber-900/40 rounded-full px-3 py-1 bg-[#140804]/50">
                <span className="text-amber-400">文A</span> 5 Dil desteği
              </div>
            </div>
          </div>

          {/* SAĞ TARAF - AI VE KARTLAR */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#2A140B]/80 border border-amber-800/40 rounded-2xl p-6 shadow-2xl backdrop-blur-sm space-y-6">
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-lg font-bold shrink-0">
                  ✨
                </div>
                <div>
                  <h3 className="text-lg font-bold text-amber-100">
                    SENveBEN AI ile sınırları kaldırın
                  </h3>
                  <p className="text-xs text-amber-200/60 mt-1 leading-relaxed">
                    Farklı diller konuşan insanlarla daha kolay iletişim kurun. Siz kendi dilinizde yazın, SENveBEN AI mesajlarınızı anında çevirsin.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#180A04]/80 border border-amber-900/50 rounded-xl p-4 flex items-center gap-3">
                  <span className="text-amber-400 text-xl font-bold">文A</span>
                  <div>
                    <div className="text-lg font-bold text-amber-100 leading-none">5</div>
                    <div className="text-[11px] text-amber-300/60 mt-1">Dil desteği</div>
                  </div>
                </div>

                <div className="bg-[#180A04]/80 border border-amber-900/50 rounded-xl p-4 flex items-center gap-3">
                  <span className="text-amber-400 text-xl">📍</span>
                  <div>
                    <div className="text-lg font-bold text-amber-100 leading-none">81</div>
                    <div className="text-[11px] text-amber-300/60 mt-1">İl kapsamı</div>
                  </div>
                </div>
              </div>

              <div className="bg-[#180A04]/80 border border-amber-900/50 rounded-xl p-3 flex items-center gap-2 text-xs text-amber-300/80">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Güvenli bağlantı
              </div>
            </div>

            <div className="text-center italic text-xs text-amber-300/50 pt-2">
              "Aşkın her yaşta güzel..."
            </div>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-amber-900/30 bg-[#140804] py-6 text-center text-xs text-amber-300/40">
        © 2026 SENveBEN. Tüm hakları saklıdır.
      </footer>

      {/* MODAL */}
      <AuthDialog activeTab={authTab} onClose={() => setAuthTab(null)} />
    </div>
  );
}