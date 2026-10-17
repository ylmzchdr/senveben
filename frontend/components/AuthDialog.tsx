"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import { useI18n } from "@/lib/i18n-context";
import { api } from "@/lib/api";

type Tab = "login" | "register" | null;

type AuthDialogProps = {
  activeTab: Tab;
  onClose: () => void;
};

type City = {
  id: number;
  name: string;
};

type District = {
  id: number;
  name: string;
  cityId: number;
};

type LoginData = {
  emailOrPhone: string;
  password: string;
};

type RegisterData = {
  name: string;
  username: string;
  email: string;
  password: string;
  birthDate: string;
  gender: string;
  cityId: string;
  districtId: string;
};

const initialLoginData: LoginData = {
  emailOrPhone: "",
  password: "",
};

const initialRegisterData: RegisterData = {
  name: "Kullanici",
  username: "",
  email: "",
  password: "",
  birthDate: "",
  gender: "Belirtmek İstemiyorum",
  cityId: "",
  districtId: "1",
};

export default function AuthDialog({
  activeTab,
  onClose,
}: AuthDialogProps) {
  const { t } = useI18n();

  const [tab, setTab] = useState<Tab>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState<LoginData>(initialLoginData);
  const [registerData, setRegisterData] = useState<RegisterData>(initialRegisterData);

  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [districtsLoading, setDistrictsLoading] = useState(false);

  useEffect(() => {
    setTab(activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (tab !== "register") return;

    let cancelled = false;

    const loadCities = async () => {
      try {
        setCitiesLoading(true);
        const data = await api.cities.list();
        if (!cancelled) {
          setCities(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Şehirler alınamadı:", error);
        if (!cancelled) {
          setCities([]);
        }
      } finally {
        if (!cancelled) {
          setCitiesLoading(false);
        }
      }
    };

    loadCities();

    return () => {
      cancelled = true;
    };
  }, [tab]);

  useEffect(() => {
    if (!registerData.cityId) {
      setDistricts([]);
      return;
    }

    let cancelled = false;

    const loadDistricts = async () => {
      try {
        setDistrictsLoading(true);
        const cityId = Number(registerData.cityId);
        if (!Number.isInteger(cityId) || cityId <= 0) {
          setDistricts([]);
          if (!cancelled) {
            setRegisterData((prev) => ({ ...prev, districtId: "1" }));
          }
          return;
        }

        const data = await api.cities.districts(cityId);
        if (!cancelled) {
          const districtList = Array.isArray(data) ? data : [];
          setDistricts(districtList);
          if (districtList.length > 0 && !cancelled) {
            setRegisterData((prev) => ({
              ...prev,
              districtId: String(districtList[0].id),
            }));
          }
        }
      } catch (error) {
        console.error("İlçeler alınamadı:", error);
        if (!cancelled) {
          setDistricts([]);
          setRegisterData((prev) => ({ ...prev, districtId: "1" }));
        }
      } finally {
        if (!cancelled) {
          setDistrictsLoading(false);
        }
      }
    };

    loadDistricts();

    return () => {
      cancelled = true;
    };
  }, [registerData.cityId]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.emailOrPhone.trim() || !loginData.password) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    setLoading(true);

    try {
      const res: any = await api.auth.login({
        emailOrPhone: loginData.emailOrPhone.trim(),
        password: loginData.password,
      });

      if (!res?.accessToken || !res?.refreshToken) {
        throw new Error("Giriş yanıtında token bilgisi bulunamadı.");
      }

      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.user || res.profile || res));

      setLoginData({ ...initialLoginData });
      onClose();
      window.location.href = "/dashboard";
    } catch (err: any) {
      alert(err?.message || "Giriş başarısız.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeTerms) {
      alert("Lütfen şartları kabul edin.");
      return;
    }

    if (
      !registerData.username.trim() ||
      !registerData.email.trim() ||
      !registerData.password
    ) {
      alert("Lütfen tüm zorunlu alanları doldurun.");
      return;
    }

    if (!registerData.birthDate) {
      alert("Lütfen doğum tarihinizi seçin.");
      return;
    }

    if (!registerData.cityId) {
      alert("Lütfen şehir seçin.");
      return;
    }

    const cityId = Number(registerData.cityId);
    const districtId = Number(registerData.districtId) || 1;

    const selectedCity = cities.find((city) => Number(city.id) === cityId);
    if (!selectedCity) {
      alert("Seçilen şehir bulunamadı. Lütfen tekrar seçin.");
      return;
    }

    setLoading(true);

    try {
      await api.auth.register({
        name: registerData.username.trim(),
        username: registerData.username.trim(),
        email: registerData.email.trim(),
        password: registerData.password,
        birthDate: registerData.birthDate,
        gender: registerData.gender || "Belirtmek İstemiyorum",
        cityId,
        cityName: selectedCity.name,
        districtId,
        districtName: districts.find((d) => Number(d.id) === districtId)?.name || "Merkez",
      });

      alert("Kayıt başarılı! Giriş yapabilirsiniz.");
      setTab("login");
    } catch (err: any) {
      alert(err?.message || "Kayıt başarısız.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <Dialog open={!!tab} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[420px] max-h-[90vh] overflow-y-auto p-6 bg-[#25150D] text-amber-50 rounded-2xl border border-amber-900/50 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-amber-400">
            {tab === "login" ? "Giriş Yap" : "Ücretsiz Katıl"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Giriş ve kayıt penceresi
          </DialogDescription>
        </DialogHeader>

        {/* GOOGLE GİRİŞ BUTONU */}
        <div className="flex flex-col gap-3 mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            className="w-full h-11 border border-amber-900/50 bg-[#1A0E08] text-amber-200 hover:bg-[#321C11] hover:text-amber-100 rounded-xl flex items-center justify-center gap-2 font-medium transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.18 1-.78 1.85-1.63 2.42v2.77h2.64c1.55-1.42 2.43-3.52 2.43-5.92z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-2.64-2.77c-.74.5-1.69.8-2.64.8-2.84 0-5.24-1.92-6.1-4.51H1.15v2.84C2.97 20.53 7.18 23 12 23z"/>
              <path fill="#FBBC05" d="M5.9 13.86c-.22-.66-.35-1.38-.35-2.11s.13-1.45.35-2.11V6.8H1.15C.42 8.36 0 10.13 0 12s.42 3.64 1.15 5.2l4.75-3.34z"/>
              <path fill="#EA4335" d="M12 4.75c1.62 0 3.08.56 4.22 1.66l3.17-3.17C17.45 1.34 14.97.5 12.5.5c-4.82 0-9.03 2.47-10.85 6.3L6.4 10.14c.86-2.59 3.26-4.51 6.1-4.51z"/>
            </svg>
            Google ile Devam Et
          </Button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-amber-900/40"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#25150D] px-2 text-amber-200/60">Veya e-posta ile</span></div>
          </div>
        </div>

        {/* GİRİŞ PANELİ */}
        {tab === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="loginEmail" className="text-amber-200">E-posta veya Telefon</Label>
              <Input
                id="loginEmail"
                type="text"
                required
                className="h-11 rounded-xl bg-[#1A0E08] border-amber-900/60 text-amber-100 placeholder:text-amber-900/50 focus:border-amber-500"
                value={loginData.emailOrPhone}
                onChange={(e) => setLoginData({ ...loginData, emailOrPhone: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="loginPassword" className="text-amber-200">Şifre</Label>
              <Input
                id="loginPassword"
                type="password"
                required
                className="h-11 rounded-xl bg-[#1A0E08] border-amber-900/60 text-amber-100 focus:border-amber-500"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-11 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl transition-all">
              {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
            </Button>
            <p className="text-center text-sm text-amber-200/70 mt-2">
              Hesabın yok mu?{" "}
              <button type="button" className="text-amber-400 font-semibold underline hover:text-amber-300" onClick={() => setTab("register")}>
                Kayıt Ol
              </button>
            </p>
          </form>
        )}

        {/* KAYIT PANELİ */}
        {tab === "register" && (
          <form onSubmit={handleRegister} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="username" className="text-amber-200">Kullanıcı Adı</Label>
              <Input
                id="username"
                type="text"
                required
                className="h-10 rounded-xl bg-[#1A0E08] border-amber-900/60 text-amber-100 focus:border-amber-500"
                value={registerData.username}
                onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="regEmail" className="text-amber-200">E-posta</Label>
              <Input
                id="regEmail"
                type="email"
                required
                className="h-10 rounded-xl bg-[#1A0E08] border-amber-900/60 text-amber-100 focus:border-amber-500"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="regPassword" className="text-amber-200">Şifre</Label>
              <Input
                id="regPassword"
                type="password"
                required
                className="h-10 rounded-xl bg-[#1A0E08] border-amber-900/60 text-amber-100 focus:border-amber-500"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="birthDate" className="text-amber-200">Doğum Tarihi</Label>
              <Input
                id="birthDate"
                type="date"
                required
                className="h-10 rounded-xl bg-[#1A0E08] border-amber-900/60 text-amber-100 focus:border-amber-500 [color-scheme:dark]"
                value={registerData.birthDate}
                onChange={(e) => setRegisterData({ ...registerData, birthDate: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-amber-200">Şehir</Label>
                <Select
                  value={registerData.cityId}
                  onValueChange={(val) => setRegisterData({ ...registerData, cityId: val, districtId: "" })}
                  disabled={citiesLoading}
                >
                  <SelectTrigger className="h-10 rounded-xl bg-[#1A0E08] border-amber-900/60 text-amber-100">
                    <SelectValue placeholder={citiesLoading ? "Yükleniyor..." : "Şehir Seç"} />
                  </SelectTrigger>
                  <SelectContent className="bg-[#25150D] border-amber-900/60 text-amber-100">
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={String(city.id)} className="focus:bg-amber-900/40 focus:text-amber-200">
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-amber-200">İlçe</Label>
                <Select
                  value={registerData.districtId}
                  onValueChange={(val) => setRegisterData({ ...registerData, districtId: val })}
                  disabled={!registerData.cityId || districtsLoading}
                >
                  <SelectTrigger className="h-10 rounded-xl bg-[#1A0E08] border-amber-900/60 text-amber-100">
                    <SelectValue placeholder={districtsLoading ? "Yükleniyor..." : "İlçe Seç"} />
                  </SelectTrigger>
                  <SelectContent className="bg-[#25150D] border-amber-900/60 text-amber-100">
                    {districts.map((district) => (
                      <SelectItem key={district.id} value={String(district.id)} className="focus:bg-amber-900/40 focus:text-amber-200">
                        {district.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <Checkbox
                id="terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(!!checked)}
                className="border-amber-700 data-[state=checked]:bg-amber-500 data-[state=checked]:text-stone-950"
              />
              <label htmlFor="terms" className="text-xs text-amber-200/70 cursor-pointer">
                Kullanım şartlarını ve gizlilik politikasını kabul ediyorum.
              </label>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-11 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl transition-all">
              {loading ? "Kayıt Olunuyor..." : "Kayıt Ol"}
            </Button>

            <p className="text-center text-sm text-amber-200/70 mt-2">
              Zaten hesabın var mı?{" "}
              <button type="button" className="text-amber-400 font-semibold underline hover:text-amber-300" onClick={() => setTab("login")}>
                Giriş Yap
              </button>
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}