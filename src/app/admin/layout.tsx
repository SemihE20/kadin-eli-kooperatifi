"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "📊", exact: true },
  { href: "/admin/urunler", label: "Ürünler", icon: "🌿", exact: false },
  { href: "/admin/siparisler", label: "Siparişler", icon: "📦", exact: false },
  { href: "/admin/kullanicilar", label: "Kullanıcılar", icon: "👥", exact: false },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-60 bg-primary-900 text-white flex-col shrink-0">
        {/* Brand */}
        <div className="p-5 border-b border-primary-800">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-primary-700 shrink-0">
              <Image src="/logo.png" alt="Logo" fill className="object-cover" />
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight">Gözler Kadıneli</p>
              <p className="text-[10px] text-primary-400">Admin Paneli</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                isActive(item.href, item.exact)
                  ? "bg-primary-700 text-white font-medium"
                  : "text-primary-300 hover:bg-primary-800 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-primary-800">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-primary-400 hover:text-white hover:bg-primary-800 transition-all"
          >
            <span>🏪</span>
            Mağazaya Git
          </Link>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-primary-400 hover:text-red-300 hover:bg-primary-800 transition-all cursor-pointer text-left">
            <span>🚪</span>
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile brand */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="relative w-7 h-7 rounded-full overflow-hidden">
                <Image src="/logo.png" alt="Logo" fill className="object-cover" />
              </div>
              <span className="text-sm font-bold text-foreground">Admin</span>
            </div>
            {/* Page title derived from nav */}
            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-foreground">
                {NAV_ITEMS.find((item) => isActive(item.href, item.exact))?.label ?? "Admin"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-sm">
              👤
            </div>
          </div>
        </header>

        {/* Mobile Nav */}
        <nav className="lg:hidden bg-white border-b border-gray-200 px-4 py-2 flex gap-1 overflow-x-auto">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${
                isActive(item.href, item.exact)
                  ? "bg-primary-700 text-white font-medium"
                  : "text-muted hover:text-foreground hover:bg-gray-100"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
