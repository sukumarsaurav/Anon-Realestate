'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

function parseJsonArray(formData: FormData, key: string) {
  try {
    const parsed = JSON.parse(String(formData.get(key) ?? '[]'))
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function numOrNull(value: FormDataEntryValue | null) {
  const s = String(value ?? '').trim()
  return s === '' ? null : Number(s)
}

function strOrNull(value: FormDataEntryValue | null) {
  const s = String(value ?? '').trim()
  return s === '' ? null : s
}

function parseForm(formData: FormData) {
  return {
    name: String(formData.get('name') ?? '').trim(),
    type: String(formData.get('type') ?? ''),
    city: String(formData.get('city') ?? '').trim(),
    locality: strOrNull(formData.get('locality')),
    address: strOrNull(formData.get('address')),
    status: String(formData.get('status') ?? 'pre_launch'),
    description: strOrNull(formData.get('description')),
    google_maps_pin: strOrNull(formData.get('google_maps_pin')),
    rera_number: strOrNull(formData.get('rera_number')),
    rera_registration_date: strOrNull(formData.get('rera_registration_date')),
    rera_expiry_date: strOrNull(formData.get('rera_expiry_date')),
    rera_authority_name: strOrNull(formData.get('rera_authority_name')),
    rera_website_url: strOrNull(formData.get('rera_website_url')),
    total_units: numOrNull(formData.get('total_units')),
    launch_date: strOrNull(formData.get('launch_date')),
    expected_completion_date: strOrNull(formData.get('expected_completion_date')),
    developer_id: strOrNull(formData.get('developer_id')),
    starting_price: numOrNull(formData.get('starting_price')),
    price_per_sqft: numOrNull(formData.get('price_per_sqft')),
    bhk_config: strOrNull(formData.get('bhk_config')),
    website_category: strOrNull(formData.get('website_category')),
    is_featured: formData.get('is_featured') === 'on',
    is_active: formData.get('is_active') === 'on',
    developer_about: strOrNull(formData.get('developer_about')),
    amenities: parseJsonArray(formData, 'amenities_json'),
    usp: parseJsonArray(formData, 'usp_json'),
    connectivity: parseJsonArray(formData, 'connectivity_json'),
    faqs: parseJsonArray(formData, 'faqs_json'),
    hero_image_url: strOrNull(formData.get('hero_image_url')),
    gallery_urls: parseJsonArray(formData, 'gallery_urls_json'),
    video_url: strOrNull(formData.get('video_url')),
    virtual_tour_url: strOrNull(formData.get('virtual_tour_url')),
    layout_image_url: strOrNull(formData.get('layout_image_url')),
    brochure_url: strOrNull(formData.get('brochure_url')),
    meta_title: strOrNull(formData.get('meta_title')),
    meta_description: strOrNull(formData.get('meta_description')),
    canonical_url: strOrNull(formData.get('canonical_url')),
    og_image_url: strOrNull(formData.get('og_image_url')),
    noindex: formData.get('noindex') === 'on',
    updated_at: new Date().toISOString(),
  }
}

export async function createProject(formData: FormData) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('projects').insert(parseForm(formData)).select('id').single()
  if (error) throw new Error(error.message)
  revalidateTag('projects', 'max')
  revalidatePath('/admin/projects')
  revalidatePath('/projects')
  revalidatePath('/gallery')
  revalidatePath('/')
  redirect(`/admin/projects/${data.id}`)
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('projects').update(parseForm(formData)).eq('id', id)
  if (error) throw new Error(error.message)
  revalidateTag('projects', 'max')
  revalidatePath('/admin/projects')
  revalidatePath(`/admin/projects/${id}`)
  revalidatePath('/projects')
  revalidatePath(`/projects/${id}`)
  revalidatePath('/gallery')
  revalidatePath('/')
}

export async function deleteProject(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidateTag('projects', 'max')
  revalidatePath('/admin/projects')
  revalidatePath('/projects')
  revalidatePath(`/projects/${id}`)
  revalidatePath('/gallery')
  revalidatePath('/')
}

export async function createPlot(projectId: string, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('plots').insert({
    project_id: projectId,
    plot_number: String(formData.get('plot_number') ?? '').trim(),
    size_sqyd: numOrNull(formData.get('size_sqyd')),
    size_sqft: numOrNull(formData.get('size_sqft')),
    facing: strOrNull(formData.get('facing')),
    base_price: numOrNull(formData.get('base_price')) ?? 0,
    total_price: numOrNull(formData.get('total_price')),
    status: String(formData.get('status') ?? 'available'),
  })
  if (error) throw new Error(error.message)
  revalidateTag('projects', 'max')
  revalidatePath(`/admin/projects/${projectId}`)
  revalidatePath(`/projects/${projectId}`)
  revalidatePath('/projects')
  revalidatePath('/')
}

export async function updatePlotStatus(projectId: string, plotId: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('plots').update({ status }).eq('id', plotId)
  if (error) throw new Error(error.message)
  revalidateTag('projects', 'max')
  revalidatePath(`/admin/projects/${projectId}`)
  revalidatePath(`/projects/${projectId}`)
  revalidatePath('/projects')
  revalidatePath('/')
}

export async function deletePlot(projectId: string, plotId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('plots').delete().eq('id', plotId)
  if (error) throw new Error(error.message)
  revalidateTag('projects', 'max')
  revalidatePath(`/admin/projects/${projectId}`)
  revalidatePath(`/projects/${projectId}`)
  revalidatePath('/projects')
  revalidatePath('/')
}
