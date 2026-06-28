import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, Star, Users } from 'lucide-react'

/**
 * Image-forward cinematic hero. Full-bleed photo with the headline anchored
 * bottom-left, premium Manrope type, and a gold accent. Pure server component —
 * no client JS (search lives in the nav now).
 */
export default function HeroSearch() {
  return (
    <section className="relative isolate flex min-h-[88vh] bg-brand-900 text-white overflow-hidden">
      {/* Background image with slow ambient zoom */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80&auto=format&fit=crop"
          alt="" fill priority sizes="100vw" className="object-cover motion-safe:animate-slow-zoom" />
      </div>
      {/* Cinematic scrims — heavy at the bottom-left where the copy sits */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-900 via-brand-900/45 to-brand-900/30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-900/85 via-brand-900/30 to-transparent" />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pt-32 pb-20">
        <div className="max-w-3xl motion-safe:animate-fade-up">
          <p className="eyebrow text-gold-400 mb-5">Premium Real Estate · Rajasthan</p>
          <h1 className="font-display font-extrabold leading-[0.98] tracking-[-0.035em] text-[clamp(2.75rem,7vw,5.25rem)]">
            Find your next <span className="text-gold-400">premium property.</span>
          </h1>
          <p className="text-gray-200 text-lg leading-relaxed mt-7 max-w-xl">
            RERA-approved projects, transparent pricing, and end-to-end advisory — structures, spaces &amp; solutions engineered by Anon.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/projects" className="btn-primary">
              Explore Properties <ArrowRight size={18} />
            </Link>
            <Link href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/30 text-white font-semibold hover:bg-white/10 transition-colors">
              Book a Consultation
            </Link>
          </div>

          {/* Trust line */}
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-300">
            <span className="flex items-center gap-1.5"><ShieldCheck size={15} className="text-gold-400" /> RERA Approved</span>
            <span className="flex items-center gap-1.5"><Star size={15} className="text-gold-400 fill-gold-400" /> Transparent pricing</span>
            <span className="flex items-center gap-1.5"><Users size={15} className="text-gold-400" /> End-to-end advisory</span>
          </div>
        </div>
      </div>
    </section>
  )
}
