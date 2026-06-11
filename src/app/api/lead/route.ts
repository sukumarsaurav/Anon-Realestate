import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  try {
    const service = getServiceClient()
    const body = await req.json()
    const { name, phone, email, city, project_id, project_name, source = 'website', notes } = body

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required.' }, { status: 400 })
    }

    const cleaned = String(phone).replace(/\D/g, '').slice(-10)
    if (cleaned.length !== 10) {
      return NextResponse.json({ error: 'Invalid phone number.' }, { status: 400 })
    }

    // Check for duplicate in last 24h
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { count } = await service
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('phone', cleaned)
      .gte('created_at', cutoff)

    if ((count ?? 0) > 0) {
      // Still return success (don't reveal duplication to user)
      return NextResponse.json({ success: true })
    }

    const note = [project_name && `Interested in: ${project_name}`, notes].filter(Boolean).join('\n') || null

    const { data: lead, error } = await service.from('leads').insert({
      full_name:    String(name).trim(),
      phone:        cleaned,
      email:        email ? String(email).trim() : null,
      city:         city ? String(city).trim() : null,
      source:       'website_form',   // valid lead_source enum value
      utm_source:   String(source),   // granular page attribution (projects_page, project_detail, …)
      utm_medium:   'website',
      stage:        'new_lead',
      project_id:   project_id ?? null,
      created_at:   new Date().toISOString(),
      updated_at:   new Date().toISOString(),
    }).select('id').single()

    if (error) {
      console.error('Lead insert error:', error)
      return NextResponse.json({ error: 'Failed to save lead.' }, { status: 500 })
    }

    // Log the enquiry as the lead's first activity (timeline).
    if (lead?.id && note) {
      await service.from('lead_activities').insert({ lead_id: lead.id, type: 'note', notes: note })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Lead API error:', err)
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}
