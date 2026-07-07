import type { Metadata } from 'next'
import { Manrope, Inter, Fraunces } from 'next/font/google'
import Script from 'next/script'
import '../globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FloatingActions from '@/components/FloatingActions'
import { getCitiesWithCounts, getProjectsForMenu, getPublishedBlogPosts, getSiteSettings } from '@/lib/queries'
import { themeStyleTagContent } from '@/lib/themes'

// Manrope display (headings) + Inter body — clean, modern, premium sans pairing.
const display = Manrope({ subsets: ['latin'], variable: '--font-display', weight: ['500', '600', '700', '800'], display: 'swap' })
const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const serif = Fraunces({ subsets: ['latin'], variable: '--font-serif', display: 'swap' })

// Fallbacks used only if the site_settings row is ever missing.
const FALLBACK_SITE_NAME = 'ANON INDIA'
const FALLBACK_SITE_DESC = 'Premium plotted developments and real estate projects in Rajasthan. RERA approved. Trusted by 1000+ happy families.'

// Derived from the public Supabase URL so preconnect always matches the project.
const SUPABASE_ORIGIN = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').origin
  } catch {
    return ''
  }
})()

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const siteName = settings?.site_name ?? FALLBACK_SITE_NAME
  const description = settings?.default_meta_description ?? FALLBACK_SITE_DESC

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://anonindia.com'),
    title:       { default: `${siteName} — Premium Real Estate`, template: settings?.default_title_template ?? `%s | ${siteName}` },
    description,
    keywords:    ['plots Jaipur', 'real estate Rajasthan', 'RERA approved plots', 'plotted development Jaipur'],
    openGraph: {
      type:        'website',
      siteName,
      description,
      ...(settings?.default_og_image_url ? { images: [settings.default_og_image_url] } : {}),
    },
    twitter:  { card: 'summary_large_image' },
    robots:   { index: true, follow: true },
    icons: {
      icon: [
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
        { url: '/favicon-64x64.png', sizes: '64x64', type: 'image/png' },
        { url: '/favicon-128x128.png', sizes: '128x128', type: 'image/png' },
        { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
      ],
      apple: [
        { url: '/favicon-180x180.png', sizes: '180x180', type: 'image/png' },
      ],
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Data for the Projects + Blog mega-menus in the nav.
  const [cities, menuProjects, blogPosts, settings] = await Promise.all([
    getCitiesWithCounts(),
    getProjectsForMenu(),
    getPublishedBlogPosts(4),
    getSiteSettings(),
  ])
  const siteName = settings?.site_name ?? FALLBACK_SITE_NAME
  const description = settings?.default_meta_description ?? FALLBACK_SITE_DESC

  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${serif.variable}`}>
      <head>
        {/* Active theme's brand/gold CSS variables — see src/lib/themes.ts. */}
        <style id="theme-vars" dangerouslySetInnerHTML={{ __html: themeStyleTagContent(settings?.theme_name) }} />
        {/* Warm up the connection to Supabase (data + storage images) early. */}
        {SUPABASE_ORIGIN && <>
          <link rel="preconnect" href={SUPABASE_ORIGIN} crossOrigin="anonymous" />
          <link rel="dns-prefetch" href={SUPABASE_ORIGIN} />
        </>}
        {/* Unsplash supplies fallback imagery on most pages — warm it up too. */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="bg-white font-sans antialiased">
        {settings?.ga_measurement_id && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${settings.ga_measurement_id}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${settings.ga_measurement_id}');
              `}
            </Script>
          </>
        )}
        {settings?.meta_pixel_id && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${settings.meta_pixel_id}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'RealEstateAgent',
          name: siteName,
          description,
          url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://anonindia.com',
          telephone: settings?.whatsapp_number ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '+919876543210',
          areaServed: 'IN',
          address: { '@type': 'PostalAddress', addressRegion: 'Rajasthan', addressCountry: 'IN' },
        }) }} />
        <Nav cities={cities} projects={menuProjects} posts={blogPosts} />
        <main>{children}</main>
        <Footer projects={menuProjects} settings={settings} />
        <FloatingActions />
      </body>
    </html>
  )
}
