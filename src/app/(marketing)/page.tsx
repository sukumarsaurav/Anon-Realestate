import Link from 'next/link'
import Image from 'next/image'
import {
  Award, Users, MapPinned, ShieldCheck, Headphones, Cpu, ArrowRight,
} from 'lucide-react'
import {
  getFeaturedProjects, getDevelopers, getTeamMembers, getCitiesWithCounts,
  getActiveTestimonials, getPublishedBlogPosts, getSiteSettings,
} from '@/lib/queries'
import HeroSearch from '@/components/home/HeroSearch'
import PremiumProjects from '@/components/home/PremiumProjects'
import ReelsSection from '@/components/home/ReelsSection'
import AwardsSection from '@/components/home/AwardsSection'
import TeamCarousel from '@/components/home/TeamCarousel'
import TestimonialMarquee from '@/components/home/TestimonialMarquee'
import NewLaunches from '@/components/home/NewLaunches'
import CityMarquee from '@/components/home/CityMarquee'
import BlogCard from '@/components/BlogCard'
import LeadForm from '@/components/LeadForm'
import Reveal from '@/components/Reveal'
import CountUp from '@/components/CountUp'

const ICON_MAP: Record<string, typeof ShieldCheck> = {
  ShieldCheck,
  Headphones,
  Cpu,
  Award,
  Users,
  MapPinned,
}

export const revalidate = 300

export default async function HomePage() {
  const [featured, developers, team, cities, testimonials, posts, settings] = await Promise.all([
    getFeaturedProjects(),
    getDevelopers(),
    getTeamMembers(),
    getCitiesWithCounts(),
    getActiveTestimonials(),
    getPublishedBlogPosts(3),
    getSiteSettings(),
  ])

  return (
    <>
      <HeroSearch />



      {/* Popular new launches */}
      {featured.length > 0 && <NewLaunches projects={featured} />}

      {/* Associated developers */}
      {developers.length > 0 && (
        <section className="bg-brand-50 py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center mb-8">
              <p className="eyebrow mb-3">The group</p>
              <h2 className="section-heading">The ANON INDIA Group</h2>
              <p className="section-sub mx-auto">Real estate, construction &amp; interiors — engineered by Anon.</p>
            </Reveal>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {developers.map((d) => (
                <div key={d.id} className="bg-white rounded-xl border border-brand-100 h-20 flex items-center justify-center px-4 text-center">
                  {d.logo_url ? (
                    <div className="relative w-full h-10">
                      <Image
                        src={d.logo_url}
                        alt={d.name}
                        fill
                        sizes="(max-width: 768px) 150px, 200px"
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <span className="text-sm font-semibold text-gray-600">{d.name}</span>
                  )}
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
        <section className="bg-brand-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <p className="eyebrow mb-3">Locations</p>
              <h2 className="section-heading">Explore by City</h2>
              <p className="section-sub mx-auto">Find projects in your preferred location.</p>
            </div>
            <CityMarquee cities={cities} />
          </div>
        </section>
      )}

      {/* Team */}
      {team.length > 0 && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center mb-8">
              <p className="eyebrow mb-3">Our people</p>
              <h2 className="section-heading">Meet Your Property Advisors</h2>
              <p className="section-sub mx-auto">Experts who guide you from first call to final handover.</p>
            </Reveal>
            <TeamCarousel team={team} />
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="bg-brand-50 py-16 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <p className="eyebrow mb-3">Testimonials</p>
              <h2 className="section-heading">Real Stories from Happy Homeowners</h2>
              <p className="section-sub mx-auto">Trusted by thousands of families and investors.</p>
            </div>
          </div>
          <TestimonialMarquee testimonials={testimonials.slice(0, 12)} />
        </section>
      )}

      {/* On the Gram — reels */}
      <ReelsSection reels={settings?.instagram_reels} instagramUrl={settings?.instagram_url} />

      {/* Why choose us */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="eyebrow mb-3">Why us</p>
            <h2 className="section-heading">Why Choose {settings?.site_name ?? 'ANON INDIA'}</h2>
            <p className="section-sub mx-auto">A consultant that puts your interests first.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(settings?.why_choose_us ?? [
              { icon: 'ShieldCheck', title: 'RERA Verified', description: 'Only compliant, verified projects make our list.' },
              { icon: 'Headphones', title: 'Customer Oriented', description: 'Genuine advice and proactive follow-up, always.' },
              { icon: 'Cpu', title: 'Tech Enabled', description: 'Modern CRM, instant updates, zero paperwork hassle.' },
              { icon: 'Award', title: 'Proven Track Record', description: '15+ years and thousands of happy investors.' },
            ]).map(({ icon, title, description }) => {
              const IconComponent = ICON_MAP[icon] || ShieldCheck
              return (
                <div key={title} className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="w-11 h-11 rounded-xl bg-gold-50 flex items-center justify-center mb-4">
                    <IconComponent size={20} className="text-gold-700" />
                  </div>
                  <p className="font-semibold text-brand-900 mb-1">{title}</p>
                  <p className="text-sm text-gray-500">{description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Awards & Accolades */}
      <AwardsSection />

      {/* Lead capture band */}
      <section className="bg-brand-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-heading font-semibold">Find the Right Property with Expert Guidance</h2>
            <p className="text-gray-200 mt-4 max-w-xl">Free consultation, RERA-verified options, and honest advice tailored to your budget. Our advisor calls you back within 30 minutes.</p>
            <ul className="mt-6 space-y-2.5">
              {(settings?.lead_capture_bullets ?? [
                "RERA-verified projects only",
                "No-pressure, advisory-first approach",
                "15+ years, 2,500+ investors served"
              ]).map((t, idx) => {
                const bulletIcons = [ShieldCheck, Headphones, Award]
                const IconComponent = bulletIcons[idx % bulletIcons.length]
                return (
                  <li key={t} className="flex items-center gap-3 text-gray-200">
                    <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                      <IconComponent size={16} className="text-gold-400" />
                    </span>
                    {t}
                  </li>
                )
              })}
            </ul>
            <Link href="/projects" className="inline-flex items-center gap-1 mt-7 text-sm font-semibold text-gold-400 hover:text-white transition-colors">
              Browse all properties <ArrowRight size={15} />
            </Link>
          </div>
          <div className="bg-white text-gray-900 rounded-2xl p-6 shadow-lift">
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
                <p className="eyebrow mb-3">Journal</p>
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
