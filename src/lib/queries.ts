import { unstable_cache } from 'next/cache'
import { supabase } from './supabase'
import type { Project, BlogPost, CareerListing, Testimonial } from '@/types'

// Columns needed by the project detail page + metadata. Avoids select('*').
const PROJECT_DETAIL_COLUMNS =
  'id, name, type, city, locality, status, description, gallery_urls, video_url, brochure_url, ' +
  'rera_number, rera_registration_date, total_units, expected_completion_date, amenities, google_maps_pin'

export async function getFeaturedProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from('projects')
    .select('id, name, type, city, locality, status, description, gallery_urls, brochure_url, rera_number, total_units, expected_completion_date')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(6)
  return (data ?? []) as Project[]
}

// Cached so the dynamic /projects page (it reads searchParams) doesn't re-query
// Supabase on every request. Keyed on the filter args automatically.
export const getAllProjects = unstable_cache(
  async (filters?: { city?: string; type?: string; status?: string }): Promise<Project[]> => {
    let query = supabase
      .from('projects')
      .select('id, name, type, city, locality, status, description, gallery_urls, brochure_url, rera_number, total_units, expected_completion_date')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (filters?.city)   query = query.eq('city', filters.city)
    if (filters?.type)   query = query.eq('type', filters.type)
    if (filters?.status) query = query.eq('status', filters.status)

    const { data } = await query
    return (data ?? []) as Project[]
  },
  ['all-projects'],
  { revalidate: 300, tags: ['projects'] },
)

export async function getProjectBySlug(id: string): Promise<Project | null> {
  const { data } = await supabase
    .from('projects')
    .select(`
      ${PROJECT_DETAIL_COLUMNS},
      plots:plots(id, plot_number, size_sqyd, size_sqft, facing, type, base_price, total_price, status)
    `)
    .eq('id', id)
    .eq('is_active', true)
    .single()
  return data as Project | null
}

// IDs for generateStaticParams — pre-render project detail pages at build time.
export async function getAllProjectIds(): Promise<string[]> {
  const { data } = await supabase
    .from('projects')
    .select('id')
    .eq('is_active', true)
  return (data ?? []).map((r: { id: string }) => r.id)
}

// Slugs for generateStaticParams — pre-render blog detail pages at build time.
export async function getAllBlogSlugs(): Promise<string[]> {
  const { data } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('is_published', true)
  return (data ?? []).map((r: { slug: string }) => r.slug)
}

// Cached so the dynamic /blog page (it reads searchParams) doesn't re-query
// Supabase on every request. Keyed on the limit argument automatically.
export const getPublishedBlogPosts = unstable_cache(
  async (limit = 12): Promise<BlogPost[]> => {
    const { data } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, featured_image_url, category, tags, published_at, author_id')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(limit)
    return (data ?? []) as BlogPost[]
  },
  ['published-blog-posts'],
  { revalidate: 300, tags: ['blog'] },
)

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  // Note: view counting happens client-side via /api/blog-view so that the
  // statically cached page still records a hit on every visit.
  return data as BlogPost | null
}

export async function getActiveCareerListings(): Promise<CareerListing[]> {
  const { data } = await supabase
    .from('career_listings')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  return (data ?? []) as CareerListing[]
}

export async function getActiveTestimonials(): Promise<Testimonial[]> {
  const { data } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
    .limit(8)
  return (data ?? []) as Testimonial[]
}

// The filter dropdown rarely changes — cache for an hour so each /projects
// render doesn't re-scan the table just to build the city list.
export const getProjectCities = unstable_cache(
  async (): Promise<string[]> => {
    const { data } = await supabase
      .from('projects')
      .select('city')
      .eq('is_active', true)
    const cities = [...new Set((data ?? []).map((r: { city: string }) => r.city))]
    return cities.sort()
  },
  ['project-cities'],
  { revalidate: 3600, tags: ['projects'] },
)
