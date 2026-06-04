import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Home } from 'lucide-react'
import type { Project } from '@/types'
import { PROJECT_STATUS_LABELS, PROJECT_TYPE_LABELS } from '@/types'

interface Props {
  project: Project
}

const STATUS_STYLE: Record<string, string> = {
  pre_launch:         'bg-purple-100 text-purple-700',
  under_construction: 'bg-amber-100 text-amber-700',
  ready_to_move:      'bg-green-100 text-green-700',
  sold_out:           'bg-gray-100 text-gray-500',
}

export default function ProjectCard({ project }: Props) {
  const img    = project.gallery_urls?.[0]
  const status = project.status
  const plots  = (project.plots ?? []).filter((p) => p.status === 'available')

  return (
    <Link href={`/projects/${project.id}`} className="card group block">
      {/* Image */}
      <div className="relative h-52 bg-gray-100 overflow-hidden">
        {img ? (
          <Image src={img} alt={project.name} fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Home size={40} className="text-gray-300" />
          </div>
        )}
        <span className={`absolute top-3 left-3 badge text-xs ${STATUS_STYLE[status] ?? 'bg-gray-100 text-gray-500'}`}>
          {PROJECT_STATUS_LABELS[status] ?? status}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
            {PROJECT_TYPE_LABELS[project.type] ?? project.type}
          </span>
          {plots.length > 0 && (
            <span className="text-xs text-green-600 font-medium">{plots.length} plots available</span>
          )}
        </div>

        <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors mb-1">
          {project.name}
        </h3>

        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
          <MapPin size={13} className="shrink-0" />
          <span>{[project.locality, project.city].filter(Boolean).join(', ')}</span>
        </div>

        {project.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">{project.description}</p>
        )}

        {project.rera_number && (
          <p className="text-xs text-gray-400 mb-4">RERA: {project.rera_number}</p>
        )}

        <span className="inline-block w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl text-center group-hover:bg-blue-700 transition-colors">
          View Project →
        </span>
      </div>
    </Link>
  )
}
