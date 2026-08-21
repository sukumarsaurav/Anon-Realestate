import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Handshake, Trophy, Users } from 'lucide-react'
import PageHero from '@/components/PageHero'
import Reveal from '@/components/Reveal'
import AwardsGrid from '@/components/AwardsGrid'
import { AWARDS } from '@/data/awards'

export const metadata: Metadata = {
  title: 'Awards & Recognition',
  description:
    'Recognition earned by ANON INDIA — the Swarnim Noida and Leaders of Change awards from Dainik Jagran, the IRIS Broadway Rising Star Award, and appreciation from Sunteck Beach Residences.',
}

/** Presenting organisations, in the order they first appear in AWARDS. */
const PRESENTERS = Array.from(new Set(AWARDS.map((a) => a.org)))

const STATS = [
  { icon: Trophy, value: `${AWARDS.length}`, label: 'Awards & citations received' },
  { icon: Handshake, value: `${PRESENTERS.length}`, label: 'Developers and institutions recognising us' },
  { icon: Users, value: '1000+', label: 'Families guided to their home' },
]

export default function AwardsPage() {
  return (
    <div className="min-h-screen bg-white">
      <PageHero
        eyebrow="Recognition"
        title="Awards & Recognition"
        subtitle="Trust, earned one happy family at a time — and acknowledged by the developers and institutions we work with."
        image="/events/iris-awards/stage-ceremony.jpg"
      />

      {/* Stats strip */}
      <section className="bg-brand-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 80} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white shadow-soft flex items-center justify-center shrink-0">
                  <s.icon size={20} className="text-gold-700" />
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-brand-900 tabular-nums-pro">{s.value}</p>
                  <p className="text-sm text-gray-500">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Award gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section">
        <Reveal className="mb-10">
          <p className="eyebrow mb-3">The wall</p>
          <h2 className="section-heading">Every award, up close</h2>
          <p className="section-sub">
            Tap any trophy, plaque or certificate to see it full size.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <AwardsGrid />
        </Reveal>

        {/* Presenters */}
        <Reveal delay={200} className="mt-14 pt-10 border-t border-gray-100">
          <p className="eyebrow mb-4">Presented by</p>
          <div className="flex flex-wrap gap-2.5">
            {PRESENTERS.map((org) => (
              <span
                key={org}
                className="badge bg-brand-50 text-brand-900 border border-gray-100"
              >
                {org}
              </span>
            ))}
          </div>
        </Reveal>
      </div>

      {/* CTA */}
      <section className="bg-brand-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="font-serif text-heading font-semibold">Work with an award-winning team</h2>
          <p className="text-gray-300 mt-3 max-w-xl mx-auto">
            The same advisors behind these recognitions will walk you through every site visit, price
            negotiation and handover.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="btn-primary">Talk to an advisor</Link>
            <Link
              href="/events"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/25 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
            >
              See our events <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
