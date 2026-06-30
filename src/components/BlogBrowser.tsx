'use client'

import { useMemo } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { BLOG_CATEGORIES } from '@/types'
import type { BlogPost } from '@/types'
import BlogCard from '@/components/BlogCard'
import LeadForm from '@/components/LeadForm'
import Reveal from '@/components/Reveal'

/**
 * Client-side category filtering over the full (statically prerendered) post
 * list. The active category is mirrored to the URL for shareable links, but the
 * page is static HTML — no server round-trip on filter changes.
 */
export default function BlogBrowser({ posts }: { posts: BlogPost[] }) {
  const sp = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const category = sp.get('category') ?? ''

  function selectCategory(value: string) {
    router.replace(value ? `${pathname}?category=${value}` : pathname, { scroll: false })
  }

  const filtered = useMemo(
    () => (category ? posts.filter((p) => p.category === category) : posts),
    [posts, category],
  )

  const tabCls = (active: boolean) =>
    `block w-full text-left px-3 py-2 rounded-xl text-sm ${
      active ? 'bg-gold-50 text-gold-700 font-medium' : 'text-gray-600 hover:bg-white'
    }`

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar */}
      <aside className="lg:w-64 shrink-0">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24 space-y-5">
          <div>
            <p className="font-semibold text-brand-900 mb-3 text-sm">Categories</p>
            <div className="space-y-1">
              <button onClick={() => selectCategory('')} className={tabCls(!category)}>
                All Posts ({posts.length})
              </button>
              {BLOG_CATEGORIES.map((c) => {
                const count = posts.filter((p) => p.category === c.value).length
                if (count === 0) return null
                return (
                  <button key={c.value} onClick={() => selectCategory(c.value)} className={tabCls(category === c.value)}>
                    {c.label} ({count})
                  </button>
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
  )
}
