'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { MessageCircle, Phone, CalendarCheck, Plus, X } from 'lucide-react'

const PHONE_RAW = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '+919876543210'

export default function FloatingActions() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const number = PHONE_RAW.replace(/\D/g, '') || '919876543210'

  // Hide on the public album share pages.
  if (pathname.startsWith('/share')) return null

  const isProject = pathname.startsWith('/projects/')
  const ref = isProject ? pathname.split('/').pop() : null
  const message = ref
    ? `Hi, I'm interested in this project (Ref: ${ref}). Please share details.`
    : `Hi, I'm interested in ANON INDIA properties. Please share details.`

  const items = [
    { label: 'Enquire', href: '/contact', external: false, cls: 'bg-gold-500 text-brand-900 hover:bg-gold-600 hover:text-white', Icon: CalendarCheck },
    { label: 'WhatsApp', href: `https://wa.me/${number}?text=${encodeURIComponent(message)}`, external: true, cls: 'bg-green-500 text-white hover:bg-green-600', Icon: MessageCircle },
    { label: 'Call', href: `tel:${PHONE_RAW}`, external: true, cls: 'bg-brand-900 text-white hover:bg-brand-700', Icon: Phone },
  ]

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
      {/* Expanded actions */}
      {open && items.map(({ label, href, external, cls, Icon }) =>
        external ? (
          <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
            className={`flex items-center gap-2 pl-4 pr-3 py-2.5 rounded-full shadow-lg text-sm font-semibold transition-all animate-fade-up ${cls}`}>
            <span>{label}</span><Icon size={17} className="shrink-0" />
          </a>
        ) : (
          <Link key={label} href={href}
            className={`flex items-center gap-2 pl-4 pr-3 py-2.5 rounded-full shadow-lg text-sm font-semibold transition-all animate-fade-up ${cls}`}>
            <span>{label}</span><Icon size={17} className="shrink-0" />
          </Link>
        ),
      )}

      {/* Toggle */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close contact options' : 'Contact us'}
        aria-expanded={open}
        className="w-14 h-14 rounded-full bg-brand-900 text-white shadow-xl flex items-center justify-center hover:bg-brand-700 transition-colors"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  )
}
