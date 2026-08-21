'use client'

import { useCallback, useEffect } from 'react'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'

export interface LightboxSlide {
  src: string
  /** Bold line under the image. */
  title: string
  /** Muted line under the title. */
  caption?: string
}

/**
 * Full-screen image viewer with keyboard + arrow navigation. Rendered by the
 * awards page, the home-page awards carousel and the events galleries.
 * Pass `index === null` to keep it closed.
 */
export default function Lightbox({
  slides,
  index,
  onIndexChange,
  onClose,
}: {
  slides: LightboxSlide[]
  index: number | null
  onIndexChange: (i: number) => void
  onClose: () => void
}) {
  const open = index !== null

  const prev = useCallback(() => {
    if (index !== null && index > 0) onIndexChange(index - 1)
  }, [index, onIndexChange])

  const next = useCallback(() => {
    if (index !== null && index < slides.length - 1) onIndexChange(index + 1)
  }, [index, onIndexChange, slides.length])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    // Freeze the page behind the overlay.
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [open, onClose, prev, next])

  if (index === null) return null
  const slide = slides[index]

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={slide.title}
    >
      <div className="relative max-w-3xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/80 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={28} />
        </button>

        {index > 0 && (
          <button
            onClick={prev}
            className="absolute left-2 md:left-0 top-1/2 -translate-y-1/2 md:-translate-x-14 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Previous"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        {index < slides.length - 1 && (
          <button
            onClick={next}
            className="absolute right-2 md:right-0 top-1/2 -translate-y-1/2 md:translate-x-14 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Next"
          >
            <ArrowRight size={20} />
          </button>
        )}

        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white">
          <Image
            src={slide.src}
            alt={slide.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-contain p-2 sm:p-4"
            priority
          />
        </div>

        <div className="text-center mt-4">
          <p className="text-white font-semibold text-lg">{slide.title}</p>
          {slide.caption && <p className="text-white/60 text-sm mt-1">{slide.caption}</p>}
          <p className="text-white/40 text-xs mt-2 tabular-nums-pro">
            {index + 1} / {slides.length}
          </p>
        </div>
      </div>
    </div>
  )
}
