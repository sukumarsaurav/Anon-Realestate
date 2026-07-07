import type { Metadata } from 'next'
import { Wallet, TrendingUp, Target, Users, ShieldCheck, Building2 } from 'lucide-react'
import { getActiveCareerListings } from '@/lib/queries'
import PageHero from '@/components/PageHero'
import Reveal from '@/components/Reveal'
import CareerListings from '@/components/CareerListings'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Careers',
  description: "Join ANON INDIA — Rajasthan's fastest-growing real estate team. Explore open positions and apply online.",
}

const PERKS = [
  { Icon: Wallet, label: 'Competitive Pay', desc: 'Best-in-market CTC + performance incentives' },
  { Icon: TrendingUp, label: 'Fast Growth', desc: 'Clear career progression paths' },
  { Icon: Target, label: 'Real Ownership', desc: 'Your work directly impacts the business' },
  { Icon: Users, label: 'Team Culture', desc: 'Supportive, honest, and collaborative' },
  { Icon: ShieldCheck, label: 'Employee Benefits', desc: 'Health insurance, leaves, and more' },
  { Icon: Building2, label: 'Great Location', desc: 'Central Jaipur office with amenities' },
]

export default async function CareersPage() {
  const listings = await getActiveCareerListings()

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        eyebrow="Join the team"
        title="Careers at ANON INDIA"
        subtitle="Join Rajasthan's fastest growing real estate team."
        image="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&q=80&auto=format&fit=crop"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section">
        {/* Why join */}
        <Reveal className="bg-white rounded-2xl border border-gray-100 p-8 mb-8">
          <h2 className="h-block mb-5">Why Work With Us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PERKS.map(({ Icon, label, desc }) => (
              <div key={label} className="p-4">
                <div className="w-10 h-10 rounded-xl bg-gold-50 flex items-center justify-center mb-3"><Icon size={18} className="text-gold-700" /></div>
                <p className="font-semibold text-brand-900 text-sm">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Job listings (interactive island) */}
        <Reveal delay={100}>
          <h2 className="h-block mb-4">Open Positions</h2>
          <CareerListings listings={listings} />
        </Reveal>
      </div>
    </div>
  )
}
