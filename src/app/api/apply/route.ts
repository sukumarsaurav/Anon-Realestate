import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabaseAdmin'
import { crmCareersEnabled, crmPost } from '@/lib/crm'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { listing_id, listing_title, name, phone, email, cover_letter, resume_url, cv_consent, company_website } = body ?? {}

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required.' }, { status: 400 })
    }

    // Applications belong in the CRM (HR → Recruitment). The shared secret stays on this server.
    if (crmCareersEnabled()) {
      const res = await crmPost('/api/webhooks/careers', {
        listing_id, listing_title, name, phone, email, cover_letter, resume_url, cv_consent: !!cv_consent, company_website,
      })
      const out = await res.json().catch(() => ({}))
      if (!res.ok) return NextResponse.json({ error: out.error ?? 'Failed to submit.' }, { status: res.status >= 500 ? 502 : res.status })
      return NextResponse.json({ success: true })
    }

    if (company_website) return NextResponse.json({ success: true }) // bot honeypot
    const service = getServiceClient()
    const { error } = await service.from('career_applications').insert({
      listing_id:   listing_id ?? null,
      name:         String(name).trim(),
      phone:        String(phone).replace(/\D/g, '').slice(-10),
      email:        email ?? null,
      cover_letter: cover_letter ?? null,
    })

    if (error) return NextResponse.json({ error: 'Failed to submit.' }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}
