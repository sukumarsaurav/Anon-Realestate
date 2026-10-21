import { NextRequest, NextResponse } from 'next/server'
import { crmCareersEnabled, crmPost } from '@/lib/crm'

/**
 * A one-time slot for the applicant's CV. The CRM checks type (PDF / Word) and size (5 MB) and returns
 * a signed URL; the browser PUTs the file straight to the CRM's private storage.
 */
export async function POST(req: NextRequest) {
  if (!crmCareersEnabled()) return NextResponse.json({ error: 'CV upload is not available.' }, { status: 404 })
  let body: { filename?: string; contentType?: string; size?: number }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }) }
  const res = await crmPost('/api/webhooks/careers/upload', { filename: body.filename, contentType: body.contentType, size: body.size })
  const out = await res.json().catch(() => ({}))
  if (!res.ok) return NextResponse.json({ error: out.error ?? 'Upload failed.' }, { status: res.status >= 500 ? 502 : res.status })
  return NextResponse.json({ signedUrl: out.signedUrl, fileUrl: out.fileUrl })
}
