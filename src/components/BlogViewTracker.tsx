'use client'

import { useEffect } from 'react'

// Fires once per mount to record a blog view. Kept out of the server render so
// the post page can be statically cached while view counts stay accurate.
export default function BlogViewTracker({ postId }: { postId: string }) {
  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/blog-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId }),
      signal: controller.signal,
      keepalive: true,
    }).catch(() => {})
    return () => controller.abort()
  }, [postId])

  return null
}
