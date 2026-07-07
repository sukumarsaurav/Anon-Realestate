import BlogPostForm from '@/components/admin/BlogPostForm'
import { createBlogPost } from '../actions'

export default function NewBlogPostPage() {
  return (
    <div>
      <BlogPostForm action={createBlogPost} />
    </div>
  )
}
