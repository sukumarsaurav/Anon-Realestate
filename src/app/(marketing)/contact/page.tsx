import type { Metadata } from 'next'
import LeadForm from '@/components/LeadForm'
import Reveal from '@/components/Reveal'
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react'
import PageHero from '@/components/PageHero'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with ANON INDIA. Call, WhatsApp, or fill the form for a free callback from our real estate advisors.',
}

export default function ContactPage() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') ?? '919876543210'

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        eyebrow="Get in touch"
        title="Contact Us"
        subtitle="Our advisors are available 9am–7pm, Monday to Saturday."
        image="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80&auto=format&fit=crop"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact details */}
          <Reveal className="space-y-5">
            {[
              {
                icon: MapPin, label: 'Office Address',
                content: 'ANON INDIA Real Estate\n123, Sindhi Colony, Jaipur, Rajasthan 302001',
              },
              {
                icon: Phone, label: 'Call Us',
                content: '+91 98765 43210\nMon–Sat, 9am–7pm',
                href: 'tel:+919876543210',
              },
              {
                icon: MessageCircle, label: 'WhatsApp',
                content: 'Chat with us on WhatsApp for instant support',
                href: `https://wa.me/${waNumber}?text=Hi, I have an enquiry about ANON INDIA properties.`,
              },
              {
                icon: Mail, label: 'Email',
                content: 'info@anonindia.com\nReply within 2 business hours',
                href: 'mailto:info@anonindia.com',
              },
              {
                icon: Clock, label: 'Business Hours',
                content: 'Monday – Saturday\n9:00 AM – 7:00 PM IST\nSunday by appointment',
              },
            ].map(({ icon: Icon, label, content, href }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-start gap-4">
                  <div className="bg-gold-50 w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-gold-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-brand-900 text-sm mb-1">{label}</p>
                    {href ? (
                      <a href={href} target={href.startsWith('http') ? '_blank' : undefined}
                        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-sm text-gray-600 hover:text-gold-700 whitespace-pre-line">{content}</a>
                    ) : (
                      <p className="text-sm text-gray-600 whitespace-pre-line">{content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </Reveal>

          {/* Contact form */}
          <Reveal delay={120} className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-8">
            <h2 className="h-block mb-6">Send Us a Message</h2>
            <LeadForm
              source="contact_page"
              title=""
              subtitle=""
            />
            <div className="mt-8 rounded-2xl overflow-hidden bg-gray-100 h-56 flex items-center justify-center">
              <p className="text-gray-500 text-sm flex items-center gap-2">
                <MapPin size={16} /> Google Maps embed — add your embed URL
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
