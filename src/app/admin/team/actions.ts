'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

function parseForm(formData: FormData) {
  return {
    name: String(formData.get('name') ?? '').trim(),
    designation: String(formData.get('designation') ?? '').trim() || null,
    level: String(formData.get('level') ?? '').trim() || null,
    photo_url: String(formData.get('photo_url') ?? '').trim() || null,
    sort_order: Number(formData.get('sort_order') ?? 0),
    is_public: formData.get('is_public') === 'on',
  }
}

export async function createTeamMember(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('team_members').insert(parseForm(formData))
  if (error) throw new Error(error.message)
  revalidateTag('site-settings', 'max')
  revalidatePath('/admin/team')
  revalidatePath('/developers')
  revalidatePath('/')
  redirect('/admin/team')
}

export async function updateTeamMember(id: string, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('team_members').update(parseForm(formData)).eq('id', id)
  if (error) throw new Error(error.message)
  revalidateTag('site-settings', 'max')
  revalidatePath('/admin/team')
  revalidatePath('/developers')
  revalidatePath('/')
  redirect('/admin/team')
}

export async function deleteTeamMember(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('team_members').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidateTag('site-settings', 'max')
  revalidatePath('/admin/team')
  revalidatePath('/developers')
  revalidatePath('/')
}
