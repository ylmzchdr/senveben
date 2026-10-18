"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";

type OnlineUser = {
  id: string;
  name: string;
  avatar: string;
  city?: string;
  isOnline: boolean;
};

// Kırılmayan, güvenli profil resimleri
const DUMMY_ONLINE_USERS: OnlineUser[] = [
  { id: "1", name: "Elin", avatar: "https://i.pravatar.cc/150?img=1", city: "İzmir", isOnline: true },
  { id: "2", name: "Zeynep", avatar: "https://i.pravatar.cc/150?img=5", city: "İstanbul", isOnline: true },
  { id: "3", name: "Aysel", avatar: "https://i.pravatar.cc/150?img=9", city: "Bakı", isOnline: true },
  { id: "4", name: "Canan", avatar: "https://i.pravatar.cc/150?img=10", city: "Ankara", isOnline: true },
  { id: "5", name: "Selin", avatar: "https://i.pravatar.cc/150?img=16", city: "Antalya", isOnline: true },
  { id: "6", name: "Leyla", avatar: "https://i.pravatar.cc/150?img=20", city: "Gence", isOnline: true },
  { id: "7", name: "Gamze", avatar: "https://i.pravatar.cc/150?img=24", city: "Bursa", isOnline: true },
  { id: "8", name: "Deniz", avatar: "https://i.pravatar.cc/150?img=32", city: "İzmir", isOnline: true },
];

export default function OnlineUsers() {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full rounded-3xl border border-amber-900/30 bg-[#120a06]/80 p-4 shadow-xl min-h-[120px]" />
    );
  }

  return (
    <div className="w-full rounded-3xl border border-amber-900/30 bg-[#120a06]/80 p-4 shadow-xl backdrop-blur-md">
      <div className="mb-3 flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
          </span>
          <h3 className="text-sm font-bold text-amber-100">
            {t?.dashboard?.onlineUsersTitle || "81 İlden Canlı Çevrimiçi Üyeler"}
          </h3>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
          {DUMMY_ONLINE_USERS.length} Aktif
        </span>
      </div>

      <div className="flex items-center gap-4 overflow-x-auto pb-2 pt-1 no-scrollbar">
        {DUMMY_ONLINE_USERS.map((u) => (
          <Link
            key={u.id}
            href={`/profile/${u.id}`}
            className="group relative flex shrink-0 flex-col items-center gap-1.5 transition-transform hover:scale-105"
          >
            <div className="relative h-16 w-16 rounded-full border-2 border-amber-500/40 p-0.5 shadow-md shadow-amber-950/40 group-hover:border-amber-400 bg-amber-950/50">
              <img
                src={u.avatar}
                alt=""
                className="h-full w-full rounded-full object-cover"
                onError={(e) => {
                  // Resim yüklenemezse harfe düş
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-[#120a06] bg-emerald-500 shadow-sm" />
            </div>
            <span className="max-w-[70px] truncate text-center text-xs font-bold text-amber-200 group-hover:text-amber-100">
              {u.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}