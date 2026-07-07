'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

function parseForm(formData: FormData) {
  return {
    title: String(formData.get('title') ?? '').trim(),
    department: String(formData.get('department') ?? '').trim() || null,
    employment_type: String(formData.get('employment_type') ?? 'full_time'),
    location: String(formData.get('location') ?? '').trim() || null,
    description: String(formData.get('description') ?? '').trim(),
    requirements: String(formData.get('requirements') ?? '').trim() || null,
    is_active: formData.get('is_active') === 'on',
  }
}

export async function createCareerListing(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('career_listings').insert(parseForm(formData))
  if (error) throw new Error(error.message)
  revalidateTag('careers', 'max')
  revalidatePath('/admin/careers')
  revalidatePath('/careers')
  redirect('/admin/careers')
}

export async function updateCareerListing(id: string, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('career_listings').update(parseForm(formData)).eq('id', id)
  if (error) throw new Error(error.message)
  revalidateTag('careers', 'max')
  revalidatePath('/admin/careers')
  revalidatePath('/careers')
  redirect('/admin/careers')
}

export async function deleteCareerListing(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('career_listings').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidateTag('careers', 'max')
  revalidatePath('/admin/careers')
  revalidatePath('/careers')
}
