"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";

type OnlineUser = {
  id: string;
  name: string;
  avatar: string;
  city?: string;
  isOnline: boolean;
};

// Gerçekçi çevrimiçi kullanıcı listesi (Yüklenme beklemeden anında görünür)
const DUMMY_ONLINE_USERS: OnlineUser[] = [
  { id: "1", name: "Elin", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", city: "İzmir", isOnline: true },
  { id: "2", name: "Zeynep", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", city: "İstanbul", isOnline: true },
  { id: "3", name: "Aysel", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150", city: "Bakı", isOnline: true },
  { id: "4", name: "Canan", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150", city: "Ankara", isOnline: true },
  { id: "5", name: "Selin", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150", city: "Antalya", isOnline: true },
  { id: "6", name: "Leyla", avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150", city: "Gence", isOnline: true },
  { id: "7", name: "Gamze", avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150", city: "Bursa", isOnline: true },
  { id: "8", name: "Deniz", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", city: "İzmir", isOnline: true },
];

export default function OnlineUsers() {
  const { t } = useI18n();

  return (
    <div className="w-full rounded-3xl border border-amber-900/30 bg-[#120a06]/80 p-4 shadow-xl backdrop-blur-md">
      <div className="mb-3 flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
          </span>
          <h3 className="text-sm font-bold text-amber-100">
            {t?.dashboard?.onlineUsersTitle || "Canlı Çevrimiçi Üyeler"}
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
            <div className="relative h-16 w-16 rounded-full border-2 border-amber-500/40 p-0.5 shadow-md shadow-amber-950/40 group-hover:border-amber-400">
              <Image
                src={u.avatar}
                alt={u.name}
                fill
                className="rounded-full object-cover"
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