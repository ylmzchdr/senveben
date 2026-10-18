"use client";

import {
  Bell,
  Check,
  ChevronDown,
  Crown,
  Languages,
  LogOut,
  Menu,
  MessageCircle,

  Search,
  Settings,
  ShieldCheck,
  Sparkles,

  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import type { Lang } from "@/lib/i18n";

type TopbarProps = {
  userName?: string;
  userCity?: string;
  profilePhoto?: string | null;
  isPremium?: boolean;
  unreadMessages?: number;
  unreadNotifications?: number;
  onOpenMobileMenu?: () => void;
};

type ActivePanel =
  | "notifications"
  | "messages"
  | "language"
  | "profile"
  | null;

type ThemeMode = "dark" | "light";

const languages: Array<{
  code: Lang;
  shortLabel: string;
  label: string;
  flag: string;
}> = [
  {
    code: "TR",
    shortLabel: "TR",
    label: "Türkçe",
    flag: "🇹🇷",
  },
  {
    code: "AZ",
    shortLabel: "AZ",
    label: "Azərbaycan",
    flag: "🇦🇿",
  },
  {
    code: "EN",
    shortLabel: "EN",
    label: "English",
    flag: "🇬🇧",
  },
  {
    code: "RU",
    shortLabel: "RU",
    label: "Русский",
    flag: "🇷🇺",
  },
  {
    code: "AR",
    shortLabel: "AR",
    label: "العربية",
    flag: "🇸🇦",
  },
];

export default function Topbar({
  userName = "Üye",
  userCity = "Türkiye",
  profilePhoto = null,
  isPremium = false,
  unreadMessages = 0,
  unreadNotifications = 0,
  onOpenMobileMenu,
}: TopbarProps) {
  const router = useRouter();
  const { lang, setLang } = useI18n();

  const [activePanel, setActivePanel] =
    useState<ActivePanel>(null);

  const [searchValue, setSearchValue] =
    useState("");

  const [theme, setTheme] =
    useState<ThemeMode>("dark");

  const topbarRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedTheme =
      localStorage.getItem("senveben-theme");

    const initialTheme: ThemeMode =
      storedTheme === "light" ||
      storedTheme === "dark"
        ? storedTheme
        : "dark";

    setTheme(initialTheme);

    document.documentElement.classList.toggle(
      "dark",
      initialTheme === "dark",
    );

    document.documentElement.classList.toggle(
      "light",
      initialTheme === "light",
    );
  }, []);

  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent,
    ) => {
      if (
        topbarRef.current &&
        !topbarRef.current.contains(
          event.target as Node,
        )
      ) {
        setActivePanel(null);
      }
    };

    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setActivePanel(null);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );

      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, []);

  const togglePanel = (
    panel: Exclude<ActivePanel, null>,
  ) => {
    setActivePanel((currentPanel) =>
      currentPanel === panel
        ? null
        : panel,
    );
  };

  const handleSearch = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const query = searchValue.trim();

    if (!query) {
      router.push("/search");
      return;
    }

    router.push(
      `/search?q=${encodeURIComponent(query)}`,
    );

    setActivePanel(null);
  };

  const handleLanguageChange = (
    languageCode: Lang,
  ) => {
    setLang(languageCode);
    setActivePanel(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.clear();

    document.cookie =
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    document.cookie =
      "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    document.cookie =
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    router.push("/");
    router.refresh();
  };

  const currentLanguage =
    languages.find(
      (language) =>
        language.code === lang,
    ) || languages[0];

  return (
    <div
      ref={topbarRef}
      className="relative z-50 mb-7 rounded-[26px] border border-amber-900/40 bg-[#160A05] px-3 py-3 shadow-md"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"
      />

      <div className="flex items-center gap-2.5">
        {/* MOBİL MENÜ */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Menüyü aç"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-amber-900/50 bg-[#120703] text-amber-200 hover:bg-amber-900/30 hover:text-amber-400"
        >
          <Menu
            className="h-5 w-5"
            strokeWidth={1.9}
          />
        </button>

        {/* ARAMA */}
        <form
          onSubmit={handleSearch}
          className="group relative hidden min-w-0 flex-1 md:block md:max-w-[420px] lg:max-w-[450px] xl:max-w-[480px]"
        >
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-amber-400/60 transition-colors duration-300 group-focus-within:text-amber-400"
            strokeWidth={1.9}
          />

          <input
            type="search"
            value={searchValue}
            onChange={(event) =>
              setSearchValue(
                event.target.value,
              )
            }
            placeholder="İsim, şehir veya kullanıcı adı ara..."
            aria-label="Üye ara"
            className="h-11 w-full rounded-2xl border border-amber-900/50 bg-[#120703] pl-11 pr-20 text-base font-normal text-amber-100 placeholder-amber-300/40 outline-none transition-all focus:border-amber-500/60 focus:bg-[#180A04] focus:ring-2 focus:ring-amber-500/20"
          />

          <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-lg border border-amber-900/40 bg-[#160A05] px-2 py-1 text-[9px] font-bold text-amber-300/60 xl:block">
            ENTER
          </span>
        </form>

        {/* MOBİL ARAMA */}
        <Link
          href="/search"
          aria-label="Üye ara"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-amber-900/50 bg-[#120703] text-amber-300 transition-all duration-300 hover:border-amber-500/40 hover:bg-amber-900/30 hover:text-amber-400 md:hidden"
        >
          <Search
            className="h-[19px] w-[19px]"
            strokeWidth={1.9}
          />
        </Link>

        {/* SAĞ KONTROLLER */}
        <div className="ml-auto flex min-w-0 shrink-0 items-center gap-2">

          {/* DİLLER */}
          <div className="hidden items-center gap-1 sm:flex">
            {languages.map((language) => {
              const isSelected = lang === language.code;

              return (
                <button
                  key={language.code}
                  type="button"
                  onClick={() => handleLanguageChange(language.code)}
                  aria-label={`${language.label} diline geç`}
                  className={[
                    "flex h-9 min-w-[38px] items-center justify-center rounded-xl px-2",
                    "text-[11px] font-extrabold transition-all duration-200",
                    isSelected
                      ? "border border-amber-500 bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/10"
                      : "border border-amber-900/50 bg-[#120703] text-amber-200/80 hover:border-amber-700/50 hover:bg-amber-900/30 hover:text-amber-300"
                  ].join(" ")}
                >
                  {language.shortLabel}
                </button>
              );
            })}
          </div>

          {/* MESAJLAR */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                togglePanel("messages")
              }
              aria-label="Mesajlar"
              aria-expanded={
                activePanel === "messages"
              }
              className={[
                "relative flex h-11 shrink-0 items-center justify-center gap-2 rounded-2xl border px-3 transition-all duration-300",
                activePanel === "messages"
                  ? "border-amber-500 bg-amber-500/20 text-amber-300 font-semibold"
                  : "border-amber-900/50 bg-[#120703] text-amber-200/80 hover:border-amber-700/50 hover:bg-amber-900/30 hover:text-amber-300"
              ].join(" ")}
            >
              <MessageCircle
                className="h-[19px] w-[19px]"
                strokeWidth={1.9}
              />

              <span className="hidden text-xs font-bold md:inline">
                Mesajlar
              </span>

              {unreadMessages > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#160A05] bg-amber-500 px-1 text-[9px] font-black text-stone-950">
                  {unreadMessages > 99
                    ? "99+"
                    : unreadMessages}
                </span>
              )}
            </button>

            {activePanel === "messages" && (
              <div className="absolute right-0 top-[calc(100%+12px)] w-[320px] max-w-[calc(100vw-24px)] overflow-hidden rounded-[24px] border border-amber-900/50 bg-[#160A05]/95 shadow-2xl backdrop-blur-2xl">
                <div className="flex items-center justify-between border-b border-amber-900/40 px-4 py-4">
                  <div>
                    <p className="text-base font-extrabold text-amber-100">
                      Mesajlar
                    </p>

                    <p className="mt-0.5 text-[10px] text-amber-200/60">
                      Son konuşmaların
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setActivePanel(null)
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-amber-200/60 transition hover:bg-amber-900/30 hover:text-amber-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="px-5 py-8 text-center">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
                    <MessageCircle
                      className="h-5 w-5"
                      strokeWidth={1.8}
                    />
                  </span>

                  <p className="mt-4 text-xs font-bold text-amber-200">
                    Mesaj önizlemeleri hazırlanıyor
                  </p>

                  <p className="mt-1.5 text-[10px] leading-5 text-amber-200/60">
                    Gerçek mesaj verileri bağlandığında son konuşmalar burada görünecek.
                  </p>
                </div>

                <Link
                  href="/messages"
                  onClick={() =>
                    setActivePanel(null)
                  }
                  className="flex min-h-11 items-center justify-center border-t border-amber-900/40 text-xs font-bold text-amber-400 transition hover:bg-amber-900/20"
                >
                  Tüm mesajları aç
                </Link>
              </div>
            )}
          </div>

          {/* BİLDİRİMLER */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                togglePanel("notifications")
              }
              aria-label="Bildirimler"
              aria-expanded={
                activePanel ===
                "notifications"
              }
              className={[
                "relative flex h-11 shrink-0 items-center justify-center gap-2 rounded-2xl border px-3 transition-all duration-300",
                activePanel === "notifications"
                  ? "border-amber-500 bg-amber-500/20 text-amber-300 font-semibold"
                  : "border-amber-900/50 bg-[#120703] text-amber-200/80 hover:border-amber-700/50 hover:bg-amber-900/30 hover:text-amber-300"
              ].join(" ")}
            >
              <Bell
                className="h-[19px] w-[19px]"
                strokeWidth={1.9}
              />

              <span className="hidden text-xs font-bold md:inline">
                Bildirimler
              </span>

              {unreadNotifications > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#160A05] bg-amber-500 px-1 text-[9px] font-black text-stone-950">
                  {unreadNotifications > 99
                    ? "99+"
                    : unreadNotifications}
                </span>
              )}
            </button>

            {activePanel ===
              "notifications" && (
              <div className="absolute right-0 top-[calc(100%+12px)] w-[340px] max-w-[calc(100vw-24px)] overflow-hidden rounded-[24px] border border-amber-900/50 bg-[#160A05]/95 shadow-2xl backdrop-blur-2xl">
                <div className="flex items-center justify-between border-b border-amber-900/40 px-4 py-4">
                  <div>
                    <p className="text-base font-extrabold text-amber-100">
                      Bildirimler
                    </p>

                    <p className="mt-0.5 text-[10px] text-amber-200/60">
                      Hesabındaki son gelişmeler
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setActivePanel(null)
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-amber-200/60 transition hover:bg-amber-900/30 hover:text-amber-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="px-5 py-8 text-center">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
                    <Bell
                      className="h-5 w-5"
                      strokeWidth={1.8}
                    />
                  </span>

                  <p className="mt-4 text-xs font-bold text-amber-200">
                    Yeni bildirimin bulunmuyor
                  </p>

                  <p className="mt-1.5 text-[10px] leading-5 text-amber-200/60">
                    Beğeni, mesaj ve profil hareketleri burada gösterilecek.
                  </p>
                </div>

                <Link
                  href="/notifications"
                  onClick={() =>
                    setActivePanel(null)
                  }
                  className="flex min-h-11 items-center justify-center border-t border-amber-900/40 text-xs font-bold text-amber-400 transition hover:bg-amber-900/20"
                >
                  Bildirim merkezini aç
                </Link>
              </div>
            )}
          </div>

          {/* PROFİL */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                togglePanel("profile")
              }
              aria-expanded={
                activePanel === "profile"
              }
              className={[
                "flex h-11 shrink-0 items-center gap-2 rounded-2xl border p-1.5 pr-2.5 transition-all duration-300",
                activePanel === "profile"
                  ? "border-amber-500 bg-amber-500/20 text-amber-300"
                  : "border-amber-900/50 bg-[#120703] text-amber-200/80 hover:border-amber-700/50 hover:bg-amber-900/30 hover:text-amber-300"
              ].join(" ")}
            >
              <span className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-amber-500 to-amber-700">
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt={`${userName} profil fotoğrafı`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound
                    className="h-[17px] w-[17px] text-stone-950"
                    strokeWidth={1.9}
                  />
                )}

                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#160A05] bg-emerald-400" />
              </span>

              <div className="hidden min-w-0 pr-1 text-left sm:flex sm:flex-col">
                <span className="block max-w-28 truncate text-xs font-black text-amber-100">
                  {userName}
                </span>

                <span className="block max-w-28 truncate text-[10px] font-medium text-amber-400">
                  {userCity}
                </span>
              </div>

              <ChevronDown
                className={[
                  "hidden h-3.5 w-3.5 text-amber-400/70 transition-transform duration-300 xl:block",
                  activePanel === "profile"
                    ? "rotate-180"
                    : "",
                ].join(" ")}
              />
            </button>

            {activePanel === "profile" && (
              <div className="absolute right-0 top-[calc(100%+12px)] w-72 overflow-hidden rounded-[24px] border border-amber-900/50 bg-[#160A05]/95 p-2 shadow-2xl backdrop-blur-2xl">
                <div className="relative overflow-hidden rounded-[19px] border border-amber-900/40 bg-gradient-to-br from-amber-900/30 via-[#2A1309]/40 to-transparent p-4">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-lg shadow-amber-500/20">
                      {profilePhoto ? (
                        <img
                          src={profilePhoto}
                          alt={`${userName} profil fotoğrafı`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UserRound
                          className="h-6 w-6 text-stone-950"
                          strokeWidth={1.8}
                        />
                      )}
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-base font-extrabold text-amber-100">
                          {userName}
                        </p>

                        {isPremium && (
                          <Crown className="h-3.5 w-3.5 text-amber-400" />
                        )}
                      </div>

                      <p className="mt-1 truncate text-[10px] text-amber-200/60">
                        {userCity}
                      </p>

                      <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Çevrimiçi
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-2 space-y-1">
                  <Link
                    href="/profile"
                    onClick={() =>
                      setActivePanel(null)
                    }
                    className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-xs font-bold text-amber-200/80 transition hover:bg-amber-900/20 hover:text-amber-100"
                  >
                    <UserRound className="h-4 w-4 text-amber-400" />
                    Profilimi görüntüle
                  </Link>

                  <Link
                    href="/profile/edit"
                    onClick={() =>
                      setActivePanel(null)
                    }
                    className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-xs font-bold text-amber-200/80 transition hover:bg-amber-900/20 hover:text-amber-100"
                  >
                    <Settings className="h-4 w-4 text-amber-400" />
                    Profili düzenle
                  </Link>

                  <Link
                    href="/premium"
                    onClick={() =>
                      setActivePanel(null)
                    }
                    className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-xs font-bold text-amber-200/80 transition hover:bg-amber-900/20 hover:text-amber-400"
                  >
                    <Crown className="h-4 w-4 text-amber-400" />
                    Premium özellikler
                  </Link>

                  <Link
                    href="/help"
                    onClick={() =>
                      setActivePanel(null)
                    }
                    className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-xs font-bold text-amber-200/80 transition hover:bg-amber-900/20 hover:text-amber-100"
                  >
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    Güvenlik merkezi
                  </Link>
                </div>

                {!isPremium && (
                  <Link
                    href="/premium"
                    onClick={() =>
                      setActivePanel(null)
                    }
                    className="mt-2 flex items-center gap-3 rounded-2xl border border-amber-700/30 bg-gradient-to-r from-amber-900/40 to-[#2A1309] px-3 py-3 transition hover:border-amber-500/40"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                      <Sparkles className="h-4 w-4" />
                    </span>

                    <span className="min-w-0">
                      <span className="block text-[11px] font-extrabold text-amber-100">
                        Premium’a yükselt
                      </span>

                      <span className="mt-0.5 block text-[9px] text-amber-200/60">
                        Daha fazla görünürlük kazan
                      </span>
                    </span>
                  </Link>
                )}

                <div className="my-2 h-px bg-amber-900/40" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-xs font-bold text-amber-200/60 transition hover:bg-red-500/10 hover:text-red-400"
                >
                  <LogOut className="h-4 w-4" />
                  Güvenli çıkış yap
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}