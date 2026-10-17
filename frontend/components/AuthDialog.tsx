"use client";

import { useState } from "react";
import { X, Mail, Lock, User, Calendar, MapPin, Globe, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthDialogProps {
  activeTab: "login" | "register" | null;
  onClose: () => void;
}

export default function AuthDialog({ activeTab, onClose }: AuthDialogProps) {
  const [tab, setTab] = useState<"login" | "register">(activeTab || "login");

  if (!activeTab) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-amber-900/50 bg-[#25150D] p-6 text-amber-50 shadow-2xl">
        
        {/* KAPATMA BUTONU */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-amber-300/60 hover:text-amber-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* SEKMELER (Giriş Yap / Üye Ol) */}
        <div className="flex border-b border-amber-900/40 mb-6">
          <button
            onClick={() => setTab("login")}
            className={`flex-1 pb-3 text-sm font-bold transition-colors border-b-2 ${
              tab === "login"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-amber-200/50 hover:text-amber-200"
            }`}
          >
            Giriş Yap
          </button>
          <button
            onClick={() => setTab("register")}
            className={`flex-1 pb-3 text-sm font-bold transition-colors border-b-2 ${
              tab === "register"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-amber-200/50 hover:text-amber-200"
            }`}
          >
            Üye Ol
          </button>
        </div>

        {tab === "login" ? (
          /* GİRİŞ YAP FORMU */
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-amber-100 text-center">Tekrar Hoş Geldiniz</h2>
            
            <div className="space-y-1">
              <label className="text-xs text-amber-300/80 font-medium">E-posta</label>
              <input
                type="email"
                placeholder="ornek@email.com"
                className="w-full h-10 rounded-xl bg-[#1A0E08] border border-amber-900/60 px-3 text-amber-100 placeholder:text-amber-500/30 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-amber-300/80 font-medium">Şifre</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full h-10 rounded-xl bg-[#1A0E08] border border-amber-900/60 px-3 text-amber-100 placeholder:text-amber-500/30 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <Button className="w-full h-11 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl shadow-lg shadow-amber-500/10 mt-2">
              Giriş Yap
            </Button>
          </div>
        ) : (
          /* ÜYE OL FORMU */
          <div className="space-y-3">
            <h2 className="text-xl font-extrabold text-amber-100 text-center">Ücretsiz Katıl</h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-amber-300/80 font-medium">Kullanıcı Adı</label>
                <input
                  type="text"
                  placeholder="Kullanıcı adı"
                  className="w-full h-9 rounded-xl bg-[#1A0E08] border border-amber-900/60 px-3 text-amber-100 placeholder:text-amber-500/30 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-amber-300/80 font-medium">E-posta</label>
                <input
                  type="email"
                  placeholder="E-posta"
                  className="w-full h-9 rounded-xl bg-[#1A0E08] border border-amber-900/60 px-3 text-amber-100 placeholder:text-amber-500/30 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-amber-300/80 font-medium">Şifre</label>
              <input
                type="password"
                placeholder="Şifre belirleyin"
                className="w-full h-9 rounded-xl bg-[#1A0E08] border border-amber-900/60 px-3 text-amber-100 placeholder:text-amber-500/30 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-amber-300/80 font-medium">Şehir</label>
                <select className="w-full h-9 rounded-xl bg-[#1A0E08] border border-amber-900/60 px-2 text-amber-100 text-xs focus:outline-none focus:border-amber-500">
                  <option>Şehir Seç</option>
                  <option>İstanbul</option>
                  <option>Ankara</option>
                  <option>İzmir</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-amber-300/80 font-medium">Doğum Tarihi</label>
                <input
                  type="date"
                  className="w-full h-9 rounded-xl bg-[#1A0E08] border border-amber-900/60 px-2 text-amber-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input type="checkbox" id="terms" className="rounded border-amber-900 bg-[#1A0E08]" />
              <label htmlFor="terms" className="text-[11px] text-amber-200/70">
                Kullanım şartlarını kabul ediyorum.
              </label>
            </div>

            <Button className="w-full h-11 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl shadow-lg shadow-amber-500/10 mt-1">
              Kayıt Ol
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}