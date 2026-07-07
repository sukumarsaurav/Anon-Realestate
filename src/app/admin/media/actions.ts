'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function uploadMedia(formData: FormData) {
  const file = formData.get('file') as File | null
  if (!file || file.size === 0) throw new Error('No file selected.')

  const supabase = await createClient()
  const ext = file.name.split('.').pop()
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { error } = await supabase.storage.from('media').upload(path, file, {
    cacheControl: '31536000',
    upsert: false,
  })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/media')
}

export async function deleteMedia(path: string) {
  const supabase = await createClient()
  const { error } = await supabase.storage.from('media').remove([path])
  if (error) throw new Error(error.message)
  revalidatePath('/admin/media')
}
