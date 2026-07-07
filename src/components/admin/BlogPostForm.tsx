'use client'

import { useState } from 'react'
import Link from 'next/link'
import SeoFields from './SeoFields'
import ImageUploadField from './ImageUploadField'
import { BLOG_CATEGORIES } from '@/types'

type BlogPost = {
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
  canonical_url: string | null
  og_image_url: string | null
  noindex: boolean
  is_published: boolean
}

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '')
}

const TABS = ['Content', 'Media', 'SEO', 'Publish'] as const

export default function BlogPostForm({
  post,
  action,
}: {
  post?: BlogPost
  action: (formData: FormData) => Promise<void>
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Content')
  const [submitting, setSubmitting] = useState(false)
  const [title, setTitle] = useState(post?.title ?? '')
  const [slug, setSlug] = useState(post?.slug ?? '')
  const [slugLocked, setSlugLocked] = useState(Boolean(post?.slug))
  const [showPreview, setShowPreview] = useState(false)
  const [content, setContent] = useState(post?.content ?? '')

  return (
    <form action={action} onSubmit={() => setSubmitting(true)} className="max-w-3xl">
      <div className="flex gap-1 mb-4 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t} type="button" onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t ? 'border-brand-900 text-brand-900' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5">
        <div className={tab === 'Content' ? 'space-y-5' : 'hidden'}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              name="title" required value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (!slugLocked) setSlug(slugify(e.target.value))
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">Slug</label>
              {slugLocked && (
                <button type="button" onClick={() => setSlugLocked(false)} className="text-xs text-brand-700 hover:underline">
                  Edit manually
                </button>
              )}
            </div>
            <input
              name="slug" required value={slug} readOnly={slugLocked}
              onChange={(e) => setSlug(e.target.value)}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${slugLocked ? 'bg-gray-50 text-gray-500' : ''}`}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category" defaultValue={post?.category ?? 'general'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {BLOG_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
              <input
                name="tags" defaultValue={post?.tags?.join(', ') ?? ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <textarea
              name="excerpt" rows={2} defaultValue={post?.excerpt ?? ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">Content (HTML)</label>
              <button type="button" onClick={() => setShowPreview((v) => !v)} className="text-xs text-brand-700 hover:underline">
                {showPreview ? 'Edit' : 'Preview'}
              </button>
            </div>
            {showPreview ? (
              <div
                className="prose prose-sm max-w-none border border-gray-200 rounded-lg p-4 min-h-[260px]"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <textarea
                name="content" required rows={14} value={content} onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            )}
          </div>
        </div>

        <div className={tab === 'Media' ? 'space-y-5' : 'hidden'}>
          <ImageUploadField
            name="featured_image_url"
            label="Featured image"
            bucket="blog"
            defaultValue={post?.featured_image_url}
            accept="image"
          />
        </div>

        <div className={tab === 'SEO' ? 'space-y-5' : 'hidden'}>
          <SeoFields
            defaultMetaTitle={post?.meta_title}
            defaultMetaDescription={post?.meta_description}
            defaultCanonicalUrl={post?.canonical_url}
            defaultOgImageUrl={post?.og_image_url}
            defaultNoindex={post?.noindex}
            fallbackTitle={title || 'Untitled post'}
            urlPreview={`anonindia.com › blog › ${slug || 'slug'}`}
          />
          <ImageUploadField
            name="og_image_url"
            label="OG / social share image"
            bucket="blog"
            defaultValue={post?.og_image_url}
            accept="image"
          />
        </div>

        <div className={tab === 'Publish' ? 'space-y-4' : 'hidden'}>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input name="is_published" type="checkbox" defaultChecked={post?.is_published ?? false} className="rounded" />
            Published (visible on the public site)
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4">
        <button
          type="submit" disabled={submitting}
          className="bg-brand-900 text-white text-sm font-semibold rounded-lg px-5 py-2.5 hover:bg-brand-700 transition-colors disabled:opacity-50"
        >
          {submitting ? 'Saving…' : 'Save'}
        </button>
        <Link href="/admin/blog" className="text-sm text-gray-500 hover:text-gray-700">Cancel</Link>
      </div>
    </form>
  )
}
