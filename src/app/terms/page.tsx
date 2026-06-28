import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import Reveal from '@/components/Reveal'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms and conditions for using the ANON INDIA website.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-cream">
      <PageHero
        eyebrow="Legal"
        title="Terms of Use"
        subtitle="Last updated: January 2025"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 section">
        <Reveal className="bg-white rounded-2xl border border-gray-100 p-8 prose prose-gray max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using this website, you accept and agree to be bound by these Terms of Use. If you do not agree, please do not use this website.</p>

          <h2>2. Use of Content</h2>
          <p>All content on this website — including project details, pricing, images, and blog posts — is for informational purposes only. Prices and availability are indicative and subject to change without notice.</p>

          <h2>3. No Offer or Contract</h2>
          <p>Nothing on this website constitutes a legal offer or binding contract. A formal booking agreement, cost sheet, and sale deed are the only legally binding documents. All enquiries are non-binding expressions of interest.</p>

          <h2>4. RERA Compliance</h2>
          <p>All project information is as per RERA filings. For the latest registered details, please refer to the Rajasthan RERA portal at rera.rajasthan.gov.in.</p>

          <h2>5. Intellectual Property</h2>
          <p>All logos, images, text, and branding on this website are the property of ANON INDIA Real Estate. Reproduction without written permission is prohibited.</p>

          <h2>6. Limitation of Liability</h2>
          <p>ANON INDIA is not liable for any loss arising from reliance on information on this website. We recommend conducting independent due diligence before making any investment decision.</p>

          <h2>7. Third-Party Links</h2>
          <p>This website may contain links to third-party sites (e.g. RERA portal, Google Maps). We are not responsible for the content or privacy practices of those sites.</p>

          <h2>8. Governing Law</h2>
          <p>These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Jaipur, Rajasthan.</p>

          <h2>9. Contact</h2>
          <p>For any questions: <a href="mailto:info@anonindia.com">info@anonindia.com</a></p>
        </Reveal>
      </div>
    </div>
  )
}
