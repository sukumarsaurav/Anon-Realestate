import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Tree-shake large icon/util barrels so only used exports ship to the client.
  experimental: {
    optimizePackageImports: ['lucide-react'],
    // Admin image uploads go through a Server Action; the 1 MB default rejects
    // most photos. Vercel caps request bodies at 4.5 MB, so stay just under it.
    serverActions: { bodySizeLimit: '4mb' },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    // Keep optimized image variants cached for ~31 days instead of the 60s
    // default — avoids re-transforming the same Supabase/Unsplash sources.
    minimumCacheTTL: 2678400,
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**.supabase.in' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
    ],
  },
}

export default nextConfig
