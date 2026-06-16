import type { Metadata } from 'next'
import { getPublishedBlogPosts } from '@/lib/queries'
import BlogCard from '@/components/BlogCard'
import LeadForm from '@/components/LeadForm'
import Reveal from '@/components/Reveal'
import { BLOG_CATEGORIES } from '@/types'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Blog — Real Estate Insights & Investment Tips',
  description: 'Expert real estate advice, investment tips, RERA updates, and project news from ANON INDIA.',
}

interface Props {
  searchParams: Promise<{ category?: string }>
}

export default async function BlogPage({ searchParams }: Props) {
  const { category } = await searchParams
  const posts = await getPublishedBlogPosts(24)
  const filtered = category ? posts.filter((p) => p.category === category) : posts

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-brand-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-2">Real Estate Blog</h1>
          <p className="text-gray-300">Investment tips, market trends, and project updates</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24 space-y-5">
              <div>
                <p className="font-semibold text-gray-900 mb-3 text-sm">Categories</p>
                <div className="space-y-1">
                  <a href="/blog"
                    className={`block px-3 py-2 rounded-xl text-sm ${!category ? 'bg-gold-50 text-gold-700 font-medium' : 'text-gray-600 hover:bg-cream'}`}>
                    All Posts ({posts.length})
                  </a>
                  {BLOG_CATEGORIES.map((c) => {
                    const count = posts.filter((p) => p.category === c.value).length
                    if (count === 0) return null
                    return (
                      <a key={c.value} href={`/blog?category=${c.value}`}
                        className={`block px-3 py-2 rounded-xl text-sm ${category === c.value ? 'bg-gold-50 text-gold-700 font-medium' : 'text-gray-600 hover:bg-cream'}`}>
                        {c.label} ({count})
                      </a>
                    )
                  })}
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-700 mb-3">Interested in a property?</p>
                <LeadForm source="blog_sidebar" compact title="" subtitle="" />
              </div>
            </div>
          </aside>

          {/* Posts grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500">
                No posts in this category yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((post, i) => (
                  <Reveal key={post.id} delay={(i % 3) * 90}><BlogCard post={post} /></Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
