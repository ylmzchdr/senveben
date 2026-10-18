"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import OnlineUsers from "../../components/OnlineUsers";
import {
  Camera,
  ChevronRight,
  Download,
  Heart,
  Loader2,
  MessageCircle,
  Search,
  Share2,
  Smartphone,
  User,
  X,
} from "lucide-react";

import Topbar from "@/components/dashboard/Topbar";
import Sidebar from "@/components/dashboard/Sidebar";
import { useI18n } from "@/lib/i18n-context";
import { api } from "@/lib/api";
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  const [installMessage, setInstallMessage] = useState("");

  const { t } = useI18n();

  const [user, setUser] = useState({
    name: "Üye",
    city: "Türkiye",
    profilePhoto: null as string | null,
  });

  useEffect(() => {
    const loadUser = async () => {
      setIsClient(true);

      try {
        const me: any = await api.users.me();

        localStorage.setItem("user", JSON.stringify(me));

        setUser({
          name: me.name || me.username || "Üye",
          city: me.city?.name || me.city || "Türkiye",
          profilePhoto:
            me.profilePhoto ||
            me.profileImage ||
            me.avatar ||
            null,
        });
      } catch (error) {
        console.log("Kullanıcı alınamadı:", error);

        try {
          const rawUser = localStorage.getItem("user");

          if (!rawUser) return;

          const parsed = JSON.parse(rawUser);

          setUser({
            name: parsed.name || parsed.username || "Üye",
            city: parsed.city?.name || parsed.city || "Türkiye",
            profilePhoto:
              parsed.profilePhoto ||
              parsed.profileImage ||
              parsed.avatar ||
              null,
          });
        } catch {
          // localStorage verisi bozuksa sessizce devam et.
        }
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const navigatorWithStandalone = navigator as Navigator & {
      standalone?: boolean;
    };

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      navigatorWithStandalone.standalone === true;

    const userAgent = navigator.userAgent.toLowerCase();

    const isiPhoneOrIPad =
      /iphone|ipad|ipod/.test(userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    setIsStandalone(standalone);
    setIsIOS(isiPhoneOrIPad);

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();

      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setInstallMessage("");
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
      setShowInstallHelp(false);
      setInstallMessage("senveben telefonuna başarıyla yüklendi.");
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );

      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isStandalone) {
      setInstallMessage("senveben zaten telefonunda yüklü.");
      return;
    }

    if (isIOS) {
      setShowInstallHelp(true);
      setInstallMessage("");
      return;
    }

    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();

        const choice = await deferredPrompt.userChoice;

        setDeferredPrompt(null);

        if (choice.outcome === "accepted") {
          setInstallMessage("senveben yükleniyor...");
        } else {
          setInstallMessage(
            "Kurulum iptal edildi. İstersen daha sonra tekrar deneyebilirsin."
          );
        }
      } catch (error) {
        console.log("PWA kurulum hatası:", error);

        setShowInstallHelp(true);
        setInstallMessage("");
      }

      return;
    }

    setShowInstallHelp(true);
    setInstallMessage("");
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-[#1F0F08] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#1F0F08] text-amber-50">
      <div className="flex min-h-screen w-full">

        {/* SOL SIDEBAR */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-[286px] shrink-0 bg-[#160A05] transition-transform duration-300 lg:sticky lg:top-0 lg:block lg:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        </aside>

        {/* SAĞ ANA İÇERİK */}
        <main className="min-h-screen min-w-0 flex-1 overflow-x-hidden">
          <div className="w-full pl-0 pr-4 pb-10 pt-4 sm:pr-5 md:pr-6 lg:pr-7 xl:pr-8">

            {/* =====================================================
                senveben LOGO + SLOGAN
            ===================================================== */}
            <div className="mb-2 flex w-full flex-col items-center justify-center gap-3 text-center">

              <div className="flex select-none items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/40 shadow-lg shadow-amber-500/20">
                  <span className="text-xl font-black tracking-tighter text-amber-400">
                    E
                  </span>
                </div>

                <h1 className="text-3xl font-black tracking-tight text-amber-400">
                  senveben
                  <span className="text-xl font-bold text-amber-300">
                    .TR
                  </span>
                </h1>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-amber-900/40 bg-[#140804] px-4 py-1.5 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
                </span>

                <p className="text-xs font-bold tracking-wide text-amber-300">
                  {t.dashboard.connectionTitle}
                </p>
              </div>
            </div>

            <div className="mb-6 w-full">
              <Topbar
                userName={user.name}
                userCity={user.city}
                profilePhoto={user.profilePhoto}
                onOpenMobileMenu={() => setIsSidebarOpen(true)}
              />
            </div>

            <OnlineUsers />

            <section className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">

              {/* PROFİLİM */}
              <Link href="/profile/edit" className="group min-w-0">
                <div className="h-full rounded-2xl border border-amber-900/40 bg-gradient-to-r from-[#2A1309] to-[#140804] p-5 transition-all hover:border-amber-500/60 hover:shadow-lg hover:shadow-amber-500/10">
                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/15">
                      <User className="h-6 w-6 text-amber-300" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="text-base font-black text-amber-100 md:text-lg">
                        Profilim
                      </h2>

                      <p className="mt-1 text-xs text-amber-200/60 md:text-sm">
                        {t.dashboard.profileDesc}
                      </p>
                    </div>

                    <ChevronRight className="h-5 w-5 shrink-0 text-amber-300 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>

              {/* BİRİNİ BUL */}
              <Link href="/search" className="group min-w-0">
                <div className="h-full rounded-2xl border border-amber-900/40 bg-[#140804] p-5 transition-all hover:bg-[#1A0B05]">
                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-900/50 bg-[#120703]">
                      <Search className="h-6 w-6 text-amber-300" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="text-base font-black text-amber-100 md:text-lg">
                        {t.dashboard.find}
                      </h2>

                      <p className="mt-1 truncate text-xs text-amber-200/60 md:text-sm">
                        {t.dashboard.findProfileDesc}
                      </p>
                    </div>

                    <ChevronRight className="h-5 w-5 shrink-0 text-amber-300 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>

            </section>

            <section className="mt-6 grid w-full grid-cols-1 gap-6 md:grid-cols-2">

              {/* CANLI SOHBET */}
              <Link href="/messages" className="group block min-w-0">
                <div className="relative h-full overflow-hidden rounded-3xl border border-amber-900/40 bg-gradient-to-br from-[#2A1309] to-[#140804] p-6 shadow-xl shadow-amber-500/5 backdrop-blur-xl transition-all duration-300 hover:border-amber-500/60">

                  <div className="absolute right-0 top-0 -mr-10 -mt-10 h-32 w-32 rounded-full bg-amber-500/10 blur-3xl transition-all duration-500 group-hover:bg-amber-500/20" />

                  <div className="relative mb-4 flex items-center gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/20">
                      <Camera className="h-5 w-5 animate-pulse text-amber-400" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-sm font-bold tracking-wide text-amber-100 md:text-base">
                        {t.dashboard.liveChatTitle}
                      </h3>

                      <span className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-emerald-400">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                        {t.dashboard.liveChatStatus}
                      </span>
                    </div>

                  </div>

                  <p className="relative text-xs leading-relaxed tracking-wide text-amber-200/70 md:text-sm">
                    {t.dashboard.liveChatDesc}
                  </p>

                </div>
              </Link>

              {/* TELEFONA YÜKLE */}
              <div className="relative h-full min-w-0 overflow-hidden rounded-3xl border border-amber-900/40 bg-gradient-to-br from-[#1F0F08] via-[#140804] to-[#2A1309] p-6 shadow-xl shadow-amber-500/5 backdrop-blur-xl">

                <div className="absolute right-0 top-0 -mr-10 -mt-10 h-32 w-32 rounded-full bg-amber-500/10 blur-3xl" />

                <div className="relative flex h-full flex-col">

                  <div className="mb-4 flex items-center gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10">
                      <Smartphone className="h-5 w-5 text-amber-400" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-sm font-bold tracking-wide text-amber-100 md:text-base">
                        senveben&apos;ı Telefona Yükle
                      </h3>

                      <span
                        className={`mt-1 inline-block rounded-md border px-2 py-1 text-[9px] font-bold tracking-wider ${
                          isStandalone
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                            : "border-amber-500/20 bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        {isStandalone ? "TELEFONUNDA YÜKLÜ" : "ÜCRETSİZ"}
                      </span>
                    </div>

                  </div>

                  <p className="relative mb-4 text-xs leading-relaxed tracking-wide text-amber-200/70 md:text-sm">
                    senveben&apos;a ana ekranından tek dokunuşla ulaş.
                    Tarayıcıyı açmadan uygulama gibi kullan.
                  </p>

                  {!isStandalone && (
                    <button
                      type="button"
                      onClick={handleInstallClick}
                      className="relative mt-auto flex w-full items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500 hover:bg-amber-600 px-4 py-3 text-sm font-black text-stone-950 transition-all shadow-lg shadow-amber-500/10 active:scale-[0.99]"
                    >
                      <Download className="h-4 w-4" />
                      Telefona Yükle
                    </button>
                  )}

                  {isStandalone && (
                    <div className="relative mt-auto flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-400">
                      <Smartphone className="h-4 w-4" />
                      senveben Telefonunda
                    </div>
                  )}

                  {installMessage && (
                    <p className="mt-3 text-xs leading-relaxed text-amber-300">
                      {installMessage}
                    </p>
                  )}

                </div>
              </div>

            </section>

            {/* PWA KURULUM YARDIMI */}
            {showInstallHelp && !isStandalone && (
              <div className="mt-4 overflow-hidden rounded-2xl border border-amber-900/40 bg-[#160A05] shadow-xl shadow-black/20">

                <div className="flex items-start justify-between gap-4 p-5">

                  <div className="flex min-w-0 gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10">
                      <Share2 className="h-5 w-5 text-amber-400" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-sm font-black text-amber-100">
                        {isIOS
                          ? "iPhone'a senveben Nasıl Eklenir?"
                          : "senveben'ı Ana Ekrana Ekle"}
                      </h3>

                      {isIOS ? (
                        <p className="mt-2 text-xs leading-6 text-amber-200/70 md:text-sm">
                          Safari&apos;de alttaki
                          <span className="font-bold text-amber-300">
                            {" "}Paylaş{" "}
                          </span>
                          simgesine dokun. Açılan menüden
                          <span className="font-bold text-white">
                            {" "}Ana Ekrana Ekle{" "}
                          </span>
                          seçeneğini seç ve ardından
                          <span className="font-bold text-amber-300">
                            {" "}Ekle
                          </span>
                          butonuna dokun.
                        </p>
                      ) : (
                        <p className="mt-2 text-xs leading-6 text-amber-200/70 md:text-sm">
                          Tarayıcının menüsünü aç ve
                          <span className="font-bold text-white">
                            {" "}Uygulamayı yükle{" "}
                          </span>
                          veya
                          <span className="font-bold text-white">
                            {" "}Ana ekrana ekle{" "}
                          </span>
                          seçeneğini kullan. Kurulum seçeneği görünmüyorsa
                          sayfayı normal tarayıcı sekmesinde açıp tekrar dene.
                        </p>
                      )}
                    </div>

                  </div>

                  <button
                    type="button"
                    aria-label="Kurulum yardımını kapat"
                    onClick={() => setShowInstallHelp(false)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-900/40 bg-[#120703] text-amber-300 transition hover:bg-amber-900/20 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>

                </div>
              </div>
            )}

            {/* =====================================================
                ALT KARTLAR
            ===================================================== */}
            <section className="mt-6 grid w-full grid-cols-2 gap-4 md:grid-cols-2">

              {/* YENİ BEĞENİ */}
              <Link
                href="/likes"
                className="flex h-28 min-w-0 flex-col justify-between rounded-2xl border border-amber-900/40 bg-[#160A05] p-4 transition-all hover:border-amber-500/40"
              >
                <Heart className="h-4 w-4 text-amber-500" />

                <div>
                  <span className="block text-xs font-bold text-amber-100">
                    {t.dashboard.newLike}
                  </span>

                  <span className="mt-0.5 block text-[10px] font-semibold text-emerald-400">
                    ● {t.dashboard.active}
                  </span>
                </div>
              </Link>

              {/* MESAJLAR */}
              <Link
                href="/messages"
                className="flex h-28 min-w-0 flex-col justify-between rounded-2xl border border-amber-900/40 bg-[#160A05] p-4 transition-all hover:border-amber-500/40"
              >
                <MessageCircle className="h-4 w-4 text-amber-400" />

                <div>
                  <span className="block text-xs font-bold text-amber-100">
                    {t.dashboard.messages}
                  </span>

                  <span className="mt-0.5 block text-[10px] font-medium text-amber-300/50">
                    {t.dashboard.openChats}
                  </span>
                </div>
              </Link>

            </section>

            {/* ALT BOŞLUK */}
            <div className="h-10" />

          </div>
        </main>
      </div>
    </div>
  );
}