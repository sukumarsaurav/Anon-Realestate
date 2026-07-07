import type { Metadata } from 'next'
import { Manrope, Inter, Fraunces } from 'next/font/google'
import '../globals.css'
import AdminShell from '@/components/admin/AdminShell'
import { createClient } from '@/lib/supabase/server'

import { getSiteSettings } from '@/lib/queries'

// /admin is its own root layout (own <html>/<body>) so it doesn't inherit the
// marketing site's Nav/Footer/menu-data fetches — see (marketing)/layout.tsx
// for the public-site root layout.
const display = Manrope({ subsets: ['latin'], variable: '--font-display', weight: ['500', '600', '700', '800'], display: 'swap' })
const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const serif = Fraunces({ subsets: ['latin'], variable: '--font-serif', display: 'swap' })

export const metadata: Metadata = {
  title: { default: 'Admin | ANON INDIA', template: '%s | Admin' },
  robots: { index: false, follow: false },
}

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const [userRes, settings] = await Promise.all([
    supabase.auth.getUser(),
    getSiteSettings()
  ])
  const user = userRes.data.user

  // Fetch admin user profile details
  const adminProfile = user
    ? (await supabase.from('admin_users').select('role, full_name').eq('id', user.id).maybeSingle()).data
    : null
  const isAdmin = Boolean(adminProfile)

  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${serif.variable}`}>
      <body className="bg-gray-50 font-sans antialiased">
        {isAdmin ? (
          <AdminShell
            userEmail={user!.email ?? ''}
            siteName={settings?.site_name}
            roleLabel={adminProfile?.role}
            userFullName={adminProfile?.full_name}
          >
            {children}
          </AdminShell>
        ) : (
          children
        )}
      </body>
    </html>
  )
}
