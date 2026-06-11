'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageCircle, Phone, CalendarCheck } from 'lucide-react'

const PHONE_RAW = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '+919876543210'

export default function FloatingActions() {
  const pathname = usePathname()
  const number = PHONE_RAW.replace(/\D/g, '') || '919876543210'

  // Hide on the public album share pages and any embedded views.
  if (pathname.startsWith('/share')) return null

  const isProject = pathname.startsWith('/projects/')
  const ref = isProject ? pathname.split('/').pop() : null
  const message = ref
    ? `Hi, I'm interested in this project (Ref: ${ref}). Please share details.`
    : `Hi, I'm interested in ANON INDIA properties. Please share details.`

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2.5">
      <Link
        href="/contact"
        className="flex items-center gap-2 px-4 py-2.5 bg-gold-500 text-brand-900 rounded-full shadow-lg hover:bg-gold-600 hover:text-white transition-all text-sm font-semibold"
      >
        <CalendarCheck size={18} className="shrink-0" />
        <span className="hidden sm:block">Enquire</span>
      </Link>
      <a
        href={`https://wa.me/${number}?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all text-sm font-semibold"
      >
        <MessageCircle size={18} className="shrink-0" />
        <span className="hidden sm:block">WhatsApp</span>
      </a>
      <a
        href={`tel:${PHONE_RAW}`}
        aria-label="Call us"
        className="flex items-center gap-2 px-4 py-2.5 bg-brand-900 text-white rounded-full shadow-lg hover:bg-brand-700 transition-all text-sm font-semibold"
      >
        <Phone size={18} className="shrink-0" />
        <span className="hidden sm:block">Call</span>
      </a>
    </div>
  )
}
