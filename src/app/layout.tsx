import type { Metadata } from 'next'
import { Manrope, Inter } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FloatingActions from '@/components/FloatingActions'
import { getCitiesWithCounts, getProjectsForMenu, getPublishedBlogPosts } from '@/lib/queries'

// Manrope display (headings) + Inter body — clean, modern, premium sans pairing.
const display = Manrope({ subsets: ['latin'], variable: '--font-display', weight: ['500', '600', '700', '800'], display: 'swap' })
const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })

const SITE_NAME = 'ANON INDIA'

// Derived from the public Supabase URL so preconnect always matches the project.
const SUPABASE_ORIGIN = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').origin
  } catch {
    return 'https://dfjyslxrzniqtlniseat.supabase.co'
  }
})()
const SITE_DESC = 'Premium plotted developments and real estate projects in Rajasthan. RERA approved. Trusted by 1000+ happy families.'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://anonindia.com'),
  title:       { default: `${SITE_NAME} — Premium Real Estate`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESC,
  keywords:    ['plots Jaipur', 'real estate Rajasthan', 'RERA approved plots', 'plotted development Jaipur'],
  openGraph: {
    type:        'website',
    siteName:    SITE_NAME,
    description: SITE_DESC,
  },
  twitter:  { card: 'summary_large_image' },
  robots:   { index: true, follow: true },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Data for the Projects + Blog mega-menus in the nav.
  const [cities, menuProjects, blogPosts] = await Promise.all([
    getCitiesWithCounts(),
    getProjectsForMenu(),
    getPublishedBlogPosts(4),
  ])

  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <head>
        {/* Warm up the connection to Supabase (data + storage images) early. */}
        <link rel="preconnect" href={SUPABASE_ORIGIN} crossOrigin="anonymous" />
        <link rel="dns-prefetch" href={SUPABASE_ORIGIN} />
        {/* Unsplash supplies fallback imagery on most pages — warm it up too. */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="bg-white font-sans antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'RealEstateAgent',
          name: SITE_NAME,
          description: SITE_DESC,
          url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://anonindia.com',
          telephone: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '+919876543210',
          areaServed: 'IN',
          address: { '@type': 'PostalAddress', addressRegion: 'Rajasthan', addressCountry: 'IN' },
        }) }} />
        <Nav cities={cities} projects={menuProjects} posts={blogPosts} />
        <main>{children}</main>
        <Footer />
        <FloatingActions />
      </body>
    </html>
  )
}
