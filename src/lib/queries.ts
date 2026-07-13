import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { supabase } from './supabase'
import { projectImage } from './images'
import type { Project, BlogPost, CareerListing, Testimonial, Developer, TeamMember, CityStat } from '@/types'

// Columns needed by the project detail page + metadata. Avoids select('*').
const PROJECT_DETAIL_COLUMNS =
  'id, name, type, city, locality, status, description, gallery_urls, video_url, brochure_url, ' +
  'rera_number, rera_registration_date, total_units, expected_completion_date, amenities, google_maps_pin, ' +
  'layout_image_url, starting_price, price_per_sqft, bhk_config, website_category, hero_image_url, ' +
  'developer_about, usp, connectivity, faqs, ' +
  'developer:developers(name)'

// Compact columns for project cards (listing + carousels).
const PROJECT_CARD_COLUMNS =
  'id, name, type, city, locality, status, gallery_urls, hero_image_url, starting_price, price_per_sqft, ' +
  'bhk_config, website_category, is_featured, rera_number, expected_completion_date, developer:developers(name)'

export const getFeaturedProjects = unstable_cache(
  async (): Promise<Project[]> => {
    const { data } = await supabase
      .from('projects')
      .select(PROJECT_CARD_COLUMNS)
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(8)
    return (data ?? []) as unknown as Project[]
  },
  ['featured-projects'],
  { revalidate: 300, tags: ['projects'] }
)

export const getDevelopers = unstable_cache(
  async (): Promise<Developer[]> => {
    const { data } = await supabase
      .from('developers')
      .select('id, name, logo_url, website_url, sort_order')
      .eq('is_active', true)
      .order('sort_order')
    return (data ?? []) as Developer[]
  },
  ['developers-list'],
  { revalidate: 3600, tags: ['projects'] }
)

export const getTeamMembers = unstable_cache(
  async (): Promise<TeamMember[]> => {
    const { data } = await supabase
      .from('team_members')
      .select('id, name, designation, level, photo_url, sort_order')
      .eq('is_public', true)
      .order('sort_order')
    return (data ?? []) as TeamMember[]
  },
  ['team-members-list'],
  { revalidate: 3600, tags: ['site-settings'] }
)

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

// City cards ("Explore by City") with project counts + a representative image.
export const getCitiesWithCounts = unstable_cache(
  async (): Promise<CityStat[]> => {
    const [{ data: projects }, { data: settings }] = await Promise.all([
      supabase
        .from('projects')
        .select('id, city, hero_image_url, gallery_urls')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false }),
      supabase
        .from('site_settings')
        .select('city_images')
        .eq('id', 1)
        .maybeSingle()
    ])

    // Build city images map from settings
    const cityImagesMap = new Map<string, string>()
    if (settings?.city_images && Array.isArray(settings.city_images)) {
      for (const item of settings.city_images) {
        if (item.city && item.image_url) {
          cityImagesMap.set(item.city.trim().toLowerCase(), item.image_url)
        }
      }
    }

    const counts = new Map<string, number>()
    const images = new Map<string, string>()
    for (const r of (projects ?? []) as { id: string; city: string | null; hero_image_url?: string | null; gallery_urls?: string[] | null }[]) {
      if (!r.city) continue
      const cityKey = r.city.trim()
      const cityLower = cityKey.toLowerCase()
      counts.set(cityKey, (counts.get(cityKey) ?? 0) + 1)
      
      if (!images.has(cityKey)) {
        // Use custom image from settings if configured, otherwise fallback to project hero image
        const customImg = cityImagesMap.get(cityLower)
        images.set(cityKey, customImg || projectImage(r, 600))
      }
    }
    return [...counts.entries()]
      .map(([city, count]) => ({ city, count, image: images.get(city)! }))
      .sort((a, b) => b.count - a.count)
  },
  ['cities-with-counts'],
  { revalidate: 3600, tags: ['projects', 'site-settings'] },
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

// Wrapped in React cache() so generateMetadata + the page body share a single
// query per render instead of hitting Supabase twice for the same row.
export const getProjectBySlug = cache(async (id: string): Promise<Project | null> => {
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
})

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

// Wrapped in React cache() so generateMetadata + the page body share a single
// query per render instead of hitting Supabase twice for the same row.
export const getBlogPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  // Note: view counting happens client-side via /api/blog-view so that the
  // statically cached page still records a hit on every visit.
  return data as BlogPost | null
})

export const getActiveCareerListings = unstable_cache(
  async (): Promise<CareerListing[]> => {
    const { data } = await supabase
      .from('career_listings')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    return (data ?? []) as CareerListing[]
  },
  ['active-career-listings'],
  { revalidate: 300, tags: ['careers'] }
)

export const getActiveTestimonials = unstable_cache(
  async (): Promise<Testimonial[]> => {
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .limit(12)
    return (data ?? []) as Testimonial[]
  },
  ['testimonials-list'],
  { revalidate: 300, tags: ['testimonials'] }
)

export interface SiteSettings {
  site_name: string
  default_title_template: string
  default_meta_description: string | null
  default_og_image_url: string | null
  ga_measurement_id: string | null
  meta_pixel_id: string | null
  whatsapp_number: string | null
  contact_email: string | null
  contact_phone: string | null
  org_schema: Record<string, unknown>
  address: string | null
  facebook_url: string | null
  instagram_url: string | null
  twitter_url: string | null
  youtube_url: string | null
  linkedin_url: string | null
  rera_registrations: string[] | null
  instagram_reels: { image_url: string; caption: string; link?: string }[] | null
  why_choose_us: { icon: string; title: string; description: string }[] | null
  lead_capture_bullets: string[] | null
  team_levels: string[] | null
  city_images: { city: string; image_url: string }[] | null
  theme_name: string | null
}

// Global site settings (singleton row) — drives layout.tsx metadata/JSON-LD
// so it's editable from /admin/settings instead of hardcoded.
export const getSiteSettings = unstable_cache(
  async (): Promise<SiteSettings | null> => {
    const { data } = await supabase.from('site_settings').select('*').eq('id', 1).single()
    return data as SiteSettings | null
  },
  ['site-settings'],
  { revalidate: 3600, tags: ['site-settings'] },
)

export interface PageContent {
  slug: string
  hero_eyebrow: string | null
  hero_title: string | null
  hero_subtitle: string | null
  hero_image_url: string | null
  blocks: Record<string, unknown>
  meta_title: string | null
  meta_description: string | null
}

// CMS-editable content for static marketing pages (about, vision, csr, …).
// Wrapped in React cache() since a page's body + generateMetadata both call
// this once per render.
export const getPageContent = cache(async (slug: string): Promise<PageContent | null> => {
  const { data } = await supabase.from('pages').select('*').eq('slug', slug).maybeSingle()
  return data as PageContent | null
})

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
