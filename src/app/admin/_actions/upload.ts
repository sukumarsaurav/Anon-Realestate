'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Upload a single file to the specified Supabase Storage bucket.
 * Returns the public URL on success, or throws an Error.
 *
 * @param bucket  The storage bucket name (e.g. 'projects', 'team', 'blog').
 * @param formData  FormData must contain a field named "file".
 */
export async function uploadToStorage(bucket: string, formData: FormData): Promise<string> {
  const file = formData.get('file') as File | null
  if (!file || file.size === 0) throw new Error('No file provided.')

  const supabase = await createClient()
  const ext = file.name.split('.').pop() ?? 'bin'
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '31536000',
    upsert: false,
  })
  if (error) throw new Error(`Upload failed: ${error.message}`)

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}
