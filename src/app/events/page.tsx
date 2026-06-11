import type { Metadata } from 'next'
import Link from 'next/link'
import { CalendarDays, MapPin } from 'lucide-react'

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
      <div className="bg-brand-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-2">Events</h1>
          <p className="text-gray-300">Site visits, expos and investor meets.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {events.map((e) => (
            <div key={e.title} className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="w-11 h-11 rounded-xl bg-gold-50 flex items-center justify-center mb-4"><CalendarDays size={20} className="text-gold-600" /></div>
              <p className="font-semibold text-brand-900">{e.title}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-1.5">
                <span className="flex items-center gap-1"><CalendarDays size={12} />{e.when}</span>
                <span className="flex items-center gap-1"><MapPin size={12} />{e.where}</span>
              </div>
              <p className="text-sm text-gray-500 mt-3">{e.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/contact" className="btn-primary">Register your interest</Link>
        </div>
      </div>
    </div>
  )
}
