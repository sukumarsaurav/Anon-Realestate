import Image from 'next/image'

/** Real photo when available, else an honest initials monogram (no stock faces). */
export default function Avatar({
  name,
  src,
  fontClass = 'text-sm',
}: {
  name: string
  src?: string | null
  fontClass?: string
}) {
  if (src) {
    return (
      <div className="relative w-full h-full">
        <Image
          src={src}
          alt={name}
          fill
          sizes="(max-width: 768px) 80px, 120px"
          className="object-cover"
        />
      </div>
    )
  }
  const initials = name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()
  return (
    <span className={`w-full h-full flex items-center justify-center text-gold-400 font-semibold ${fontClass}`}>
      {initials}
    </span>
  )
}
