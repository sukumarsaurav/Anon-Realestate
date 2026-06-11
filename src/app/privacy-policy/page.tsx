import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'ANON INDIA privacy policy — how we collect, use, and protect your personal data.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-brand-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-2">Privacy Policy</h1>
          <p className="text-gray-300">Last updated: January 2025</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 prose prose-gray max-w-none">
          <h2>1. Information We Collect</h2>
          <p>We collect information you provide directly, including your name, phone number, email address, and any messages you send through our contact forms, lead forms, or brochure download gates.</p>
          <p>We may also collect technical data including IP address, browser type, device information, and pages visited, through cookies and analytics tools (Google Analytics, Meta Pixel).</p>

          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To contact you about real estate projects you&apos;ve enquired about</li>
            <li>To send you project updates, price notifications, and promotional materials (with your consent)</li>
            <li>To improve our website and services</li>
            <li>To comply with legal obligations</li>
          </ul>

          <h2>3. Sharing of Information</h2>
          <p>We do not sell your personal data. We may share it with our internal sales advisors, and trusted partners like home loan providers, only to assist in your property enquiry.</p>

          <h2>4. Data Retention</h2>
          <p>We retain your data for as long as necessary to fulfill the purposes described above, or as required by law. You may request deletion of your data at any time.</p>

          <h2>5. Cookies</h2>
          <p>Our website uses cookies for analytics and marketing purposes. You can disable cookies in your browser settings, though this may affect website functionality.</p>

          <h2>6. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal data. To exercise these rights, email us at <a href="mailto:privacy@anonindia.com">privacy@anonindia.com</a>.</p>

          <h2>7. Contact</h2>
          <p>For privacy-related queries: <strong>privacy@anonindia.com</strong> | ANON INDIA Real Estate, Jaipur, Rajasthan.</p>
        </div>
      </div>
    </div>
  )
}
