import Link from 'next/link'
import {
  Award, Users, MapPinned, ShieldCheck, Headphones, Cpu, Star, ArrowRight, Quote,
} from 'lucide-react'
import {
  getFeaturedProjects, getDevelopers, getTeamMembers, getCitiesWithCounts,
  getActiveTestimonials, getProjectCities, getPublishedBlogPosts,
} from '@/lib/queries'
import HeroSearch from '@/components/home/HeroSearch'
import PremiumProjects from '@/components/home/PremiumProjects'
import ReelsSection from '@/components/home/ReelsSection'
import ProjectCard from '@/components/ProjectCard'
import Reveal from '@/components/Reveal'
import CountUp from '@/components/CountUp'
import { avatarFor } from '@/lib/images'

export const revalidate = 300

export default async function HomePage() {
  const [featured, developers, team, cities, testimonials, cityList, posts] = await Promise.all([
    getFeaturedProjects(),
    getDevelopers(),
    getTeamMembers(),
    getCitiesWithCounts(),
    getActiveTestimonials(),
    getProjectCities(),
    getPublishedBlogPosts(3),
  ])

  return (
    <>
      <HeroSearch cities={cityList} />

      {/* Trust strip with animated counters */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { Icon: Award, end: 15, suffix: '+', s: 'Years of expertise' },
            { Icon: Users, end: 2500, suffix: '+', s: 'Happy investors' },
            { Icon: MapPinned, end: 12, suffix: '+', s: 'Cities & projects' },
          ].map(({ Icon, end, suffix, s }) => (
            <div key={s} className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-12 h-12 rounded-xl bg-gold-50 flex items-center justify-center shrink-0">
                <Icon size={22} className="text-gold-600" />
              </div>
              <div>
                <p className="font-serif text-2xl font-semibold text-brand-900"><CountUp end={end} suffix={suffix} /></p>
                <p className="text-sm text-gray-500">{s}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular new launches */}
      {featured.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="section-heading">Popular New Launches</h2>
                <p className="section-sub">Trending projects investors are booking right now.</p>
              </div>
              <Link href="/projects" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-gold-600 hover:text-gold-700">
                View all <ArrowRight size={15} />
              </Link>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x">
              {featured.map((p) => (
                <div key={p.id} className="w-[300px] shrink-0 snap-start"><ProjectCard project={p} /></div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Associated developers */}
      {developers.length > 0 && (
        <section className="bg-cream py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center mb-8">
              <h2 className="section-heading">The ANON INDIA Group</h2>
              <p className="section-sub mx-auto">Real estate, construction &amp; interiors — engineered by Anon.</p>
            </Reveal>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {developers.map((d) => (
                <div key={d.id} className="bg-white rounded-xl border border-gray-100 h-20 flex items-center justify-center px-4 text-center">
                  {d.logo_url
                    ? /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={d.logo_url} alt={d.name} className="max-h-10 max-w-full object-contain" />
                    : <span className="text-sm font-semibold text-gray-600">{d.name}</span>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Premium properties (tabbed) */}
      {featured.length > 0 && <PremiumProjects projects={featured} />}

      {/* Explore by city */}
      {cities.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="section-heading">Explore by City</h2>
              <p className="section-sub mx-auto">Find projects in your preferred location.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {cities.map((c) => (
                <Link key={c.city} href={`/projects?city=${encodeURIComponent(c.city)}`}
                  className="group relative h-28 rounded-2xl bg-brand-900 text-white overflow-hidden flex flex-col items-center justify-center hover:bg-brand-700 transition-colors">
                  <MapPinned size={20} className="text-gold-400 mb-1" />
                  <p className="font-semibold">{c.city}</p>
                  <p className="text-xs text-gray-300">{c.count} project{c.count !== 1 ? 's' : ''}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team */}
      {team.length > 0 && (
        <section className="bg-cream py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center mb-8">
              <h2 className="section-heading">Meet Your Property Advisors</h2>
              <p className="section-sub mx-auto">Experts who guide you from first call to final handover.</p>
            </Reveal>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {team.map((m) => (
                <div key={m.id} className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-brand-900 overflow-hidden mb-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.photo_url || avatarFor(m.name)} alt={m.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="font-semibold text-brand-900 text-sm">{m.name}</p>
                  <p className="text-xs text-gray-500">{m.designation}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="section-heading">Real Stories from Happy Homeowners</h2>
              <p className="section-sub mx-auto">Trusted by thousands of families and investors.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.slice(0, 6).map((t) => (
                <div key={t.id} className="bg-white rounded-2xl border border-gray-100 p-6">
                  <Quote size={22} className="text-gold-400 mb-3" />
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">&ldquo;{t.content}&rdquo;</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={t.photo_url || avatarFor(t.client_name)} alt={t.client_name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold text-brand-900 text-sm">{t.client_name}</p>
                        {t.project && <p className="text-xs text-gray-400">{t.project}</p>}
                      </div>
                    </div>
                    <div className="flex">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} size={13} className="text-gold-500 fill-gold-500" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* On the Gram — reels */}
      <ReelsSection />

      {/* Why choose us */}
      <section className="bg-cream py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="section-heading">Why Choose ANON INDIA</h2>
            <p className="section-sub mx-auto">A consultant that puts your interests first.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { Icon: ShieldCheck, t: 'RERA Verified', s: 'Only compliant, verified projects make our list.' },
              { Icon: Headphones, t: 'Customer Oriented', s: 'Genuine advice and proactive follow-up, always.' },
              { Icon: Cpu, t: 'Tech Enabled', s: 'Modern CRM, instant updates, zero paperwork hassle.' },
              { Icon: Award, t: 'Proven Track Record', s: '15+ years and thousands of happy investors.' },
            ].map(({ Icon, t, s }) => (
              <div key={t} className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="w-11 h-11 rounded-xl bg-gold-50 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-gold-600" />
                </div>
                <p className="font-semibold text-brand-900 mb-1">{t}</p>
                <p className="text-sm text-gray-500">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-brand-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <h2 className="text-3xl font-bold">Find the Right Property with Expert Guidance</h2>
          <p className="text-gray-300 mt-3 max-w-2xl mx-auto">Free consultation, RERA-verified options, and honest advice tailored to your budget.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-7">
            <Link href="/contact" className="btn-primary">Get Free Consultation</Link>
            <Link href="/projects" className="px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors">
              View Premium Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Blog */}
      {posts.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="section-heading">Property Guides &amp; Market Updates</h2>
                <p className="section-sub">Expert advice to help you invest smarter.</p>
              </div>
              <Link href="/blog" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-gold-600 hover:text-gold-700">
                Read more <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((p) => (
                <Link key={p.id} href={`/blog/${p.slug}`} className="card block p-6">
                  <p className="text-xs font-semibold text-gold-600 uppercase tracking-wide mb-2">{p.category}</p>
                  <h3 className="font-bold text-brand-900 mb-2 line-clamp-2">{p.title}</h3>
                  {p.excerpt && <p className="text-sm text-gray-500 line-clamp-3">{p.excerpt}</p>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
