import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  try {
    const service = getServiceClient()
    const { postId } = await req.json()
    if (!postId) {
      return NextResponse.json({ error: 'postId is required.' }, { status: 400 })
    }

    const { error } = await service.rpc('increment_blog_views', { post_id: postId })
    if (error) {
      console.error('Blog view increment error:', error)
      return NextResponse.json({ error: 'Failed to record view.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Blog view API error:', err)
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}
