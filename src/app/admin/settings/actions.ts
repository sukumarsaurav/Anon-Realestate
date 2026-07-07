'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { THEME_PRESETS } from '@/lib/themes'

function strOrNull(value: FormDataEntryValue | null) {
  const s = String(value ?? '').trim()
  return s === '' ? null : s
}

function parseJsonArray(formData: FormData, key: string) {
  try {
    const parsed = JSON.parse(String(formData.get(key) ?? '[]'))
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export async function updateSiteSettings(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('site_settings').update({
    site_name: String(formData.get('site_name') ?? '').trim(),
    default_title_template: String(formData.get('default_title_template') ?? '').trim(),
    default_meta_description: strOrNull(formData.get('default_meta_description')),
    default_og_image_url: strOrNull(formData.get('default_og_image_url')),
    ga_measurement_id: strOrNull(formData.get('ga_measurement_id')),
    meta_pixel_id: strOrNull(formData.get('meta_pixel_id')),
    whatsapp_number: strOrNull(formData.get('whatsapp_number')),
    contact_email: strOrNull(formData.get('contact_email')),
    contact_phone: strOrNull(formData.get('contact_phone')),
    address: strOrNull(formData.get('address')),
    facebook_url: strOrNull(formData.get('facebook_url')),
    instagram_url: strOrNull(formData.get('instagram_url')),
    twitter_url: strOrNull(formData.get('twitter_url')),
    youtube_url: strOrNull(formData.get('youtube_url')),
    linkedin_url: strOrNull(formData.get('linkedin_url')),
    rera_registrations: parseJsonArray(formData, 'rera_registrations_json'),
    instagram_reels: parseJsonArray(formData, 'instagram_reels_json'),
    why_choose_us: parseJsonArray(formData, 'why_choose_us_json'),
    lead_capture_bullets: parseJsonArray(formData, 'lead_capture_bullets_json'),
    team_levels: parseJsonArray(formData, 'team_levels_json'),
    city_images: parseJsonArray(formData, 'city_images_json'),
    updated_at: new Date().toISOString(),
  }).eq('id', 1)
  if (error) throw new Error(error.message)
  revalidateTag('site-settings', 'max')
  revalidatePath('/admin/settings')
  revalidatePath('/developers')
  revalidatePath('/')
}

export async function updateSiteTheme(formData: FormData) {
  const themeName = String(formData.get('theme_name') ?? '')
  if (!THEME_PRESETS.some((t) => t.id === themeName)) {
    throw new Error('Unknown theme')
  }
  const supabase = await createClient()
  const { error } = await supabase.from('site_settings').update({
    theme_name: themeName,
    updated_at: new Date().toISOString(),
  }).eq('id', 1)
  if (error) throw new Error(error.message)
  revalidateTag('site-settings', 'max')
  revalidatePath('/admin/settings')
  revalidatePath('/', 'layout')
}
