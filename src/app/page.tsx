import Link from 'next/link'
import Image from 'next/image'
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
import TeamCarousel from '@/components/home/TeamCarousel'
import BlogCard from '@/components/BlogCard'
import ProjectCard from '@/components/ProjectCard'
import LeadForm from '@/components/LeadForm'
import Reveal from '@/components/Reveal'
import CountUp from '@/components/CountUp'
import Avatar from '@/components/Avatar'

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { Icon: Award, end: 15, suffix: '+', s: 'Years of expertise' },
              { Icon: Users, end: 2500, suffix: '+', s: 'Happy investors' },
              { Icon: MapPinned, end: 12, suffix: '+', s: 'Cities & projects' },
            ].map(({ Icon, end, suffix, s }) => (
              <div key={s} className="flex items-center gap-3 justify-center sm:justify-start">
                <div className="w-12 h-12 rounded-xl bg-gold-50 flex items-center justify-center shrink-0">
                  <Icon size={22} className="text-gold-700" />
                </div>
                <div>
                  <p className="font-serif text-2xl font-semibold text-brand-900"><CountUp end={end} suffix={suffix} /></p>
                  <p className="text-sm text-gray-500">{s}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Credibility anchor — grounds the numbers in verifiable proof */}
          <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-center sm:justify-between gap-x-6 gap-y-2 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-gold-700" /> RERA-compliant projects only
            </span>
            <Link href="/awards" className="inline-flex items-center gap-1 font-semibold text-gold-700 hover:text-brand-900 transition-colors">
              See our awards &amp; recognition <ArrowRight size={14} />
            </Link>
          </div>
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
              <Link href="/projects" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-gold-700 hover:text-brand-900 transition-colors">
                View all <ArrowRight size={15} />
              </Link>
            </div>
            {/* Responsive grid on desktop; horizontal snap-scroll on mobile (no off-screen bleed). */}
            <div className="flex gap-5 overflow-x-auto pb-4 snap-x sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible sm:pb-0">
              {featured.slice(0, 4).map((p) => (
                <div key={p.id} className="w-[280px] shrink-0 snap-start sm:w-auto"><ProjectCard project={p} /></div>
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
                  className="group relative h-44 rounded-2xl overflow-hidden ring-1 ring-black/5 shadow-sm">
                  <Image src={c.image} alt={`Real estate projects in ${c.city}`} fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110" />
                  {/* Bottom-up gradient so the label stays legible over any photo */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <p className="font-bold text-lg leading-tight drop-shadow-sm">{c.city}</p>
                    <p className="text-xs text-gray-200 flex items-center gap-1 mt-0.5">
                      View projects
                      <ArrowRight size={12} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </p>
                  </div>
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
            <TeamCarousel team={team} />
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
                <div key={t.id} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col">
                  <Quote size={22} className="text-gold-400 mb-3" />
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-4">&ldquo;{t.content}&rdquo;</p>
                  <div className="flex items-center justify-between mt-auto">
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
                  <Icon size={20} className="text-gold-700" />
                </div>
                <p className="font-semibold text-brand-900 mb-1">{t}</p>
                <p className="text-sm text-gray-500">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead capture band */}
      <section className="bg-brand-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-[2.4rem] md:leading-[1.1] font-semibold">Find the Right Property with Expert Guidance</h2>
            <p className="text-gray-300 mt-4 max-w-xl">Free consultation, RERA-verified options, and honest advice tailored to your budget. Our advisor calls you back within 30 minutes.</p>
            <ul className="mt-6 space-y-2.5">
              {[
                { Icon: ShieldCheck, t: 'RERA-verified projects only' },
                { Icon: Headphones, t: 'No-pressure, advisory-first approach' },
                { Icon: Award, t: '15+ years, 2,500+ investors served' },
              ].map(({ Icon, t }) => (
                <li key={t} className="flex items-center gap-3 text-gray-200">
                  <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-gold-400" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <Link href="/projects" className="inline-flex items-center gap-1 mt-7 text-sm font-semibold text-gold-400 hover:text-white transition-colors">
              Browse all properties <ArrowRight size={15} />
            </Link>
          </div>
          <div className="bg-white text-gray-900 rounded-2xl p-6 shadow-xl">
            <LeadForm source="home_cta" />
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
              <Link href="/blog" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-gold-700 hover:text-brand-900 transition-colors">
                Read more <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
