import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CalendarDays, Camera, MapPin } from 'lucide-react'
import PageHero from '@/components/PageHero'
import Reveal from '@/components/Reveal'
import EventGallery from '@/components/EventGallery'
import { PAST_EVENTS, RECURRING_FORMATS } from '@/data/events'

export const metadata: Metadata = {
  title: 'Events',
  description:
    'Inside ANON INDIA events — the Big Winter Carnival at IRIS Broadway, the IRIS Awards Night, our Best Performance awards, and the weekend site visits you can join.',
}

const photoCount = PAST_EVENTS.reduce((n, e) => n + e.photos.length, 0)

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-white">
      <PageHero
        eyebrow="What's on"
        title="Events"
        subtitle="Carnivals, award nights and weekend site visits — here's what it looks like when the ANON INDIA team shows up."
        image="/events/winter-carnival/team-group.jpg"
      />

      {/* Recurring formats you can join */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section">
        <Reveal className="mb-10">
          <p className="eyebrow mb-3">Join us</p>
          <h2 className="section-heading">Open to buyers, every week</h2>
          <p className="section-sub">
            Standing formats you can register for any time — no ticket, no pressure.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {RECURRING_FORMATS.map((e, i) => (
            <Reveal key={e.title} delay={i * 90} className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
              <div className="w-11 h-11 rounded-xl bg-gold-50 flex items-center justify-center mb-4">
                <CalendarDays size={20} className="text-gold-700" />
              </div>
              <p className="h-block text-lg">{e.title}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-2">
                <span className="flex items-center gap-1"><CalendarDays size={12} />{e.when}</span>
                <span className="flex items-center gap-1"><MapPin size={12} />{e.where}</span>
              </div>
              <p className="text-sm text-gray-500 mt-3 leading-relaxed">{e.body}</p>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Past events with photos */}
      <section className="bg-brand-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section">
          <Reveal className="mb-12">
            <p className="eyebrow mb-3">Highlights</p>
            <h2 className="section-heading">Where we&rsquo;ve been</h2>
            <p className="section-sub flex items-center gap-2">
              <Camera size={16} className="text-gold-700 shrink-0" />
              <span className="tabular-nums-pro">{photoCount} photos</span>
              <span>from {PAST_EVENTS.length} recent events. Tap any frame to enlarge.</span>
            </p>
          </Reveal>

          <div className="space-y-14">
            {PAST_EVENTS.map((event, i) => (
              <Reveal key={event.slug} delay={i * 60} as="section" className="scroll-mt-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Details */}
                  <div className="lg:col-span-4">
                    <p className="eyebrow mb-3">{event.kind}</p>
                    <h3 className="font-serif text-title font-semibold text-brand-900">{event.title}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-3">
                      <span className="flex items-center gap-1 tabular-nums-pro">
                        <CalendarDays size={12} />{event.date}
                      </span>
                      <span className="flex items-center gap-1"><MapPin size={12} />{event.venue}</span>
                    </div>
                    <div className="h-px w-14 bg-gold-400/80 my-5" />
                    <p className="text-sm text-gray-500 leading-relaxed">{event.body}</p>
                  </div>

                  {/* Photos */}
                  <div className="lg:col-span-8">
                    <EventGallery photos={event.photos} eventTitle={event.title} />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section text-center">
        <Reveal>
          <h2 className="section-heading">Want an invite to the next one?</h2>
          <p className="section-sub mx-auto">
            Register your interest and we&rsquo;ll tell you about launch previews, carnivals and investor
            meets before they go public.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="btn-primary">Register your interest</Link>
            <Link href="/awards" className="btn-outline">
              See our awards <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
