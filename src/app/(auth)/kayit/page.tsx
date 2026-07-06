"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";

function mapAuthError(message: string) {
  if (message.includes("already registered") || message.includes("already been registered")) {
    return "Bu e-posta adresi ile zaten bir hesap var.";
  }
  if (message.includes("Password should be at least")) {
    return "Şifre en az 6 karakter olmalı.";
  }
  if (message.includes("Unable to validate email address") || message.includes("invalid")) {
    return "Geçerli bir e-posta adresi girin.";
  }
  return "Kayıt oluşturulamadı. Lütfen tekrar deneyin.";
}

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password.length < 6) {
      setError("Şifre en az 6 karakter olmalı.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: { full_name: formData.fullName },
      },
    });

    if (authError) {
      setError(mapAuthError(authError.message));
      setLoading(false);
      return;
    }

    if (data.session && data.user) {
      if (formData.phone) {
        await supabase.from("profiles").update({ phone: formData.phone }).eq("id", data.user.id);
      }
      router.push("/hesabim");
      router.refresh();
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative items-center justify-center p-12">
        <div className="absolute inset-0 pattern-dots opacity-10" />
        <div className="relative z-10 text-center">
          <div className="relative w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-white/20">
            <Image src="/logo.png" alt="Logo" fill className="object-cover" />
          </div>
          <h2 className="font-heading text-3xl font-bold text-white mb-3">Ailemize Katılın</h2>
          <p className="text-sm text-primary-200 max-w-sm mx-auto leading-relaxed">
            Kayıt olarak el yapımı, doğal ürünlerimizi keşfedin ve siparişlerinizi kolayca takip edin.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="relative w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden ring-2 ring-primary-200">
              <Image src="/logo.png" alt="Logo" fill className="object-cover" />
            </div>
          </div>

          {success ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center text-2xl">
                ✉️
              </div>
              <h1 className="font-heading text-2xl font-bold text-foreground mb-2">E-postanızı Doğrulayın</h1>
              <p className="text-sm text-muted mb-8 leading-relaxed">
                <strong>{formData.email}</strong> adresine bir doğrulama bağlantısı gönderdik.
                Hesabınızı aktifleştirmek için e-postanızdaki bağlantıya tıklayın.
              </p>
              <Link href="/giris" className="text-primary-700 font-medium hover:text-primary-800 transition-colors text-sm">
                Giriş sayfasına dön →
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-heading text-2xl font-bold text-foreground mb-1">Kayıt Ol</h1>
              <p className="text-sm text-muted mb-8">
                Zaten hesabınız var mı?{" "}
                <Link href="/giris" className="text-primary-700 font-medium hover:text-primary-800 transition-colors">
                  Giriş yapın
                </Link>
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Ad Soyad"
                  name="fullName"
                  placeholder="Adınız Soyadınız"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="E-posta"
                  name="email"
                  type="email"
                  placeholder="ornek@mail.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Telefon"
                  name="phone"
                  type="tel"
                  placeholder="05XX XXX XX XX"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Şifre"
                  name="password"
                  type="password"
                  placeholder="En az 6 karakter"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Şifre Tekrar"
                  name="confirmPassword"
                  type="password"
                  placeholder="Şifrenizi tekrar girin"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />

                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 mt-0.5 rounded border-border text-primary-600 focus:ring-primary-500" required />
                  <span className="text-xs text-muted leading-relaxed">
                    <Link href="#" className="text-primary-700 font-medium">Kullanım Koşulları</Link>&apos;nı ve{" "}
                    <Link href="#" className="text-primary-700 font-medium">Gizlilik Politikası</Link>&apos;nı okudum ve kabul ediyorum.
                  </span>
                </label>

                {error && (
                  <p className="text-xs text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>
                )}

                <Button type="submit" fullWidth size="lg" isLoading={loading}>
                  Kayıt Ol
                </Button>
              </form>
            </>
          )}

          <div className="mt-8 text-center">
            <Link href="/" className="text-xs text-muted hover:text-primary-700 transition-colors">
              ← Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
