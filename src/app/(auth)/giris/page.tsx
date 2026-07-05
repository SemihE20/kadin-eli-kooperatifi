"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
            <Image src="/logo.jpeg" alt="Logo" fill className="object-cover" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Hoş Geldiniz</h2>
          <p className="text-sm text-primary-200 max-w-sm mx-auto leading-relaxed">
            Gözler Kadıneli Kooperatifi hesabınıza giriş yaparak siparişlerinizi takip edebilir
            ve alışverişe devam edebilirsiniz.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="relative w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden ring-2 ring-primary-200">
              <Image src="/logo.jpeg" alt="Logo" fill className="object-cover" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-1">Giriş Yap</h1>
          <p className="text-sm text-muted mb-8">
            Hesabınız yok mu?{" "}
            <Link href="/kayit" className="text-primary-700 font-medium hover:text-primary-800 transition-colors">
              Kayıt olun
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="E-posta"
              type="email"
              placeholder="ornek@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Şifre"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-border text-primary-600 focus:ring-primary-500" />
                <span className="text-xs text-muted">Beni hatırla</span>
              </label>
              <Link href="#" className="text-xs text-primary-700 font-medium hover:text-primary-800 transition-colors">
                Şifremi unuttum
              </Link>
            </div>

            <Button type="submit" fullWidth size="lg" isLoading={loading}>
              Giriş Yap
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
