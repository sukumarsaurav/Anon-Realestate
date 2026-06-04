import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  try {
    const service = getServiceClient()
    const body = await req.json()
    const { name, phone, project_id, project_name, source = 'website', notes } = body

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

    const { error } = await service.from('leads').insert({
      full_name:    String(name).trim(),
      phone:        cleaned,
      source:       source,
      stage:        'new_lead',
      notes:        [project_name && `Interested in: ${project_name}`, notes].filter(Boolean).join('\n') || null,
      project_id:   project_id ?? null,
      created_at:   new Date().toISOString(),
      updated_at:   new Date().toISOString(),
    })

    if (error) {
      console.error('Lead insert error:', error)
      return NextResponse.json({ error: 'Failed to save lead.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Lead API error:', err)
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}
