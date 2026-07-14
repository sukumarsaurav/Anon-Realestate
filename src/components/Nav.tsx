'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, Phone, ChevronDown, ArrowRight, MapPin } from 'lucide-react'
import { PROJECT_TYPE_LABELS } from '@/types'
import type { Project, BlogPost, CityStat } from '@/types'
import { formatINR } from '@/lib/format'
import { projectImage } from '@/lib/images'

const PHONE = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '+917065056999'

const simpleLinks = [
  { label: 'About', href: '/about' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
]

const moreLinks = [
  { label: 'ANON Group', href: '/developers' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'CSR', href: '/csr' },
  { label: 'Events', href: '/events' },
  { label: 'Awards & Recognition', href: '/awards' },
  { label: 'Vision & Mission', href: '/vision' },
]

type MenuKey = 'projects' | 'blog' | 'more' | null

interface NavProps {
  cities: CityStat[]
  projects: Project[]
  posts: BlogPost[]
}

export default function Nav({ cities, projects, posts }: NavProps) {
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState<MenuKey>(null)
  const [mobileSection, setMobileSection] = useState<'projects' | 'blog' | null>(null)
  const [activeCity, setActiveCity] = useState<string>(cities[0]?.city ?? '')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const cityProjects = projects.filter((p) => p.city === (activeCity || cities[0]?.city)).slice(0, 3)
  const featured = posts[0]
  const moreArticles = posts.slice(1, 4)

  // Short close-delay so moving the pointer across the gap between the trigger
  // and the panel doesn't close the menu (re-entering cancels the pending close).
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const openMenu = (key: Exclude<MenuKey, null>) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setMenu(key)
  }
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setMenu(null), 140)
  }
  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current) }, [])

  // Open on hover AND keyboard focus; close on Escape or when focus leaves the group.
  const menuHandlers = (key: Exclude<MenuKey, null>) => ({
    onMouseEnter: () => openMenu(key),
    onMouseLeave: scheduleClose,
    onFocus: () => openMenu(key),
    onBlur: (e: React.FocusEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setMenu(null)
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') setMenu(null)
    },
  })

  return (
    <header className={`sticky top-0 z-50 bg-white/90 backdrop-blur transition-shadow ${scrolled ? 'shadow-card border-b border-transparent' : 'border-b border-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-[height] duration-300 ${scrolled ? 'h-14' : 'h-16'}`}>
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/logo-anon.png" alt="ANON INDIA" width={237} height={48} className="h-11 w-auto object-contain shrink-0" priority />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Projects mega */}
            <div className="static" {...menuHandlers('projects')}>
              <button aria-haspopup="true" aria-expanded={menu === 'projects'}
                className="flex items-center gap-1 px-3.5 py-2 text-sm font-medium text-gray-600 hover:text-brand-900 hover:bg-white rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400">
                Projects <ChevronDown size={14} className={menu === 'projects' ? 'rotate-180 transition-transform' : 'transition-transform'} />
              </button>
              {menu === 'projects' && (
                <MegaPanel>
                  <div className="grid grid-cols-12 gap-0">
                    {/* Cities */}
                    <div className="col-span-3 border-r border-gray-100 pr-2 max-h-[60vh] overflow-y-auto">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">Select City</p>
                      {cities.length === 0 && <p className="px-3 py-2 text-sm text-gray-500">No cities yet</p>}
                      {cities.map((c) => (
                        <Link key={c.city} href={`/projects?city=${encodeURIComponent(c.city)}`}
                          onMouseEnter={() => setActiveCity(c.city)} onClick={() => setMenu(null)}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                            activeCity === c.city ? 'bg-brand-900 text-white' : 'text-gray-700 hover:bg-white'
                          }`}>
                          <span>{c.city}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${activeCity === c.city ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>{c.count}</span>
                        </Link>
                      ))}
                    </div>
                    {/* Property types */}
                    <div className="col-span-3 border-r border-gray-100 px-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">Property Type</p>
                      <Link href="/projects" onClick={() => setMenu(null)} className="block px-3 py-2.5 rounded-lg text-sm bg-gold-50 text-gold-700 font-medium">All Types</Link>
                      {Object.entries(PROJECT_TYPE_LABELS).map(([v, l]) => (
                        <Link key={v} href={`/projects?type=${v}`} onClick={() => setMenu(null)}
                          className="block px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-white">{l}</Link>
                      ))}
                    </div>
                    {/* Property preview */}
                    <div className="col-span-6 pl-4">
                      <div className="flex items-center justify-between px-1 py-2">
                        <p className="font-semibold text-brand-900">Properties in {activeCity || '—'}</p>
                        {activeCity && (
                          <Link href={`/projects?city=${encodeURIComponent(activeCity)}`} onClick={() => setMenu(null)}
                            className="flex items-center gap-1 text-sm font-semibold text-gold-700 hover:text-brand-900 transition-colors">
                            View All <ArrowRight size={14} />
                          </Link>
                        )}
                      </div>
                      <div className="space-y-2">
                        {cityProjects.length === 0 && <p className="px-1 py-3 text-sm text-gray-500">No properties listed here yet.</p>}
                        {cityProjects.map((p) => {
                          const img = projectImage(p)
                          return (
                            <Link key={p.id} href={`/projects/${p.id}`} onClick={() => setMenu(null)}
                              className="flex items-center gap-3 p-2 rounded-xl hover:bg-white transition-colors">
                              <div className="relative w-20 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                <Image src={img} alt={p.name} fill sizes="80px" className="object-cover" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-brand-900 text-sm truncate">{p.name}</p>
                                <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={11} />{p.locality || p.city}</p>
                                <p className="text-sm font-bold text-gold-700 mt-0.5">{formatINR(p.starting_price)}</p>
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </MegaPanel>
              )}
            </div>

            {/* Blog mega */}
            <div className="static" {...menuHandlers('blog')}>
              <button aria-haspopup="true" aria-expanded={menu === 'blog'}
                className="flex items-center gap-1 px-3.5 py-2 text-sm font-medium text-gray-600 hover:text-brand-900 hover:bg-white rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400">
                Blog <ChevronDown size={14} className={menu === 'blog' ? 'rotate-180 transition-transform' : 'transition-transform'} />
              </button>
              {menu === 'blog' && (
                <MegaPanel>
                  {posts.length === 0 ? (
                    <p className="px-2 py-6 text-sm text-gray-500">No articles published yet.</p>
                  ) : (
                    <div className="grid grid-cols-12 gap-6">
                      {/* Featured */}
                      {featured && (
                        <Link href={`/blog/${featured.slug}`} onClick={() => setMenu(null)} className="col-span-5 group">
                          <div className="relative h-44 rounded-xl bg-gray-100 overflow-hidden mb-3">
                            {featured.featured_image_url && (
                              <Image src={featured.featured_image_url} alt={featured.title} fill sizes="360px" className="object-cover group-hover:scale-105 transition-transform" />
                            )}
                            <span className="absolute top-2 left-2 text-[10px] font-semibold uppercase tracking-wide bg-gold-500 text-white px-2 py-0.5 rounded">Featured</span>
                          </div>
                          <h4 className="font-semibold text-brand-900 leading-snug group-hover:text-gold-700 line-clamp-2">{featured.title}</h4>
                          {featured.excerpt && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{featured.excerpt}</p>}
                        </Link>
                      )}
                      {/* More articles */}
                      <div className="col-span-7">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-brand-900">More Articles</p>
                          <Link href="/blog" onClick={() => setMenu(null)} className="flex items-center gap-1 text-sm font-semibold text-gold-700 hover:text-brand-900 transition-colors">View All <ArrowRight size={14} /></Link>
                        </div>
                        <div className="space-y-2">
                          {moreArticles.map((a) => (
                            <Link key={a.id} href={`/blog/${a.slug}`} onClick={() => setMenu(null)} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white group">
                              <div className="relative w-20 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                {a.featured_image_url && <Image src={a.featured_image_url} alt={a.title} fill sizes="80px" className="object-cover" />}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-brand-900 text-sm leading-snug line-clamp-2 group-hover:text-gold-700">{a.title}</p>
                                <p className="text-xs text-gold-700 font-medium mt-1">Read now →</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </MegaPanel>
              )}
            </div>

            {simpleLinks.map((l) => (
              <Link key={l.href} href={l.href} className="px-3.5 py-2 text-sm font-medium text-gray-600 hover:text-brand-900 hover:bg-white rounded-lg transition-colors">{l.label}</Link>
            ))}

            {/* More dropdown */}
            <div className="relative" {...menuHandlers('more')}>
              <button aria-haspopup="true" aria-expanded={menu === 'more'}
                className="flex items-center gap-1 px-3.5 py-2 text-sm font-medium text-gray-600 hover:text-brand-900 hover:bg-white rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400">
                More <ChevronDown size={14} className={menu === 'more' ? 'rotate-180 transition-transform' : 'transition-transform'} />
              </button>
              {menu === 'more' && (
                <div className="absolute right-0 top-full pt-2 w-56">
                  <div className="bg-white rounded-xl border border-gray-100 shadow-card overflow-hidden py-1">
                    {moreLinks.map((l) => (
                      <Link key={l.href} href={l.href} onClick={() => setMenu(null)} className="block px-4 py-2.5 text-sm text-gray-600 hover:text-brand-900 hover:bg-white">{l.label}</Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile toggle */}
          <button onClick={() => setOpen((v) => !v)} className="lg:hidden p-2 text-gray-500">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-gray-100 bg-white max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-3 space-y-1">
            {/* Projects — expandable: browse by city */}
            <div>
              <button
                onClick={() => setMobileSection((s) => (s === 'projects' ? null : 'projects'))}
                aria-expanded={mobileSection === 'projects'}
                className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-white rounded-xl">
                Projects
                <ChevronDown size={16} className={`transition-transform ${mobileSection === 'projects' ? 'rotate-180' : ''}`} />
              </button>
              {mobileSection === 'projects' && (
                <div className="pl-3 pb-1">
                  <Link href="/projects" onClick={() => setOpen(false)} className="block px-3 py-2 text-sm font-medium text-gold-700 hover:bg-white rounded-lg">View all projects →</Link>
                  {cities.length === 0 && <p className="px-3 py-2 text-sm text-gray-500">No cities yet</p>}
                  {cities.map((c) => (
                    <Link key={c.city} href={`/projects?city=${encodeURIComponent(c.city)}`} onClick={() => setOpen(false)}
                      className="flex items-center justify-between px-3 py-2 text-sm text-gray-600 hover:bg-white rounded-lg">
                      <span className="flex items-center gap-1.5"><MapPin size={13} className="text-gray-500" />{c.city}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{c.count}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Blog — expandable: recent posts */}
            <div>
              <button
                onClick={() => setMobileSection((s) => (s === 'blog' ? null : 'blog'))}
                aria-expanded={mobileSection === 'blog'}
                className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-white rounded-xl">
                Blog
                <ChevronDown size={16} className={`transition-transform ${mobileSection === 'blog' ? 'rotate-180' : ''}`} />
              </button>
              {mobileSection === 'blog' && (
                <div className="pl-3 pb-1">
                  <Link href="/blog" onClick={() => setOpen(false)} className="block px-3 py-2 text-sm font-medium text-gold-700 hover:bg-white rounded-lg">View all articles →</Link>
                  {posts.length === 0 && <p className="px-3 py-2 text-sm text-gray-500">No articles yet</p>}
                  {posts.slice(0, 4).map((p) => (
                    <Link key={p.id} href={`/blog/${p.slug}`} onClick={() => setOpen(false)}
                      className="block px-3 py-2 text-sm text-gray-600 hover:bg-white rounded-lg line-clamp-1">{p.title}</Link>
                  ))}
                </div>
              )}
            </div>

            {[...simpleLinks, ...moreLinks].map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-brand-900 hover:bg-white rounded-xl">{l.label}</Link>
            ))}
            <Link href="/contact" onClick={() => setOpen(false)} className="block mt-2 px-3 py-3 bg-gold-500 text-white text-sm font-semibold rounded-xl text-center">Free Consultation</Link>
          </div>
        </div>
      )}
    </header>
  )
}

/** Full-width dropdown panel anchored under the header. */
function MegaPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute left-0 right-0 top-full pt-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-4">{children}</div>
      </div>
    </div>
  )
}
