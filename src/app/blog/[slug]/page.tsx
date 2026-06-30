import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getBlogPostBySlug, getPublishedBlogPosts, getAllBlogSlugs } from '@/lib/queries'
import LeadForm from '@/components/LeadForm'
import BlogViewTracker from '@/components/BlogViewTracker'
import { Calendar, Tag, ArrowLeft } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

export const revalidate = 300

// Pre-render each published post at build time; new slugs render on demand.
export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.meta_title ?? post.title,
    description: post.meta_description ?? post.excerpt ?? undefined,
    openGraph: { images: post.featured_image_url ? [{ url: post.featured_image_url }] : [] },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const [post, related] = await Promise.all([
    getBlogPostBySlug(slug),
    getPublishedBlogPosts(4),
  ])

  if (!post) notFound()

  const relatedPosts = related.filter((p) => p.slug !== slug && p.category === post.category).slice(0, 3)

  function fmtDate(iso: string | null) {
    if (!iso) return ''
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Counts a view per visit — the page itself is statically cached. */}
      <BlogViewTracker postId={post.id} />
      {post.featured_image_url && (
        <div className="relative h-64 md:h-80 overflow-hidden">
          <Image src={post.featured_image_url} alt={post.title} fill priority sizes="100vw"
            className="object-cover" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Article */}
          <article className="flex-1 bg-white rounded-2xl border border-gray-100 p-8">
            <Link href="/blog" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-600 mb-6">
              <ArrowLeft size={14} /> Back to Blog
            </Link>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
              {post.published_at && (
                <span className="flex items-center gap-1">
                  <Calendar size={13} />{fmtDate(post.published_at)}
                </span>
              )}
              <span className="flex items-center gap-1 capitalize">
                <Tag size={13} />{post.category}
              </span>
              {post.tags?.map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">{tag}</span>
              ))}
            </div>

            <h1 className="font-serif text-3xl font-semibold text-brand-900 mb-6 leading-tight">{post.title}</h1>

            {post.excerpt && (
              <p className="text-lg text-gray-500 leading-relaxed mb-8 border-l-4 border-gold-500 pl-4">
                {post.excerpt}
              </p>
            )}

            {/* Render content as plain text — in production, use markdown renderer */}
            <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>

            {/* Bottom CTA */}
            <div className="mt-12 p-6 bg-gold-50 rounded-2xl border border-gold-100">
              <h3 className="h-card mb-2">Interested in investing in real estate?</h3>
              <p className="text-sm text-gold-700 mb-4">Talk to our expert advisors for personalized guidance.</p>
              <LeadForm source={`blog_${post.slug}`} compact title="" subtitle="" />
            </div>

            {/* Related posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-10">
                <h2 className="h-block mb-4">Related Articles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedPosts.map((r) => (
                    <Link key={r.id} href={`/blog/${r.slug}`}
                      className="block p-4 bg-white rounded-xl hover:bg-gold-50 transition-colors">
                      <p className="text-sm font-medium text-brand-900 line-clamp-2 hover:text-gold-700">{r.title}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 lg:sticky lg:top-24">
              <h3 className="h-block mb-4">Enquire Now</h3>
              <LeadForm source={`blog_sidebar_${post.slug}`} compact title="" subtitle="" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
