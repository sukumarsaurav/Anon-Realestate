'use client'

import { usePathname } from 'next/navigation'
import { MessageCircle } from 'lucide-react'

export default function WhatsAppButton() {
  const pathname = usePathname()
  const number   = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') ?? '917065056999'

  const isProject = pathname.startsWith('/projects/')
  const projectSlug = isProject ? pathname.split('/').pop() : null
  const message  = projectSlug
    ? `Hi, I'm interested in a project and would like to know more. (Ref: ${projectSlug})`
    : `Hi, I'm interested in ANON INDIA properties. Please share details.`

  const href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-whatsapp text-white rounded-full shadow-lg hover:bg-whatsapp-dark transition-all hover:shadow-xl group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={22} className="shrink-0" />
      <span className="text-sm font-semibold hidden sm:block group-hover:block">WhatsApp Us</span>
    </a>
  )
}
