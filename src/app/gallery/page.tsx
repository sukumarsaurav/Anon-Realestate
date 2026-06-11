import type { Metadata } from 'next'
import Image from 'next/image'
import { getAllProjects } from '@/lib/queries'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Photo and video gallery of ANON INDIA real estate projects. See construction progress, completed developments, and site photos.',
}

export default async function GalleryPage() {
  const projects = await getAllProjects()
  const projectsWithMedia = projects.filter((p) => p.gallery_urls?.length > 0)

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-brand-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-2">Gallery</h1>
          <p className="text-gray-300">Photos and videos from our projects</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {projectsWithMedia.length === 0 ? (
          <div className="text-center py-20 text-gray-400">Gallery photos coming soon.</div>
        ) : (
          <div className="space-y-12">
            {projectsWithMedia.map((project) => (
              <div key={project.id}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">{project.name}</h2>
                  <span className="text-sm text-gray-400">{project.city} · {project.gallery_urls.length} photos</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {project.gallery_urls.map((url: string, i: number) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                      className="group relative overflow-hidden rounded-xl bg-gray-100 aspect-square block">
                      <Image src={url} alt={`${project.name} photo ${i + 1}`} fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    </a>
                  ))}
                </div>
                {project.video_url && (
                  <div className="mt-4">
                    <a href={project.video_url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 text-sm font-medium rounded-xl hover:bg-red-100">
                      ▶ Watch Video Tour
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
