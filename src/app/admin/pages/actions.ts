'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

function strOrNull(value: FormDataEntryValue | null) {
  const s = String(value ?? '').trim()
  return s === '' ? null : s
}

export async function updatePage(slug: string, formData: FormData) {
  let blocks: unknown
  try {
    blocks = JSON.parse(String(formData.get('blocks') ?? '{}'))
  } catch {
    throw new Error('Blocks must be valid JSON.')
  }

  const supabase = await createClient()
  const { error } = await supabase.from('pages').upsert({
    slug,
    hero_eyebrow: strOrNull(formData.get('hero_eyebrow')),
    hero_title: strOrNull(formData.get('hero_title')),
    hero_subtitle: strOrNull(formData.get('hero_subtitle')),
    hero_image_url: strOrNull(formData.get('hero_image_url')),
    blocks,
    meta_title: strOrNull(formData.get('meta_title')),
    meta_description: strOrNull(formData.get('meta_description')),
    updated_at: new Date().toISOString(),
  }, { onConflict: 'slug' })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/pages')
  revalidatePath(`/${slug}`)
}
