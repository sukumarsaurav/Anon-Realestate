import type { Metadata } from 'next'
import {
  Wallet, TrendingUp, Target, Users, ShieldCheck, Building2,
  ArrowRight, BadgeCheck, Headphones, Lock, IndianRupee,
} from 'lucide-react'
import { getActiveCareerListings } from '@/lib/queries'
import PageHero from '@/components/PageHero'
import Reveal from '@/components/Reveal'
import CareerListings from '@/components/CareerListings'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Careers',
  description:
    "Join ANON INDIA — Noida & NCR's fastest-growing real estate team. Explore open positions, apply online, or sign in to the ANON INDIA Partner Portal.",
}

const PERKS = [
  { Icon: Wallet, label: 'Competitive Pay', desc: 'Best-in-market CTC + performance incentives' },
  { Icon: TrendingUp, label: 'Fast Growth', desc: 'Clear career progression paths' },
  { Icon: Target, label: 'Real Ownership', desc: 'Your work directly impacts the business' },
  { Icon: Users, label: 'Team Culture', desc: 'Supportive, honest, and collaborative' },
  { Icon: ShieldCheck, label: 'Employee Benefits', desc: 'Health insurance, leaves, and more' },
  { Icon: Building2, label: 'Great Location', desc: 'Noida Extension office with amenities' },
]

/** What the ANON INDIA Partner Portal offers, as listed on anonindia.org/login. */
const PORTAL_FEATURES = [
  {
    Icon: IndianRupee,
    label: 'Project-Based Earnings',
    desc: 'Track commissions from real estate deals, construction projects and interior assignments.',
  },
  {
    Icon: BadgeCheck,
    label: 'Secure & KYC-Verified',
    desc: 'Aadhaar and PAN verified access — fully compliant with the DPDP Act.',
  },
  {
    Icon: Headphones,
    label: '24/7 Partner Support',
    desc: 'Dedicated support for your projects, leads and payout queries.',
  },
]

const PORTAL_BADGES = ['DPDP Compliant', 'ISO 27001', '256-bit SSL']

const PORTAL_LOGIN_URL = 'https://anonindia.org/login'
const PORTAL_SIGNUP_URL = 'https://anonindia.org/signup'

export default async function CareersPage() {
  const listings = await getActiveCareerListings()

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        eyebrow="Join the team"
        title="Careers at ANON INDIA"
        subtitle="Join Noida & NCR's fastest growing real estate team."
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

      {/* Partner Portal — for channel partners rather than salaried roles. */}
      <section className="bg-brand-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <Reveal className="lg:col-span-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400 mb-4">
                Partner Portal
              </p>
              <h2 className="font-serif text-heading font-semibold">
                Work with us as a channel partner
              </h2>
              <div className="h-px w-16 bg-gold-400/80 my-6" />
              <p className="text-gray-300 leading-relaxed">
                Already an ANON INDIA partner? Sign in to manage your real estate, construction and
                interior decor projects, track leads and follow your commissions end to end.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={PORTAL_LOGIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  <Lock size={16} /> Partner Login
                </a>
                <a
                  href={PORTAL_SIGNUP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/25 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
                >
                  Register as a partner <ArrowRight size={16} />
                </a>
              </div>

              <div className="flex flex-wrap gap-2.5 mt-8">
                {PORTAL_BADGES.map((b) => (
                  <span
                    key={b}
                    className="badge bg-white/10 text-gray-200 border border-white/15"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </Reveal>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
              {PORTAL_FEATURES.map(({ Icon, label, desc }, i) => (
                <Reveal
                  key={label}
                  delay={100 + i * 80}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-start gap-4"
                >
                  <div className="w-11 h-11 rounded-xl bg-gold-500/15 flex items-center justify-center shrink-0">
                    <Icon size={19} className="text-gold-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{label}</p>
                    <p className="text-sm text-gray-300 leading-relaxed mt-1">{desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
