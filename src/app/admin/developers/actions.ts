'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

function parseForm(formData: FormData) {
  return {
    name: String(formData.get('name') ?? '').trim(),
    logo_url: String(formData.get('logo_url') ?? '').trim() || null,
    website_url: String(formData.get('website_url') ?? '').trim() || null,
    sort_order: Number(formData.get('sort_order') ?? 0),
    is_active: formData.get('is_active') === 'on',
  }
}

export async function createDeveloper(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('developers').insert(parseForm(formData))
  if (error) throw new Error(error.message)
  revalidateTag('projects', 'max')
  revalidatePath('/admin/developers')
  revalidatePath('/developers')
  revalidatePath('/')
  redirect('/admin/developers')
}

export async function updateDeveloper(id: string, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('developers').update(parseForm(formData)).eq('id', id)
  if (error) throw new Error(error.message)
  revalidateTag('projects', 'max')
  revalidatePath('/admin/developers')
  revalidatePath('/developers')
  revalidatePath('/')
  redirect('/admin/developers')
}

export async function deleteDeveloper(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('developers').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidateTag('projects', 'max')
  revalidatePath('/admin/developers')
  revalidatePath('/developers')
  revalidatePath('/')
}
