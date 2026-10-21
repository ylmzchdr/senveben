"use client";

import { useState } from "react";
import AuthDialog from "@/components/AuthDialog";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [authTab, setAuthTab] = useState<"login" | "register" | null>(null);

  return (
    <div className="min-h-screen bg-[#1f0f08] text-amber-50 flex flex-col font-sans">
      {/* HEADER / NAVBAR */}
      <header className="w-full border-b border-amber-900/40 bg-[#160a05]/90 backdrop-blur-md sticky top-0 z-40">
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
            <a href="/dashboard" className="hover:text-amber-400 transition-colors">Taş Port</a>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => setAuthTab("login")}
              className="text-amber-100 hover:text-amber-400"
            >
              Giriş Yap
            </Button>
            <Button
              onClick={() => setAuthTab("register")}
              className="bg-amber-400 text-amber-950 hover:bg-amber-300 font-semibold"
            >
              Kayıt Ol
            </Button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-amber-400 leading-tight mb-6 max-w-4xl">
          Türkiye'nin Arkadaşlık ve Sosyal Portalı
        </h1>
        <p className="text-lg text-amber-200/60 mb-10 max-w-2xl leading-relaxed">
          Aradığınız topluluğu, etkinlikleri ve gerçek arkadaşlıkları keşfetmeye hemen başlayın.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
          <Button
            size="lg"
            onClick={() => setAuthTab("register")}
            className="bg-amber-400 text-amber-950 hover:bg-amber-300 text-base font-bold px-8 h-14"
          >
            Hemen Ücretsiz Üye Ol
          </Button>
        </div>
      </main>

      {/* DIALOGS */}
      <AuthDialog
        isOpen={authTab !== null}
        onClose={() => setAuthTab(null)}
        defaultTab={authTab || "login"}
      />
    </div>
  );
}
