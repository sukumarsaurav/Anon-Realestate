// Curated real-estate stock images (Unsplash — whitelisted in next.config).
// Used as deterministic fallbacks wherever a project has no uploaded image,
// so the site always renders with imagery.
const PROPERTY_PHOTO_IDS = [
  'photo-1582268611958-ebfd161ef9cf',
  'photo-1486406146926-c627a92ad1ab',
  'photo-1545324418-cc1a3fa10c00',
  'photo-1512917774080-9991f1c4c750',
  'photo-1600596542815-ffad4c1539a9',
  'photo-1600585154340-be6161a56a0c',
  'photo-1493809842364-78817add7ffb',
  'photo-1564013799919-ab600027ffc6',
  'photo-1480074568708-e7b720bb3f09',
  'photo-1502672260266-1c1ef2d93688',
]

function hash(seed: string): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return h
}

/** Deterministic property image for a seed (e.g. project id), offset by index. */
export function propertyImage(seed: string, index = 0, w = 900): string {
  const id = PROPERTY_PHOTO_IDS[(hash(seed) + index) % PROPERTY_PHOTO_IDS.length]
  return `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`
}

/** Best image for a project: uploaded hero → first gallery → deterministic fallback. */
export function projectImage(
  p: { id: string; hero_image_url?: string | null; gallery_urls?: string[] | null },
  w = 900,
): string {
  return p.hero_image_url || p.gallery_urls?.[0] || propertyImage(p.id, 0, w)
}

/** A gallery of at least `min` images, padding with fallbacks when needed. */
export function projectGallery(
  p: { id: string; gallery_urls?: string[] | null },
  min = 4,
): string[] {
  const existing = (p.gallery_urls ?? []).filter(Boolean)
  if (existing.length >= min) return existing
  const out = [...existing]
  for (let i = 0; out.length < min; i++) out.push(propertyImage(p.id, existing.length + i))
  return out
}

/** Deterministic avatar for a person/quote (stable per name). */
export function avatarFor(seed: string, size = 300): string {
  return `https://i.pravatar.cc/${size}?u=${encodeURIComponent(seed)}`
}
