import Image from 'next/image'

interface Props {
  title: React.ReactNode
  subtitle?: React.ReactNode
  /** Small letter-spaced kicker above the title. */
  eyebrow?: string
  /** Background image URL. Falls back to a cinematic architectural shot. */
  image?: string
  /** 'tall' for landing pages (about/projects), 'default' for everything else. */
  size?: 'default' | 'tall'
  align?: 'left' | 'center'
  /** Optional slot under the copy — breadcrumbs, a search bar, CTAs. */
  children?: React.ReactNode
}

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80&auto=format&fit=crop'

/**
 * Cinematic interior-page hero. Full-bleed image with an ambient slow zoom,
 * layered scrims for legibility, a letter-spaced eyebrow, serif display title,
 * and a gold hairline. Server component — pure CSS motion, no client JS.
 */
export default function PageHero({
  title,
  subtitle,
  eyebrow,
  image = DEFAULT_IMAGE,
  size = 'default',
  align = 'left',
  children,
}: Props) {
  const centered = align === 'center'
  return (
    <section
      className={`relative isolate overflow-hidden bg-brand-900 text-white ${
        size === 'tall' ? 'py-28 md:py-40' : 'py-20 md:py-28'
      }`}
    >
      {/* Background image with ambient ken-burns zoom */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40 motion-safe:animate-slow-zoom"
        />
      </div>
      {/* Layered scrims — directional for legibility, bottom fade for a seamless
          hand-off into the page surface below. */}
      <div
        className={`absolute inset-0 -z-10 ${
          centered
            ? 'bg-gradient-to-t from-brand-900 via-brand-900/75 to-brand-900/45'
            : 'bg-gradient-to-r from-brand-900 via-brand-900/80 to-brand-900/30'
        }`}
      />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-brand-900 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`${size === 'tall' ? 'max-w-3xl' : 'max-w-2xl'} ${centered ? 'mx-auto text-center' : ''}`}>
          {eyebrow && (
            <p className="motion-safe:animate-fade-up text-xs font-semibold uppercase tracking-[0.2em] text-gold-400 mb-4">
              {eyebrow}
            </p>
          )}
          <h1
            className="motion-safe:animate-fade-up font-serif text-display font-semibold leading-[1.05]"
            style={{ animationDelay: '80ms' }}
          >
            {title}
          </h1>
          {/* Gold hairline accent */}
          <div
            className={`motion-safe:animate-fade-up h-px w-16 bg-gold-400/80 mt-6 ${centered ? 'mx-auto' : ''}`}
            style={{ animationDelay: '160ms' }}
          />
          {subtitle && (
            <p
              className="motion-safe:animate-fade-up text-lead text-gray-200 mt-6"
              style={{ animationDelay: '220ms' }}
            >
              {subtitle}
            </p>
          )}
          {children && (
            <div className="motion-safe:animate-fade-up mt-8" style={{ animationDelay: '300ms' }}>
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
