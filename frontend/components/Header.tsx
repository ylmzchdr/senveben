
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n-context";
import type { Lang } from "@/lib/i18n";

type HeaderProps = {
  onOpenLogin?: () => void;
  onOpenRegister?: () => void;
};

type MeResponse = {
  name?: string | null;
  surname?: string | null;
  email?: string | null;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://senveben-backend.onrender.com";

const languages: { code: Lang; label: string }[] = [
  { code: "TR", label: "Türkçe" },
  { code: "AZ", label: "Azərbaycan" },
  { code: "EN", label: "English" },
  { code: "RU", label: "Русский" },
  { code: "AR", label: "العربية" },
];

const welcomeByLang: Record<Lang, string> = {
  TR: "Hoş geldin",
  AZ: "Xoş gəlmisən",
  EN: "Welcome",
  RU: "Добро пожаловать",
  AR: "مرحباً",
};

function getFirstName(user: MeResponse | null) {
  const fullName = `${user?.name || ""} ${user?.surname || ""}`.trim();

  if (fullName) {
    return fullName.split(" ")[0];
  }

  if (user?.email) {
    return user.email.split("@")[0];
  }

  return "Benim Sayfam";
}

export default function Header({ onOpenLogin, onOpenRegister }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const { lang, setLang, t } = useI18n();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setIsLoggedIn(false);
      setUserName(null);
      return;
    }

    setIsLoggedIn(true);

    const fetchMe = async () => {
      try {
        const res = await fetch(`/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          setUserName(null);
          return;
        }

        const data = await res.json();
        const user = data.user || data.profile || data;
        setUserName(getFirstName(user));
      } catch {
        setUserName(null);
      }
    };

    fetchMe();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    setUserName(null);
    window.location.href = "/";
  };

  const loggedInLabel = userName
    ? `${welcomeByLang[lang] || welcomeByLang.TR} ${userName}`
    : `${welcomeByLang[lang] || welcomeByLang.TR}`;

  const navItems = [
    { label: t.nav.home, href: "/" },
    { label: t.nav.dashboard, href: "/dashboard" },
    { label: t.nav.likes, href: "/likes" },
    { label: t.nav.messages, href: "/messages" },
    { label: t.nav.premium, href: "/premium" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#110D0A] text-[#FDE68A] shadow-md border-b border-[#D97706]/30 font-sans">
      <div className="mx-auto max-w-7xl px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <Heart className="w-7 h-7 text-[#FBBF24] fill-[#FBBF24]" />
          <span className="text-xl font-black tracking-tighter text-[#FDE68A] lowercase">
            senveben
          </span>
        </Link>

        <nav className="hidden lg:flex gap-6" aria-label="Ana navigasyon">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[#FDE68A]/80 hover:text-[#FBBF24] transition font-bold text-base no-underline"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex gap-2 items-center">
          <div className="flex items-center bg-[#2B1408] rounded border border-[#D97706]/30 p-0.5">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`px-2 py-1 rounded text-xs font-bold transition ${
                  lang === l.code
                    ? "bg-[#FBBF24] text-[#110D0A] shadow-sm"
                    : "text-[#FDE68A]/70 hover:text-[#FDE68A] hover:bg-[#D97706]/20"
                }`}
              >
                {l.code}
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-[#D97706]/30 mx-2" />

          {isLoggedIn ? (
            <>
              <Link
                href="/profile"
                className="bg-[#2B1408] text-[#FBBF24] border border-[#D97706]/40 font-bold text-xs h-8 px-4 rounded flex items-center no-underline max-w-[220px] truncate"
              >
                {loggedInLabel}
              </Link>

              <Button
                className="bg-[#FBBF24] text-[#110D0A] hover:bg-[#F59E0B] font-bold text-xs h-8 px-4 shadow-sm"
                onClick={handleLogout}
              >
                Çıkış
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="text-[#FDE68A] border-[#D97706]/60 hover:bg-[#D97706]/15 hover:text-[#FBBF24] text-xs font-bold h-8 px-4 bg-transparent"
                onClick={onOpenLogin}
              >
                {t.auth.login}
              </Button>

              {onOpenRegister && (
                <Button
                  className="bg-[#F07800] text-white hover:bg-[#D97706] font-bold text-xs h-8 px-4 shadow-sm"
                  onClick={onOpenRegister}
                >
                  {t.auth.register}
                </Button>
              )}
            </>
          )}
        </div>

        <button
          className="lg:hidden text-[#FDE68A]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menüyü aç/kapat"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#110D0A] border-t border-[#D97706]/30 p-4">
          <nav className="flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[#FDE68A] hover:text-[#FBBF24] font-bold text-left no-underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <div className="flex gap-2 my-2 bg-[#2B1408] border border-[#D97706]/30 p-1 rounded w-fit">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLang(l.code);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    lang === l.code
                      ? "bg-[#FBBF24] text-[#110D0A]"
                      : "text-[#FDE68A]/70 hover:text-[#FDE68A]"
                  }`}
                >
                  {l.code}
                </button>
              ))}
            </div>

            {isLoggedIn ? (
              <>
                <Link
                  href="/profile"
                  className="bg-[#2B1408] border border-[#D97706]/40 text-[#FBBF24] w-full font-bold text-center rounded px-4 py-2 no-underline truncate"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {loggedInLabel}
                </Link>

                <Button
                  className="bg-[#FBBF24] text-[#110D0A] hover:bg-[#F59E0B] w-full font-bold"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                >
                  Çıkış
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="w-full text-[#FDE68A] border-[#D97706]/50 hover:bg-[#D97706]/15 bg-transparent font-bold"
                  onClick={() => {
                    if (onOpenLogin) onOpenLogin();
                    setMobileMenuOpen(false);
                  }}
                >
                  {t.auth.login}
                </Button>

                {onOpenRegister && (
                  <Button
                    className="bg-[#F07800] text-white hover:bg-[#D97706] w-full font-bold"
                    onClick={() => {
                      onOpenRegister();
                      setMobileMenuOpen(false);
                    }}
                  >
                    {t.auth.register}
                  </Button>
                )}
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
