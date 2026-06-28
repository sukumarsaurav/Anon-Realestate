import type { Metadata } from 'next'
import { Star, Quote } from 'lucide-react'
import { getActiveTestimonials } from '@/lib/queries'
import Avatar from '@/components/Avatar'
import PageHero from '@/components/PageHero'
import Reveal from '@/components/Reveal'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Testimonials',
  description: 'Real stories from happy ANON INDIA homeowners and investors.',
}

export default async function TestimonialsPage() {
  const testimonials = await getActiveTestimonials()

  return (
    <div className="min-h-screen bg-cream">
      <PageHero
        eyebrow="Client stories"
        title="Real Stories from Happy Homeowners"
        subtitle="Trusted by thousands of families and investors."
        image="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80&auto=format&fit=crop"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section">
        {testimonials.length === 0 ? (
          <p className="text-center text-gray-500 py-16">Testimonials coming soon.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Reveal key={t.id} delay={(i % 3) * 80} className="bg-white rounded-2xl border border-gray-100 p-6">
                <Quote size={22} className="text-gold-400 mb-3" />
                <p className="text-gray-600 text-sm leading-relaxed mb-4">&ldquo;{t.content}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-brand-900 overflow-hidden flex shrink-0"><Avatar name={t.client_name} src={t.photo_url} fontClass="text-xs" /></span>
                    <div>
                      <p className="font-semibold text-brand-900 text-sm">{t.client_name}</p>
                      {t.project && <p className="text-xs text-gray-500">{t.project}</p>}
                    </div>
                  </div>
                  <div className="flex">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={13} className="text-gold-500 fill-gold-500" />
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
