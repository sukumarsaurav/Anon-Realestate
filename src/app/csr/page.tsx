import type { Metadata } from 'next'
import { Trees, GraduationCap, HeartHandshake, Home } from 'lucide-react'

export const metadata: Metadata = {
  title: 'CSR',
  description: 'ANON INDIA corporate social responsibility — building communities, not just buildings.',
}

const initiatives = [
  { Icon: GraduationCap, t: 'Education', s: 'Scholarships and learning support for underprivileged students in the communities we build.' },
  { Icon: Trees, t: 'Green Spaces', s: 'Tree plantation drives and sustainable, low-impact development practices.' },
  { Icon: HeartHandshake, t: 'Community Welfare', s: 'Health camps and skill-development programs for local families.' },
  { Icon: Home, t: 'Affordable Housing', s: 'Initiatives that make safe, quality homes accessible to more people.' },
]

export default function CSRPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-brand-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-2">Corporate Social Responsibility</h1>
          <p className="text-gray-300">Building communities, not just buildings.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <p className="text-gray-600 leading-relaxed text-lg">
          At ANON INDIA, growth and responsibility go together. A part of everything we build goes back into the
          communities around our projects — through education, sustainability and welfare initiatives.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {initiatives.map(({ Icon, t, s }) => (
            <div key={t} className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="w-11 h-11 rounded-xl bg-gold-50 flex items-center justify-center mb-4"><Icon size={20} className="text-gold-600" /></div>
              <p className="font-semibold text-brand-900 mb-1">{t}</p>
              <p className="text-sm text-gray-500">{s}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
