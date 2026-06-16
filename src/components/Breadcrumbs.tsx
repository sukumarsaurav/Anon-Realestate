import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://anonindia.com'

export default function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.label,
      ...(it.href ? { item: `${SITE}${it.href}` } : {}),
    })),
  }

  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 flex items-center flex-wrap gap-1">
        {items.map((it, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={13} className="text-gray-300" />}
            {it.href ? (
              <Link href={it.href} className="hover:text-brand-900 transition-colors">{it.label}</Link>
            ) : (
              <span className="text-gray-700 font-medium truncate max-w-[60vw]">{it.label}</span>
            )}
          </span>
        ))}
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  )
}
