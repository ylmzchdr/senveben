"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Crown, Search } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import Header from "@/components/Header";
import { useI18n } from "@/lib/i18n-context";

export default function LikesPage() {
  const { t, lang } = useI18n();
  const [activeTab, setActiveTab] = useState<"received" | "sent">("received");

  return (
    <div className="min-h-screen bg-[#080503] text-amber-100" dir={lang === "AR" ? "rtl" : "ltr"}>
      <div className="lg:hidden">
        <Header />
      </div>

      <div className="flex min-h-screen">
        <div className="hidden shrink-0 lg:block">
          <div className="sticky top-0 h-screen">
            <Sidebar />
          </div>
        </div>

        <main className="relative min-w-0 flex-1 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1d0e06] via-[#0d0704] to-[#050302] p-4 sm:p-6 lg:p-8">
          <div className="hidden lg:block mb-6">
            <Topbar />
          </div>

          {/* Sayfa Ana Başlığı */}
          <div className="mb-8 rounded-3xl border border-amber-900/30 bg-[#140b07]/80 p-6 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Heart className="h-6 w-6 fill-amber-400" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-amber-100">{t.nav?.likes || "Beğeniler"}</h1>
                <p className="text-sm text-amber-300/70">Seni beğenenler ve senin beğendiklerin</p>
              </div>
            </div>

            {/* Sekmeler */}
            <div className="mt-6 flex border-b border-amber-900/40">
              <button
                onClick={() => setActiveTab("received")}
                className={`pb-3 text-sm font-bold transition-all ${
                  activeTab === "received"
                    ? "border-b-2 border-amber-400 text-amber-300"
                    : "text-amber-300/50 hover:text-amber-200"
                }`}
              >
                Seni Beğenenler (0)
              </button>
              <button
                onClick={() => setActiveTab("sent")}
                className={`ml-6 pb-3 text-sm font-bold transition-all ${
                  activeTab === "sent"
                    ? "border-b-2 border-amber-400 text-amber-300"
                    : "text-amber-300/50 hover:text-amber-200"
                }`}
              >
                Beğendiklerin (0)
              </button>
            </div>
          </div>

          {/* Premium Banner */}
          <div className="mb-8 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-950/60 via-[#261309] to-amber-950/60 p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-300">
                <Crown className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-amber-200">Kimler seni beğendiğini görmek ister misin?</h3>
                <p className="text-xs text-amber-300/70">Fotoğrafını görmek ve kim olduğunu keşfetmek için Premium'a geç.</p>
              </div>
            </div>
            <Link
              href="/premium"
              className="shrink-0 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-3 text-xs font-black text-slate-950 shadow-lg hover:from-amber-400 hover:to-amber-500 transition-all"
            >
              👑 Premium'a Geç
            </Link>
          </div>

          {/* Liste Boş Durumu */}
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-amber-900/40 bg-[#120a06]/40 p-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-900/20 text-amber-400 border border-amber-500/20">
              <Heart className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-amber-200">Henüz beğeni yok</h3>
            <p className="mt-1 max-w-sm text-xs text-amber-300/60">
              Yeni insanları keşfetmeye başla, eşleşme şansını katla!
            </p>
            <Link
              href="/discover"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-amber-500/10 px-5 py-2.5 text-xs font-bold text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-all"
            >
              <Search className="h-4 w-4" />
              Sana Uygun Kişiyi Bul
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}