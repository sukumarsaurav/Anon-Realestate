'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createRedirect(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('redirects').insert({
    from_path: String(formData.get('from_path') ?? '').trim(),
    to_path: String(formData.get('to_path') ?? '').trim(),
    status_code: Number(formData.get('status_code') ?? 301),
    is_active: true,
  })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/redirects')
}

export async function toggleRedirectActive(id: string, isActive: boolean) {
  const supabase = await createClient()
  const { error } = await supabase.from('redirects').update({ is_active: isActive }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/redirects')
}

export async function deleteRedirect(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('redirects').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/redirects')
}
