import { unstable_cache } from 'next/cache'
import { supabase } from './supabase'
import type { Project, BlogPost, CareerListing, Testimonial, Developer, TeamMember, CityStat } from '@/types'

// Columns needed by the project detail page + metadata. Avoids select('*').
const PROJECT_DETAIL_COLUMNS =
  'id, name, type, city, locality, status, description, gallery_urls, video_url, brochure_url, ' +
  'rera_number, rera_registration_date, total_units, expected_completion_date, amenities, google_maps_pin, ' +
  'layout_image_url, starting_price, price_per_sqft, bhk_config, website_category, hero_image_url, ' +
  'developer:developers(name)'

// Compact columns for project cards (listing + carousels).
const PROJECT_CARD_COLUMNS =
  'id, name, type, city, locality, status, gallery_urls, hero_image_url, starting_price, price_per_sqft, ' +
  'bhk_config, website_category, is_featured, rera_number, expected_completion_date, developer:developers(name)'

export async function getFeaturedProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from('projects')
    .select(PROJECT_CARD_COLUMNS)
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(8)
  return (data ?? []) as unknown as Project[]
}

export async function getDevelopers(): Promise<Developer[]> {
  const { data } = await supabase
    .from('developers')
    .select('id, name, logo_url, website_url, sort_order')
    .eq('is_active', true)
    .order('sort_order')
  return (data ?? []) as Developer[]
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const { data } = await supabase
    .from('team_members')
    .select('id, name, designation, level, photo_url, sort_order')
    .eq('is_public', true)
    .order('sort_order')
  return (data ?? []) as TeamMember[]
}

// Compact project list for the Projects mega-menu (grouped by city client-side).
export const getProjectsForMenu = unstable_cache(
  async (): Promise<Project[]> => {
    const { data } = await supabase
      .from('projects')
      .select('id, name, city, locality, status, gallery_urls, hero_image_url, starting_price, website_category, type')
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(40)
    return (data ?? []) as unknown as Project[]
  },
  ['projects-for-menu'],
  { revalidate: 300, tags: ['projects'] },
)

// City cards ("Explore by City") with project counts.
export const getCitiesWithCounts = unstable_cache(
  async (): Promise<CityStat[]> => {
    const { data } = await supabase.from('projects').select('city').eq('is_active', true)
    const counts = new Map<string, number>()
    for (const r of (data ?? []) as { city: string | null }[]) {
      if (r.city) counts.set(r.city, (counts.get(r.city) ?? 0) + 1)
    }
    return [...counts.entries()].map(([city, count]) => ({ city, count })).sort((a, b) => b.count - a.count)
  },
  ['cities-with-counts'],
  { revalidate: 3600, tags: ['projects'] },
)

// Cached so the dynamic /projects page (it reads searchParams) doesn't re-query
// Supabase on every request. Keyed on the filter args automatically.
export const getAllProjects = unstable_cache(
  async (filters?: {
    city?: string
    type?: string
    status?: string
    category?: string
    budget_max?: string
  }): Promise<Project[]> => {
    let query = supabase
      .from('projects')
      .select(PROJECT_CARD_COLUMNS)
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })

    if (filters?.city)     query = query.eq('city', filters.city)
    if (filters?.type)     query = query.eq('type', filters.type)
    if (filters?.status)   query = query.eq('status', filters.status)
    if (filters?.category) query = query.eq('website_category', filters.category)
    if (filters?.budget_max) {
      const max = Number(filters.budget_max)
      if (Number.isFinite(max)) query = query.lte('starting_price', max)
    }

    const { data } = await query
    return (data ?? []) as unknown as Project[]
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
