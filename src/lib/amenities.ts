import {
  Dumbbell, Waves, ShieldCheck, Camera, Car, Trees, Users, Baby, Zap, Wifi,
  Flower2, Droplets, Building2, Utensils, ShoppingBag, Activity, Footprints,
  Bike, Dog, Film, Landmark, Wind, Stethoscope, GraduationCap, Music, Lightbulb,
  Sun, Phone, Flame, CheckCircle,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// Keyword → icon. First matching keyword wins, so order more-specific first.
const RULES: [readonly string[], LucideIcon][] = [
  [['gym', 'fitness', 'workout'], Dumbbell],
  [['swim', 'pool'], Waves],
  [['cctv', 'surveillance'], Camera],
  [['security', 'guard', 'gated'], ShieldCheck],
  [['parking', 'car park'], Car],
  [['clubhouse', 'club house', 'community', 'club'], Users],
  [['kids', 'children', "children's", 'play area', 'playground'], Baby],
  [['power', 'backup', 'generator', 'dg '], Zap],
  [['wifi', 'wi-fi', 'internet', 'broadband'], Wifi],
  [['spa', 'sauna', 'wellness', 'yoga', 'meditation'], Flower2],
  [['rain', 'harvest', 'water'], Droplets],
  [['lift', 'elevator'], Building2],
  [['cafe', 'restaurant', 'dining', 'food court', 'kitchen'], Utensils],
  [['shop', 'retail', 'market', 'mall', 'convenience'], ShoppingBag],
  [['tennis', 'basketball', 'badminton', 'squash', 'cricket', 'sport', 'court'], Activity],
  [['jog', 'walk', 'track'], Footprints],
  [['cycle', 'cycling', 'bicycle'], Bike],
  [['pet'], Dog],
  [['theatre', 'theater', 'cinema', 'amphitheatre', 'amphitheater'], Film],
  [['temple', 'worship', 'mandir'], Landmark],
  [['air condition', 'a/c', 'hvac', 'central ac'], Wind],
  [['medical', 'clinic', 'hospital', 'health'], Stethoscope],
  [['school', 'education', 'creche', 'day care'], GraduationCap],
  [['banquet', 'party', 'event'], Music],
  [['street light', 'lighting'], Lightbulb],
  [['solar'], Sun],
  [['intercom'], Phone],
  [['gas', 'fire'], Flame],
  [['garden', 'park', 'landscap', 'green', 'lawn'], Trees],
]

/** Best-fit icon for an amenity label; falls back to a check mark. */
export function amenityIcon(name: string): LucideIcon {
  const n = name.toLowerCase()
  for (const [keywords, Icon] of RULES) {
    if (keywords.some((k) => n.includes(k))) return Icon
  }
  return CheckCircle
}
