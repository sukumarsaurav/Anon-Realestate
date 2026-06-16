import type { MetadataRoute } from 'next'
import { getAllProjectIds, getAllBlogSlugs } from '@/lib/queries'

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://anonindia.com'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    '', '/projects', '/blog', '/about', '/contact', '/careers', '/gallery',
    '/developers', '/testimonials', '/csr', '/events', '/awards', '/vision',
    '/privacy-policy', '/terms',
  ]

  const [projectIds, blogSlugs] = await Promise.all([
    getAllProjectIds().catch(() => [] as string[]),
    getAllBlogSlugs().catch(() => [] as string[]),
  ])

  const now = new Date()
  const entries: MetadataRoute.Sitemap = [
    ...staticPaths.map((p) => ({ url: `${SITE}${p}`, lastModified: now, changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.7 })),
    ...projectIds.map((id) => ({ url: `${SITE}/projects/${id}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 })),
    ...blogSlugs.map((slug) => ({ url: `${SITE}/blog/${slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 })),
  ]
  return entries
}
