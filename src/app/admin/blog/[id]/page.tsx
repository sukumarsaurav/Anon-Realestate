import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BlogPostForm from '@/components/admin/BlogPostForm'
import { updateBlogPost } from '../actions'

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: post } = await supabase.from('blog_posts').select('*').eq('id', id).single()

  if (!post) notFound()

  return (
    <div>
      <BlogPostForm post={post} action={updateBlogPost.bind(null, id)} />
    </div>
  )
}
