import type { Metadata } from 'next'
import LeadForm from '@/components/LeadForm'
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with ANON INDIA. Call, WhatsApp, or fill the form for a free callback from our real estate advisors.',
}

export default function ContactPage() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') ?? '919876543210'

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-brand-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-2">Contact Us</h1>
          <p className="text-gray-300">Our advisors are available 9am–7pm, Monday to Saturday</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact details */}
          <div className="space-y-5">
            {[
              {
                icon: MapPin, label: 'Office Address', color: 'text-gold-700', bg: 'bg-gold-50',
                content: 'ANON INDIA Real Estate\n123, Sindhi Colony, Jaipur, Rajasthan 302001',
              },
              {
                icon: Phone, label: 'Call Us', color: 'text-green-600', bg: 'bg-green-50',
                content: '+91 98765 43210\nMon–Sat, 9am–7pm',
                href: 'tel:+919876543210',
              },
              {
                icon: MessageCircle, label: 'WhatsApp', color: 'text-green-600', bg: 'bg-green-50',
                content: 'Chat with us on WhatsApp for instant support',
                href: `https://wa.me/${waNumber}?text=Hi, I have an enquiry about ANON INDIA properties.`,
              },
              {
                icon: Mail, label: 'Email', color: 'text-amber-600', bg: 'bg-amber-50',
                content: 'info@anonindia.com\nReply within 2 business hours',
                href: 'mailto:info@anonindia.com',
              },
              {
                icon: Clock, label: 'Business Hours', color: 'text-purple-600', bg: 'bg-purple-50',
                content: 'Monday – Saturday\n9:00 AM – 7:00 PM IST\nSunday by appointment',
              },
            ].map(({ icon: Icon, label, color, bg, content, href }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-start gap-4">
                  <div className={`${bg} w-10 h-10 rounded-xl flex items-center justify-center shrink-0`}>
                    <Icon size={18} className={color} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm mb-1">{label}</p>
                    {href ? (
                      <a href={href} target={href.startsWith('http') ? '_blank' : undefined}
                        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-sm text-gray-500 hover:text-gold-700 whitespace-pre-line">{content}</a>
                    ) : (
                      <p className="text-sm text-gray-500 whitespace-pre-line">{content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
            <LeadForm
              source="contact_page"
              title=""
              subtitle=""
            />
            <div className="mt-8 rounded-2xl overflow-hidden bg-gray-100 h-56 flex items-center justify-center">
              <p className="text-gray-400 text-sm flex items-center gap-2">
                <MapPin size={16} /> Google Maps embed — add your embed URL
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
