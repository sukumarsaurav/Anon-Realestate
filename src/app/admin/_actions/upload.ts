'use server'

import { createClient } from '@/lib/supabase/server'

export type UploadResult = { url: string; error?: undefined } | { url?: undefined; error: string }

/**
 * Upload a single file to the specified Supabase Storage bucket.
 *
 * Returns `{ url }` on success or `{ error }` on failure. It deliberately does
 * not throw: Next.js replaces the message of any error thrown from a Server
 * Action with a generic "omitted in production builds" text, which hid the
 * real cause (an RLS denial) from admins.
 *
 * @param bucket  The storage bucket name (e.g. 'projects', 'team', 'blog').
 * @param formData  FormData must contain a field named "file".
 */
export async function uploadToStorage(bucket: string, formData: FormData): Promise<UploadResult> {
  const file = formData.get('file') as File | null
  if (!file || file.size === 0) return { error: 'No file provided.' }

  const supabase = await createClient()
  const ext = file.name.includes('.') ? file.name.split('.').pop()!.toLowerCase() : 'bin'
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '31536000',
    upsert: false,
  })
  if (error) return { error: `Upload failed: ${error.message}` }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return { url: data.publicUrl }
}
