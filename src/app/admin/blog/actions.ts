'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

function parseForm(formData: FormData) {
  const isPublished = formData.get('is_published') === 'on'
  return {
    title: String(formData.get('title') ?? '').trim(),
    slug: String(formData.get('slug') ?? '').trim(),
    excerpt: String(formData.get('excerpt') ?? '').trim() || null,
    content: String(formData.get('content') ?? ''),
    featured_image_url: String(formData.get('featured_image_url') ?? '').trim() || null,
    category: String(formData.get('category') ?? 'general'),
    tags: String(formData.get('tags') ?? '').split(',').map((t) => t.trim()).filter(Boolean),
    meta_title: String(formData.get('meta_title') ?? '').trim() || null,
    meta_description: String(formData.get('meta_description') ?? '').trim() || null,
    canonical_url: String(formData.get('canonical_url') ?? '').trim() || null,
    og_image_url: String(formData.get('og_image_url') ?? '').trim() || null,
    noindex: formData.get('noindex') === 'on',
    is_published: isPublished,
    published_at: isPublished ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  }
}

export async function createBlogPost(formData: FormData) {
  const supabase = await createClient()
  const parsed = parseForm(formData)
  const { error } = await supabase.from('blog_posts').insert(parsed)
  if (error) throw new Error(error.message)
  revalidateTag('blog', 'max')
  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  if (parsed.slug) {
    revalidatePath(`/blog/${parsed.slug}`)
  }
  revalidatePath('/')
  redirect('/admin/blog')
}

export async function updateBlogPost(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: existing } = await supabase.from('blog_posts').select('published_at, slug').eq('id', id).single()
  const parsed = parseForm(formData)
  if (existing?.published_at && parsed.is_published) parsed.published_at = existing.published_at

  const { error } = await supabase.from('blog_posts').update(parsed).eq('id', id)
  if (error) throw new Error(error.message)
  revalidateTag('blog', 'max')
  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  if (parsed.slug) {
    revalidatePath(`/blog/${parsed.slug}`)
  }
  if (existing?.slug && existing.slug !== parsed.slug) {
    revalidatePath(`/blog/${existing.slug}`)
  }
  revalidatePath('/')
  redirect('/admin/blog')
}

export async function deleteBlogPost(id: string) {
  const supabase = await createClient()
  const { data: existing } = await supabase.from('blog_posts').select('slug').eq('id', id).single()
  const { error } = await supabase.from('blog_posts').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidateTag('blog', 'max')
  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  if (existing?.slug) {
    revalidatePath(`/blog/${existing.slug}`)
  }
  revalidatePath('/')
}
