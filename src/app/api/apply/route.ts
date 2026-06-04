import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  try {
    const service = getServiceClient()
    const { listing_id, name, phone, email, cover_letter } = await req.json()

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required.' }, { status: 400 })
    }

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
