import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getPublishedBlogPosts } from '@/lib/queries'
import PageHero from '@/components/PageHero'
import BlogBrowser from '@/components/BlogBrowser'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Blog — Real Estate Insights & Investment Tips',
  description: 'Expert real estate advice, investment tips, RERA updates, and project news from ANON INDIA.',
}

export default async function BlogPage() {
  // Fetch all posts once (cached); category filtering happens client-side so
  // this page stays static HTML instead of re-rendering per request.
  const posts = await getPublishedBlogPosts(24)

  return (
    <div className="min-h-screen bg-cream">
      <PageHero
        eyebrow="Insights and guides"
        title="Real Estate Blog"
        subtitle="Investment tips, market trends, and project updates."
        image="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1920&q=80&auto=format&fit=crop"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Suspense fallback={null}>
          <BlogBrowser posts={posts} />
        </Suspense>
      </div>
    </div>
  )
}
