import Link from 'next/link'
import { Building2, MapPin, Phone, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                <Building2 size={20} className="text-white" />
              </div>
              <div className="leading-none">
                <p className="font-bold text-white text-sm">ANON INDIA</p>
                <p className="text-xs text-gray-400">Real Estate</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-5">
              Trusted real estate developer in Rajasthan. RERA approved projects. 1000+ happy families.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-blue-400 mt-0.5 shrink-0" />
                <span>Jaipur, Rajasthan, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-blue-400 shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white">+91 98765 43210</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-blue-400 shrink-0" />
                <a href="mailto:info@anonindia.com" className="hover:text-white">info@anonindia.com</a>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="font-semibold text-white mb-4">Quick Links</p>
            <ul className="space-y-2 text-sm">
              {[
                ['Projects',        '/projects'],
                ['Gallery',         '/gallery'],
                ['About Us',        '/about'],
                ['Blog',            '/blog'],
                ['Careers',         '/careers'],
                ['Contact',         '/contact'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="font-semibold text-white mb-4">Legal</p>
            <ul className="space-y-2 text-sm">
              {[
                ['Privacy Policy', '/privacy-policy'],
                ['Terms of Use',   '/terms'],
                ['RERA Details',   '/about#rera'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div>
            <p className="font-semibold text-white mb-4">Stay Updated</p>
            <p className="text-sm mb-4">Get notified about new project launches and investment opportunities.</p>
            <Link href="/contact"
              className="block w-full py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl text-center hover:bg-blue-700 transition-colors">
              Get Early Access
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} ANON INDIA Real Estate. All rights reserved.</p>
          <p>RERA Registered Developer · Rajasthan RERA</p>
        </div>
      </div>
    </footer>
  )
}
