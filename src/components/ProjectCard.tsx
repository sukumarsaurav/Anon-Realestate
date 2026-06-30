import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Home, Phone, MessageCircle, BedDouble, ShieldCheck } from 'lucide-react'
import type { Project } from '@/types'
import { PROJECT_STATUS_LABELS } from '@/types'
import { formatINR, PHONE_RAW, PHONE_DIGITS } from '@/lib/format'
import { projectImage } from '@/lib/images'

interface Props {
  project: Project
}

const STATUS_STYLE: Record<string, string> = {
  pre_launch:         'bg-gold-100 text-gold-700',
  under_construction: 'bg-warning-100 text-warning-700',
  ready_to_move:      'bg-success-100 text-success-700',
  sold_out:           'bg-gray-100 text-gray-500',
}

export default function ProjectCard({ project }: Props) {
  const img = projectImage(project)
  const status = project.status
  const location = [project.locality, project.city].filter(Boolean).join(', ')
  const waMsg = encodeURIComponent(`Hi, I'm interested in ${project.name}. Please share details. (Ref: ${project.id})`)

  return (
    <div className="card group flex flex-col h-full">
      {/* Image */}
      <Link href={`/projects/${project.id}`} className="relative aspect-[4/3] bg-gray-100 overflow-hidden block">
        {img ? (
          <Image src={img} alt={project.name} fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><Home size={40} className="text-gray-300" /></div>
        )}
        <span className={`absolute top-3 left-3 badge backdrop-blur-sm ${STATUS_STYLE[status] ?? 'bg-gray-100 text-gray-500'}`}>
          {PROJECT_STATUS_LABELS[status] ?? status}
        </span>
        {project.website_category && (
          <span className="absolute top-3 right-3 badge bg-brand-900/90 backdrop-blur-sm text-white capitalize">{project.website_category}</span>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/projects/${project.id}`}>
          <h3 className="font-serif font-semibold text-brand-900 text-lg group-hover:text-gold-700 transition-colors mb-1.5">{project.name}</h3>
        </Link>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span className="flex items-center gap-1.5 truncate">
            <MapPin size={13} className="shrink-0" />
            <span className="truncate">{location || '—'}</span>
          </span>
          {project.bhk_config && (
            <span className="flex items-center gap-1 text-xs text-gray-500 shrink-0 ml-2">
              <BedDouble size={14} />{project.bhk_config}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mb-3 mt-auto">
          <p className="text-xl font-bold text-gold-700 leading-tight tabular-nums-pro">{formatINR(project.starting_price)}</p>
          {project.rera_number && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-success-700 bg-success-50 px-2 py-0.5 rounded-full">
              <ShieldCheck size={11} /> RERA
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link href={`/projects/${project.id}`}
            className="flex-1 py-2.5 bg-brand-900 text-white text-sm font-semibold rounded-xl text-center hover:bg-brand-700 transition-colors">
            View Details
          </Link>
          <a href={`tel:${PHONE_RAW}`} aria-label="Call"
            className="w-11 h-11 shrink-0 flex items-center justify-center rounded-xl border border-gray-200 text-brand-900 hover:bg-white">
            <Phone size={16} />
          </a>
          <a href={`https://wa.me/${PHONE_DIGITS}?text=${waMsg}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
            className="w-11 h-11 shrink-0 flex items-center justify-center rounded-xl bg-whatsapp text-white hover:bg-whatsapp-dark">
            <MessageCircle size={16} />
          </a>
        </div>
      </div>
    </div>
  )
}
