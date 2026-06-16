import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Tag } from 'lucide-react'
import type { BlogPost } from '@/types'

interface Props {
  post: BlogPost
}

function fmtDate(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function BlogCard({ post }: Props) {
  return (
    <Link href={`/blog/${post.slug}`} className="card group block">
      {post.featured_image_url && (
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <Image src={post.featured_image_url} alt={post.title} fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
          {post.published_at && (
            <span className="flex items-center gap-1">
              <Calendar size={11} />{fmtDate(post.published_at)}
            </span>
          )}
          <span className="flex items-center gap-1 capitalize">
            <Tag size={11} />{post.category}
          </span>
        </div>
        <h3 className="font-bold text-gray-900 group-hover:text-gold-700 transition-colors mb-2 line-clamp-2">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-sm text-gray-500 line-clamp-3">{post.excerpt}</p>
        )}
      </div>
    </Link>
  )
}
