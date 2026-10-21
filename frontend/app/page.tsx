"use client";

import { useState } from "react";
import AuthDialog from "@/components/AuthDialog";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [authTab, setAuthTab] = useState<"login" | "register" | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-background">
      {/* HEADER / NAVBAR */}
      <header className="w-full border-b border-main-border bg-card/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold text-xl">
              ♥
            </div>
            <div>
              <span className="text-2xl font-black tracking-wider text-primary uppercase block leading-none">
                SenVeBen
              </span>
              <span className="text-[10px] tracking-widest text-muted-foreground uppercase font-semibold">
                Daha Fazla Aşk
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Ana Sayfa</a>
            <a href="/dashboard" className="hover:text-primary transition-colors">Taş Port</a>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => setAuthTab("login")}
              className="text-foreground hover:text-primary hover:bg-secondary"
            >
              Giriş Yap
            </Button>
            <Button
              onClick={() => setAuthTab("register")}
              className="bg-primary text-background hover:bg-theme-300 font-semibold"
            >
              Kayıt Ol
            </Button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-primary leading-tight mb-6">
            Türkiye'nin Arkadaşlık ve Sosyal Portalı
          </h1>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            Tamamen yenilenen arayüzü and Taş Port platformuyla aradığınız topluluğu, etkinlikleri ve gerçek arkadaşlıkları keşfetmeye hemen başlayın.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              onClick={() => setAuthTab("register")}
              className="bg-primary text-background hover:bg-theme-300 text-base font-bold px-8 h-14"
            >
              Hemen Ücretsiz Üye Ol
            </Button>
            <a href="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="border-main-border bg-card text-foreground hover:bg-secondary text-base font-semibold px-8 h-14 w-full sm:w-auto"
              >
                Taş Port Paneline Git
              </Button>
            </a>
          </div>
        </div>
      </main>

      {/* AUTHENTICATION DIALOG (LOGIN / REGISTER) */}
      <AuthDialog
        isOpen={authTab !== null}
        onClose={() => setAuthTab(null)}
        defaultTab={authTab || "login"}
      />
    </div>
  );
}
