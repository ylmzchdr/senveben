"use client";

import { useState } from "react";
import AuthDialog from "@/components/AuthDialog";

export default function Home() {
  const [authTab, setAuthTab] = useState<"login" | "register" | null>(null);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#160c08] text-[#eec590] px-4 text-center">
      {/* Üst Logo / Başlık Alanı */}
      <div className="mb-8">
        <h1 className="text-4xl font-black tracking-tight text-amber-100 mb-2">
          SenVeBen
        </h1>
        <p className="text-sm text-amber-200/70 max-w-sm">
          Türkiye'nin 81 ilinden yeni insanlarla tanışmak ve güvenli bağlantılar kurmak için doğru yerdesiniz.
        </p>
      </div>

      {/* Giriş ve Üye Ol Butonları */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs mb-12">
        <button
          type="button"
          onClick={() => setAuthTab("login")}
          className="flex-1 h-12 rounded-xl bg-amber-500 font-bold text-[#160c08] hover:bg-amber-400 transition duration-200 shadow-md"
        >
          Giriş Yap
        </button>
        <button
          type="button"
          onClick={() => setAuthTab("register")}
          className="flex-1 h-12 rounded-xl border border-amber-500/30 bg-[#1A0E08] font-bold text-amber-100 hover:border-amber-500 hover:bg-[#20120a] transition duration-200 shadow-sm"
        >
          Üye Ol
        </button>
      </div>

      {/* AuthDialog Bileşeni - Beklediği özellikler olan activeTab ve onClose ile düzeltildi */}
      <AuthDialog 
        activeTab={authTab} 
        onClose={() => setAuthTab(null)} 
      />

      {/* Alt Bilgi */}
      <p className="text-[11px] text-amber-300/30 absolute bottom-6">
        © 2026 SENveBEN. Tüm hakları saklıdır.
      </p>
    </div>
  );
}
