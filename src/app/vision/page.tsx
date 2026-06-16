import type { Metadata } from 'next'
import { Target, Compass, Heart, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Vision & Mission',
  description: 'The vision, mission and values that drive ANON INDIA.',
}

const values = [
  { Icon: ShieldCheck, t: 'Integrity', s: 'Transparent pricing and honest advice on every deal.' },
  { Icon: Heart, t: 'Customer First', s: 'We measure success by the families we settle, not units sold.' },
  { Icon: Compass, t: 'Excellence', s: 'RERA-compliant, quality-led delivery across every vertical.' },
  { Icon: Target, t: 'Long-term Value', s: 'Investments that grow — for our customers and communities.' },
]

export default function VisionPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-brand-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-2">Vision &amp; Mission</h1>
          <p className="text-gray-300">Structures, spaces &amp; solutions — engineered by Anon.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-7">
            <div className="w-11 h-11 rounded-xl bg-gold-50 flex items-center justify-center mb-4"><Compass size={20} className="text-gold-700" /></div>
            <h2 className="font-bold text-brand-900 text-lg mb-2">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">To be India&apos;s most trusted real estate partner — making property ownership simple, transparent and rewarding for every family and investor.</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-7">
            <div className="w-11 h-11 rounded-xl bg-gold-50 flex items-center justify-center mb-4"><Target size={20} className="text-gold-700" /></div>
            <h2 className="font-bold text-brand-900 text-lg mb-2">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">To deliver RERA-approved projects and end-to-end advisory — across real estate, construction and interiors — backed by genuine guidance and lifelong relationships.</p>
          </div>
        </div>

        <div>
          <h2 className="section-heading mb-6">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map(({ Icon, t, s }) => (
              <div key={t} className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="w-10 h-10 rounded-xl bg-gold-50 flex items-center justify-center mb-3"><Icon size={18} className="text-gold-700" /></div>
                <p className="font-semibold text-brand-900 mb-1">{t}</p>
                <p className="text-sm text-gray-500">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
