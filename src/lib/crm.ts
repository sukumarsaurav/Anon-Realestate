import type { CareerListing } from '@/types'

/**
 * The CRM is where job openings and applications live. When CRM_BASE_URL and CRM_CAREERS_SECRET are
 * set, the careers page reads openings from the CRM and applications are forwarded to it; without
 * them the site keeps using its own database (the previous behaviour).
 */
const BASE = process.env.CRM_BASE_URL?.replace(/\/$/, '')
const SECRET = process.env.CRM_CAREERS_SECRET

export function crmCareersEnabled(): boolean {
  return !!BASE && !!SECRET
}

export async function crmPost(path: string, body: unknown): Promise<Response> {
  return fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-webhook-secret': SECRET ?? '' },
    body: JSON.stringify(body),
    cache: 'no-store',
  })
}

/** Open positions from the CRM, or null when it can't be reached (the caller falls back). */
export async function crmListings(): Promise<CareerListing[] | null> {
  if (!crmCareersEnabled()) return null
  try {
    const res = await fetch(`${BASE}/api/public/careers`, { next: { revalidate: 300, tags: ['careers'] } })
    if (!res.ok) return null
    const json = (await res.json()) as { listings?: CareerListing[] }
    return json.listings ?? []
  } catch {
    return null
  }
}
