'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Building2, Phone } from 'lucide-react'

const links = [
  { label: 'Home',     href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Gallery',  href: '/gallery' },
  { label: 'Blog',     href: '/blog' },
  { label: 'About',    href: '/about' },
  { label: 'Careers',  href: '/careers' },
  { label: 'Contact',  href: '/contact' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <Building2 size={20} className="text-white" />
            </div>
            <div className="leading-none">
              <p className="font-bold text-gray-900 text-sm">ANON INDIA</p>
              <p className="text-xs text-gray-400">Real Estate</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <Link key={l.href} href={l.href}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a href={`tel:${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '+919876543210'}`}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-600">
              <Phone size={14} />
              <span>Call Us</span>
            </a>
            <Link href="/contact"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
              Get a Callback
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button onClick={() => setOpen((v) => !v)} className="lg:hidden p-2 text-gray-500">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 space-y-1">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl">
                {l.label}
              </Link>
            ))}
            <Link href="/contact" onClick={() => setOpen(false)}
              className="block mt-2 px-3 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl text-center">
              Get a Callback
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
