"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] =
    useState<LoginData>(initialLoginData);

  const [registerData, setRegisterData] =
    useState<RegisterData>(initialRegisterData);

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
          alert("Şehirler yüklenemedi. Lütfen tekrar deneyin.");
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
            setRegisterData((prev) => ({
              ...prev,
              districtId: "1",
            }));
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
          setRegisterData((prev) => ({
            ...prev,
            districtId: "1",
          }));
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
        districtName: districts.find(d => Number(d.id) === districtId)?.name || "Merkez",
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
      <DialogContent className="sm:max-w-[420px] p-6 bg-white rounded-2xl border-0 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-gray-800">
            {tab === "login" ? "Giriş Yap" : "Ücretsiz Katıl"}
          </DialogTitle>
        </DialogHeader>

        {/* GOOGLE GİRİŞ BUTONU */}
        <div className="flex flex-col gap-3 mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            className="w-full h-11 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2 font-medium transition-all"
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
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400">Veya e-posta ile</span></div>
          </div>
        </div>

        {/* GİRİŞ PANELİ */}
        {tab === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="loginEmail">E-posta veya Telefon</Label>
              <Input
                id="loginEmail"
                type="text"
                required
                className="h-11 rounded-xl"
                value={loginData.emailOrPhone}
                onChange={(e) => setLoginData({ ...loginData, emailOrPhone: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="loginPassword">Şifre</Label>
              <Input
                id="loginPassword"
                type="password"
                required
                className="h-11 rounded-xl"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-11 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-xl">
              {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
