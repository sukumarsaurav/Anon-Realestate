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
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={name} className="w-full h-full object-cover" />
  }
  const initials = name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()
  return (
    <span className={`w-full h-full flex items-center justify-center text-gold-400 font-semibold ${fontClass}`}>
      {initials}
    </span>
  )
}
