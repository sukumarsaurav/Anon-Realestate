import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin, Youtube, Twitter } from 'lucide-react'
import type { Project } from '@/types'

const PHONE = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '+919876543210'

const socials = [
  { Icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { Icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { Icon: Twitter, href: 'https://twitter.com', label: 'X' },
  { Icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
  { Icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
]

interface FooterProps {
  projects?: Project[]
}

export default function Footer({ projects = [] }: FooterProps) {
  // Group projects by city, preserving insertion order (featured-first from query).
  const byCity: Record<string, Project[]> = {}
  for (const p of projects) {
    if (!byCity[p.city]) byCity[p.city] = []
    byCity[p.city].push(p)
  }
  const cities = Object.keys(byCity)

  return (
    <footer className="bg-brand-900 text-gray-200">
      {/* Gold dividing line — separates footer from the dark lead-capture section above */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

      {/* Properties by city */}
      {cities.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
          <div className="mb-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-400 mb-1">Our Portfolio</p>
            <h2 className="text-white font-semibold text-lg">Properties by City</h2>
          </div>
          <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-x-8">
            {cities.map((city) => {
              const MAX_SHOWN = 4
              const projects = byCity[city]
              const visible = projects.slice(0, MAX_SHOWN)
              const remaining = projects.length - MAX_SHOWN

              return (
                <div key={city} className="break-inside-avoid mb-6 border-l-2 border-gold-500/30 pl-4">
                  <p className="text-gold-400 font-semibold text-sm mb-2 flex items-center gap-1.5">
                    <MapPin size={12} className="shrink-0" />
                    {city}
                  </p>
                  <ul className="space-y-1.5">
                    {visible.map((p) => (
                      <li key={p.id}>
                        <Link
                          href={`/projects/${p.id}`}
                          className="text-gray-400 hover:text-white text-sm leading-snug transition-colors block"
                        >
                          {p.name}
                        </Link>
                      </li>
                    ))}
                    {remaining > 0 && (
                      <li>
                        <Link
                          href={`/projects?city=${encodeURIComponent(city)}`}
                          className="text-gold-400/70 hover:text-gold-400 text-xs transition-colors block mt-1"
                        >
                          +{remaining} more
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Divider between property list and main footer columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-white/10" />
      </div>

      {/* Main footer columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <Image src="/logo.svg" alt="ANON INDIA" width={40} height={40} className="rounded-full bg-white" />
              <div className="leading-none">
                <p className="font-bold text-white text-sm tracking-wide">ANON INDIA</p>
                <p className="text-[10px] text-gray-400">Structures · Spaces · Solutions</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-5">
              Trusted real estate consultant &amp; developer. RERA-approved projects, expert advisory, end-to-end support — engineered by Anon.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-gold-400 mt-0.5 shrink-0" />
                <span>Jaipur, Rajasthan, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-gold-400 shrink-0" />
                <a href={`tel:${PHONE}`} className="hover:text-white">{PHONE}</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-gold-400 shrink-0" />
                <a href="mailto:info@anonindia.com" className="hover:text-white">info@anonindia.com</a>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-5">
              {socials.map(({ Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-gold-500 hover:text-white flex items-center justify-center transition-colors">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="font-semibold text-white mb-4">Quick Links</p>
            <ul className="space-y-2 text-sm">
              {[
                ['Projects', '/projects'],
                ['About Us', '/about'],
                ['ANON Group', '/developers'],
                ['Testimonials', '/testimonials'],
                ['Careers', '/careers'],
                ['Events', '/events'],
                ['Contact', '/contact'],
              ].map(([label, href]) => (
                <li key={href}><Link href={href} className="hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="font-semibold text-white mb-4">Legal &amp; Info</p>
            <ul className="space-y-2 text-sm">
              {[
                ['Privacy Policy', '/privacy-policy'],
                ['Terms & Conditions', '/terms'],
                ['CSR Policy', '/csr'],
                ['Awards & Recognition', '/awards'],
                ['Vision & Mission', '/vision'],
                ['Gallery', '/gallery'],
              ].map(([label, href]) => (
                <li key={href}><Link href={href} className="hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className="font-semibold text-white mb-4">Stay Updated</p>
            <p className="text-sm mb-4">New launches &amp; investment opportunities, straight to your inbox.</p>
            <form className="flex gap-2">
              <input type="email" required placeholder="Your email"
                className="flex-1 min-w-0 rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-400" />
              <button type="submit" className="px-4 py-2.5 bg-gold-500 text-white text-sm font-semibold rounded-lg hover:bg-gold-600 transition-colors">
                Subscribe
              </button>
            </form>
            <p className="text-[11px] text-gray-500 mt-2">Unsubscribe anytime.</p>
          </div>
        </div>

        {/* RERA + copyright */}
        <div className="border-t border-white/10 mt-12 pt-8 space-y-3">
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-[11px] text-gray-500">
            <span className="font-semibold text-gray-400">RERA Registered:</span>
            <span>Rajasthan — RAJ/P/XXXX/XXXX</span>
            <span>UP — UPRERAAGTXXXXX</span>
            <span>Haryana — RC/HARERA/XXXX</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
            <p>© {new Date().getFullYear()} ANON INDIA. All rights reserved.</p>
            <p>Structures, Spaces &amp; Solutions — Engineered by Anon</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
