import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export default function PageHeader({ title, description, breadcrumbs }: PageHeaderProps) {
  return (
    <section className="pt-28 pb-10 gradient-hero relative overflow-hidden">
      {/* Botanical Pattern */}
      <div className="absolute inset-0 pattern-botanical opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-2 text-xs text-cream-300/70 mb-4">
            {breadcrumbs.map((item, index) => (
              <span key={index} className="flex items-center gap-2">
                {index > 0 && <span className="text-cream-300/40">/</span>}
                {item.href ? (
                  <Link href={item.href} className="hover:text-cream-100 transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-cream-100">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-2">
          {title}
        </h1>

        {description && (
          <p className="text-sm text-cream-200/70 max-w-lg">
            {description}
          </p>
        )}
      </div>

      {/* Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 40" className="w-full h-[30px] fill-background" preserveAspectRatio="none">
          <path d="M0,20 C480,40 960,0 1440,25 L1440,40 L0,40 Z" />
        </svg>
      </div>
    </section>
  );
}
