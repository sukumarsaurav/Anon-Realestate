'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

function parseForm(formData: FormData) {
  return {
    client_name: String(formData.get('client_name') ?? '').trim(),
    project: String(formData.get('project') ?? '').trim() || null,
    content: String(formData.get('content') ?? '').trim(),
    rating: Number(formData.get('rating') ?? 5),
    photo_url: String(formData.get('photo_url') ?? '').trim() || null,
    sort_order: Number(formData.get('sort_order') ?? 0),
    is_active: formData.get('is_active') === 'on',
  }
}

export async function createTestimonial(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('testimonials').insert(parseForm(formData))
  if (error) throw new Error(error.message)
  revalidateTag('testimonials', 'max')
  revalidatePath('/admin/testimonials')
  revalidatePath('/testimonials')
  revalidatePath('/')
  redirect('/admin/testimonials')
}

export async function updateTestimonial(id: string, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('testimonials').update(parseForm(formData)).eq('id', id)
  if (error) throw new Error(error.message)
  revalidateTag('testimonials', 'max')
  revalidatePath('/admin/testimonials')
  revalidatePath('/testimonials')
  revalidatePath('/')
  redirect('/admin/testimonials')
}

export async function deleteTestimonial(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('testimonials').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidateTag('testimonials', 'max')
  revalidatePath('/admin/testimonials')
  revalidatePath('/testimonials')
  revalidatePath('/')
}

export async function toggleTestimonialActive(id: string, isActive: boolean) {
  const supabase = await createClient()
  const { error } = await supabase.from('testimonials').update({ is_active: isActive }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidateTag('testimonials', 'max')
  revalidatePath('/admin/testimonials')
  revalidatePath('/testimonials')
  revalidatePath('/')
}
