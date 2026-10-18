"use client";

import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

interface AuthDialogProps {
  activeTab: "login" | "register" | null;
  onClose: () => void;
}

interface Country {
  id: number;
  code: string;
  name: string;
}

interface City {
  id: number;
  name: string;
}

const inputClass =
  "w-full h-10 rounded-xl bg-[#1A0E08] border border-amber-900/60 px-3 text-amber-100 placeholder:text-amber-500/40 text-sm focus:outline-none focus:border-amber-500";

const labelClass =
  "block mb-1 text-xs text-amber-300/80 font-medium";

export default function AuthDialog({
  activeTab,
  onClose,
}: AuthDialogProps) {
  const [tab, setTab] = useState<"login" | "register">(
    activeTab === "register" ? "register" : "login"
  );

  const [loading, setLoading] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [error, setError] = useState("");

  // Giriş Yap State'leri
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Sadeleştirilmiş 3 Kayıt Alanı: Kullanıcı Adı, Yaş, Şehir
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [cityId, setCityId] = useState("");

  // Arka planda Türkiye şehirlerini otomatik çeken yapı
  const [countryId, setCountryId] = useState("");
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    if (activeTab) {
      setTab(activeTab);
      setError("");
    }
  }, [activeTab]);

  // Varsayılan olarak Türkiye'yi (TR) seç
  useEffect(() => {
    if (tab !== "register" || !activeTab) return;

    let cancelled = false;

    async function loadCountries() {
      try {
        const result = await api.cities.countries();
        const list: Country[] = Array.isArray(result) ? result : [];

        if (!cancelled && list.length > 0) {
          const initialCountry =
            list.find((country) => country.code === "TR") ?? list[0];

          if (initialCountry) {
            setCountryId(String(initialCountry.id));
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Şehir listesi yüklenemedi."
          );
        }
      }
    }

    loadCountries();

    return () => {
      cancelled = true;
    };
  }, [tab, activeTab]);

  // Ülkeye (TR) ait şehirleri arka planda getir
  useEffect(() => {
    if (tab !== "register" || !activeTab || !countryId) {
      setCities([]);
      setCityId("");
      return;
    }

    let cancelled = false;

    async function loadCities() {
      setCitiesLoading(true);
      setCities([]);
      setCityId("");

      try {
        const result = await api.cities.list(Number(countryId));

        if (!cancelled) {
          setCities(Array.isArray(result) ? result : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Şehirler yüklenemedi."
          );
        }
      } finally {
        if (!cancelled) setCitiesLoading(false);
      }
    }

    loadCities();

    return () => {
      cancelled = true;
    };
  }, [countryId, tab, activeTab]);

  if (!activeTab) return null;

  const selectedCity = cities.find(
    (city) => Number(city.id) === Number(cityId)
  );

  function changeTab(nextTab: "login" | "register") {
    setTab(nextTab);
    setError("");
  }

  // SADECE 3 ALANLI HIZLI KAYIT İŞLEMİ
  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Lütfen kullanıcı adınızı girin.");
      return;
    }

    const numAge = Number(age);
    if (!age || isNaN(numAge) || numAge < 18) {
      setError("Üyelik için 18 yaşını doldurmuş olmalısınız.");
      return;
    }

    if (!cityId || !selectedCity) {
      setError("Lütfen bir şehir seçin.");
      return;
    }

    setLoading(true);

    try {
      // 1. Yaştan doğum tarihi hesaplama (Örn: 2026 - 25 = 2001-01-01)
      const currentYear = new Date().getFullYear();
      const birthYear = currentYear - numAge;
      const computedBirthDate = `${birthYear}-01-01`;

      // 2. Backend'in beklediği e-posta ve şifreyi arka planda otomatik üretme
      const cleanNick = username.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
      const autoEmail = `${cleanNick}_${Date.now()}@senveben.local`;
      const autoPassword = "UserPass_" + Math.random().toString(36).substring(2, 10);

      await api.auth.register({
        name: username.trim(),
        username: username.trim(),
        email: autoEmail,
        password: autoPassword,
        birthDate: computedBirthDate,
        gender: "OTHER",
        countryId: Number(countryId) || 1,
        cityId: Number(selectedCity.id),
        cityName: selectedCity.name,
      });

      alert("Kayıt başarılı! Giriş yapabilirsiniz.");
      setUsername("");
      setAge("");
      setCityId("");
      setTab("login");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Kayıt sırasında bir hata oluştu."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result: any = await api.auth.login({
        emailOrPhone: emailOrPhone.trim(),
        password: loginPassword,
      });

      if (!result?.accessToken) {
        throw new Error("Giriş yanıtında erişim anahtarı bulunamadı.");
      }

      localStorage.setItem("accessToken", result.accessToken);

      if (result.refreshToken) {
        localStorage.setItem("refreshToken", result.refreshToken);
      }

      localStorage.setItem(
        "user",
        JSON.stringify(result.user || result.profile || result)
      );

      window.dispatchEvent(new Event("auth-changed"));
      onClose();
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Giriş başarısız.");
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleLogin() {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "https://egelove-backend.onrender.com";

    window.location.href = `${apiUrl}/auth/google`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-amber-900/50 bg-[#25150D] p-6 text-amber-50 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Pencereyi kapat"
          className="absolute right-4 top-4 text-amber-300/70 hover:text-amber-100"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Tab Butonları */}
        <div className="mb-6 flex border-b border-amber-900/40">
          <button
            type="button"
            onClick={() => changeTab("login")}
            className={`flex-1 border-b-2 pb-3 text-sm font-bold ${
              tab === "login"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-amber-200/50"
            }`}
          >
            Giriş Yap
          </button>

          <button
            type="button"
            onClick={() => changeTab("register")}
            className={`flex-1 border-b-2 pb-3 text-sm font-bold ${
              tab === "register"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-amber-200/50"
            }`}
          >
            Üye Ol
          </button>
        </div>

        {/* Google Butonu */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="mb-4 h-11 w-full rounded-xl border border-amber-900/60 bg-[#1A0E08] text-sm font-semibold text-amber-100 hover:border-amber-500"
        >
          Google ile Devam Et
        </button>

        <div className="mb-5 text-center text-xs text-amber-300/60">
          veya bilgilerinle devam et
        </div>

        {/* GİRİŞ YAP SEKMESİ */}
        {tab === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <h2 className="text-center text-xl font-extrabold text-amber-100">
              Tekrar Hoş Geldiniz
            </h2>

            <div>
              <label className={labelClass}>E-posta veya Telefon</label>
              <input
                className={inputClass}
                type="text"
                autoComplete="username"
                required
                value={emailOrPhone}
                onChange={(event) => setEmailOrPhone(event.target.value)}
                placeholder="E-posta veya telefon"
              />
            </div>

            <div>
              <label className={labelClass}>Şifre</label>
              <input
                className={inputClass}
                type="password"
                autoComplete="current-password"
                required
                value={loginPassword}
                onChange={(event) => setLoginPassword(event.target.value)}
                placeholder="Şifreniz"
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-400 text-center">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-xl bg-amber-500 font-bold text-stone-950 hover:bg-amber-600"
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
          </form>
        ) : (
          /* SADECE 3 ALANLI ÜYE OL FORMU */
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="mb-4 text-center">
              <h2 className="text-xl font-extrabold text-amber-100">
                Hızlı Kayıt Ol
              </h2>
              <p className="mt-1 text-xs text-amber-200/60">
                Sadece birkaç saniyede aramıza katıl
              </p>
            </div>

            {/* 1. KULLANICI ADI */}
            <div>
              <label className={labelClass}>Kullanıcı Adı</label>
              <input
                className={inputClass}
                autoComplete="username"
                required
                minLength={3}
                maxLength={30}
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Örn: murat35"
              />
            </div>

            {/* 2. YAŞ */}
            <div>
              <label className={labelClass}>Yaş</label>
              <input
                className={inputClass}
                type="number"
                min="18"
                max="99"
                required
                value={age}
                onChange={(event) => setAge(event.target.value)}
                placeholder="Örn: 24 (En az 18)"
              />
            </div>

            {/* 3. ŞEHİR */}
            <div>
              <label className={labelClass}>Şehir</label>
              <select
                className={inputClass}
                required
                value={cityId}
                onChange={(event) => setCityId(event.target.value)}
                disabled={citiesLoading}
              >
                <option value="">
                  {citiesLoading ? "Şehirler yükleniyor..." : "Şehir seçin"}
                </option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id} className="bg-[#1A0E08]">
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-400 text-center">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading || citiesLoading}
              className="h-11 w-full rounded-xl bg-amber-500 font-bold text-stone-950 hover:bg-amber-600 transition"
            >
              {loading ? "Kayıt yapılıyor..." : "Hemen Katıl"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}