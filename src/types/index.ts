export interface Project {
  id: string
  name: string
  type: string
  city: string
  locality: string | null
  address: string | null
  status: string
  description: string | null
  gallery_urls: string[]
  brochure_url: string | null
  rera_number: string | null
  rera_registration_date: string | null
  rera_expiry_date: string | null
  total_units: number | null
  expected_completion_date: string | null
  launch_date: string | null
  amenities: string[]
  google_maps_pin: string | null
  video_url: string | null
  virtual_tour_url: string | null
  layout_image_url: string | null
  // Website-facing fields
  developer_id: string | null
  starting_price: number | null
  price_per_sqft: number | null
  bhk_config: string | null
  website_category: string | null
  is_featured: boolean
  hero_image_url: string | null
  // Optional editorial content (see migration 20260616000000). Empty/absent → page derives content.
  developer_about?: string | null
  usp?: string[] | null
  connectivity?: { place: string; distance: string }[] | null
  faqs?: { q: string; a: string }[] | null
  developer?: { name: string } | null
  plots?: PlotSummary[]
}

export interface Developer {
  id: string
  name: string
  logo_url: string | null
  website_url: string | null
  sort_order: number
}

export interface TeamMember {
  id: string
  name: string
  designation: string | null
  level: string | null
  photo_url: string | null
  sort_order: number
}

export interface CityStat {
  city: string
  count: number
  image: string
}

export interface PlotSummary {
  id: string
  plot_number: string
  size_sqyd: number
  size_sqft: number
  facing: string | null
  type: string | null
  base_price: number
  total_price: number
  status: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  featured_image_url: string | null
  category: string
  tags: string[]
  meta_title: string | null
  meta_description: string | null
  is_published: boolean
  published_at: string | null
  author_id: string | null
  view_count: number
  created_at: string
  updated_at: string
}

export interface CareerListing {
  id: string
  title: string
  department: string
  employment_type: string
  location: string
  description: string
  requirements: string | null
  is_active: boolean
  created_at: string
}

export interface Testimonial {
  id: string
  client_name: string
  project: string | null
  content: string
  rating: number
  photo_url: string | null
  is_active: boolean
  sort_order: number
}

export const PROJECT_STATUS_LABELS: Record<string, string> = {
  pre_launch:        'Pre-Launch',
  under_construction: 'Under Construction',
  ready_to_move:     'Ready to Move',
  sold_out:          'Sold Out',
}

export const PROJECT_TYPE_LABELS: Record<string, string> = {
  plotted_development: 'Plotted Development',
  apartment:           'Apartment',
  villa:               'Villa',
  commercial:          'Commercial',
}

export const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  full_time:  'Full Time',
  part_time:  'Part Time',
  contract:   'Contract',
  internship: 'Internship',
}

export const BLOG_CATEGORIES = [
  { value: 'investment',   label: 'Investment Tips' },
  { value: 'market',       label: 'Market Trends' },
  { value: 'project',      label: 'Project Updates' },
  { value: 'legal',        label: 'Legal & RERA' },
  { value: 'lifestyle',    label: 'Lifestyle' },
  { value: 'general',      label: 'General' },
]
