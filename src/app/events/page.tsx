import type { Metadata } from 'next'
import Link from 'next/link'
import { CalendarDays, MapPin } from 'lucide-react'
import PageHero from '@/components/PageHero'
import Reveal from '@/components/Reveal'

export const metadata: Metadata = {
  title: 'Events',
  description: 'Site visits, property expos and investor meets hosted by ANON INDIA.',
}

const events = [
  { title: 'Weekend Site Visit Drive', when: 'Every Saturday & Sunday', where: 'All Jaipur projects', body: 'Guided, no-pressure site visits with a dedicated advisor. Book your slot.' },
  { title: 'Property Investment Meet', when: 'Monthly', where: 'ANON INDIA, Jaipur', body: 'Market insights and curated opportunities for serious investors.' },
  { title: 'New Launch Preview', when: 'On announcement', where: 'Project site', body: 'Early-bird pricing and first pick of inventory for registered buyers.' },
]

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-cream">
      <PageHero
        eyebrow="What's on"
        title="Events"
        subtitle="Site visits, expos and investor meets."
        image="https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1920&q=80&auto=format&fit=crop"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 section">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {events.map((e, i) => (
            <Reveal key={e.title} delay={i * 90} className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="w-11 h-11 rounded-xl bg-gold-50 flex items-center justify-center mb-4"><CalendarDays size={20} className="text-gold-700" /></div>
              <p className="font-semibold text-brand-900">{e.title}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-1.5">
                <span className="flex items-center gap-1"><CalendarDays size={12} />{e.when}</span>
                <span className="flex items-center gap-1"><MapPin size={12} />{e.where}</span>
              </div>
              <p className="text-sm text-gray-500 mt-3">{e.body}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={300} className="mt-10 text-center">
          <Link href="/contact" className="btn-primary">Register your interest</Link>
        </Reveal>
      </div>
    </div>
  )
}
