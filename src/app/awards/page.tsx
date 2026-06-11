import type { Metadata } from 'next'
import Link from 'next/link'
import { Award } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Awards & Recognition',
  description: 'Recognition earned by ANON INDIA for trust, quality and customer satisfaction.',
}

const awards = [
  { year: '2025', title: 'Trusted Real Estate Brand', body: 'Recognised for transparency and customer satisfaction.' },
  { year: '2024', title: 'Excellence in Project Delivery', body: 'On-time, RERA-compliant handovers across projects.' },
  { year: '2024', title: 'Customer Choice Award', body: 'Highest-rated advisory experience by verified buyers.' },
  { year: '2023', title: 'Emerging Developer of the Year', body: 'For quality-led growth across multiple verticals.' },
]

export default function AwardsPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-brand-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-2">Awards &amp; Recognition</h1>
          <p className="text-gray-300">Trust, earned one happy family at a time.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-3">
          {awards.map((a) => (
            <div key={a.title} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold-50 flex items-center justify-center shrink-0"><Award size={22} className="text-gold-600" /></div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-brand-900">{a.title}</p>
                  <span className="text-xs font-medium text-gold-700 bg-gold-50 px-2 py-0.5 rounded">{a.year}</span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{a.body}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/contact" className="btn-primary">Work with an award-winning team</Link>
        </div>
      </div>
    </div>
  )
}
