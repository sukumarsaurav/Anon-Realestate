import type { Metadata } from 'next'
import Image from 'next/image'
import { getAllProjects } from '@/lib/queries'
import PageHero from '@/components/PageHero'
import Reveal from '@/components/Reveal'

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
      <PageHero
        eyebrow="Our work"
        title="Gallery"
        subtitle="Photos and videos from our projects."
        image="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920&q=80&auto=format&fit=crop"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section">
        {projectsWithMedia.length === 0 ? (
          <div className="text-center py-20 text-gray-500">Gallery photos coming soon.</div>
        ) : (
          <div className="space-y-12">
            {projectsWithMedia.map((project, idx) => (
              <Reveal key={project.id} delay={idx * 80}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="h-block">{project.name}</h2>
                  <span className="text-sm text-gray-500">{project.city} · {project.gallery_urls.length} photos</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {project.gallery_urls.map((url: string, i: number) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                      className="group relative overflow-hidden rounded-2xl bg-gray-100 aspect-square block">
                      <Image src={url} alt={`${project.name} photo ${i + 1}`} fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    </a>
                  ))}
                </div>
                {project.video_url && (
                  <div className="mt-4">
                    <a href={project.video_url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-danger-50 text-danger-700 text-sm font-medium rounded-xl hover:bg-danger-100">
                      ▶ Watch Video Tour
                    </a>
                  </div>
                )}
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
