import Link from 'next/link'
import Image from 'next/image'
import { Calendar, ArrowRight } from 'lucide-react'
import type { BlogPost } from '@/types'
import { propertyImage } from '@/lib/images'

interface Props {
  post: BlogPost
}

function fmtDate(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function BlogCard({ post }: Props) {
  const img = post.featured_image_url || propertyImage(post.id, 0, 800)
  return (
    <Link href={`/blog/${post.slug}`} className="card group flex flex-col">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <Image src={img} alt={post.title} fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300" />
        {post.category && (
          <span className="absolute top-3 left-3 badge bg-brand-900/85 text-white capitalize">{post.category}</span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        {post.published_at && (
          <span className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <Calendar size={11} />{fmtDate(post.published_at)}
          </span>
        )}
        <h3 className="h-card group-hover:text-gold-700 transition-colors mb-2 line-clamp-2">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-sm text-gray-500 line-clamp-3">{post.excerpt}</p>
        )}
        <span className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-gold-700 group-hover:gap-2 transition-all">
          Read article <ArrowRight size={15} />
        </span>
      </div>
    </Link>
  )
}
