import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  try {
    const service = getServiceClient()
    const { name, phone, project_id, project_name, brochure_url } = await req.json()

    if (!name || !phone || !brochure_url) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    const cleaned = String(phone).replace(/\D/g, '').slice(-10)

    await service.from('leads').insert({
      full_name:  String(name).trim(),
      phone:      cleaned,
      source:     'brochure_download',
      stage:      'new_lead',
      notes:      `Brochure download: ${project_name ?? 'Unknown project'}`,
      project_id: project_id ?? null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, brochure_url })
  } catch (err) {
    console.error('Brochure API error:', err)
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}
