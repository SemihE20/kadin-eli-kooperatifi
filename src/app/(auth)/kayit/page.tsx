"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Supabase auth integration
    setTimeout(() => setLoading(false), 1000);
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

            <Button type="submit" fullWidth size="lg" isLoading={loading}>
              Kayıt Ol
            </Button>
          </form>

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
