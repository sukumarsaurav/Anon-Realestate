import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Warm up the connection to Supabase (data + storage images) early. */}
        <link rel="preconnect" href={SUPABASE_ORIGIN} crossOrigin="anonymous" />
        <link rel="dns-prefetch" href={SUPABASE_ORIGIN} />
      </head>
      <body className="bg-white">
        <Nav />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  )
}
