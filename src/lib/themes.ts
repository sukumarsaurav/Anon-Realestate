// Curated site-wide color themes. Each theme supplies a full brand + gold
// scale (50-900) as "R G B" triplets so Tailwind can consume them via
// rgb(var(--brand-900) / <alpha-value>) — see tailwind.config.ts.
// Selected in /admin/settings and injected as CSS variables in the root
// layouts (see applyThemeStyleTag below) — no other code needs to change.

export type ColorScale = Record<'50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900', string>

export interface ThemePreset {
  id: string
  label: string
  brand: ColorScale
  gold: ColorScale
}

function hexToRgbTriplet(hex: string): string {
  const n = parseInt(hex.replace('#', ''), 16)
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`
}

function scaleToRgb(scale: Record<string, string>): ColorScale {
  return Object.fromEntries(
    Object.entries(scale).map(([k, v]) => [k, hexToRgbTriplet(v)])
  ) as ColorScale
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'obsidian-gold',
    label: 'Obsidian Gold',
    brand: scaleToRgb({ '50': '#f5f7fa', '100': '#e4e8f0', '200': '#c5cedd', '300': '#9faec7', '400': '#768cb0', '500': '#546b94', '600': '#415374', '700': '#32405a', '800': '#232c3f', '900': '#0f121b' }),
    gold: scaleToRgb({ '50': '#fdfbf7', '100': '#f7f1e3', '200': '#eddcb9', '300': '#e0c38f', '400': '#d1a866', '500': '#c49a3a', '600': '#b3882f', '700': '#a37827', '800': '#8c631e', '900': '#6e4b14' }),
  },
  {
    id: 'sapphire-platinum',
    label: 'Sapphire Platinum',
    brand: scaleToRgb({ '50': '#f6f7f9', '100': '#e9ecf1', '200': '#cad4e2', '300': '#a8b9d2', '400': '#819bc0', '500': '#5278ad', '600': '#416291', '700': '#324e76', '800': '#243956', '900': '#172436' }),
    gold: scaleToRgb({ '50': '#f7f7f8', '100': '#ebedef', '200': '#d2d6da', '300': '#b6bdc3', '400': '#97a1aa', '500': '#737f8c', '600': '#5e6973', '700': '#4b545d', '800': '#373d44', '900': '#22262a' }),
  },
  {
    id: 'emerald-bronze',
    label: 'Emerald Bronze',
    brand: scaleToRgb({ '50': '#f6f9f8', '100': '#e9f1ee', '200': '#cae2da', '300': '#a8d2c4', '400': '#81c0ab', '500': '#52ad8f', '600': '#419176', '700': '#327660', '800': '#245645', '900': '#17362b' }),
    gold: scaleToRgb({ '50': '#f9f7f6', '100': '#f1ede9', '200': '#e2d5ca', '300': '#d2bba8', '400': '#c09f81', '500': '#ad7c52', '600': '#916641', '700': '#765232', '800': '#563c24', '900': '#362517' }),
  },
  {
    id: 'maroon-champagne',
    label: 'Maroon Champagne',
    brand: scaleToRgb({ '50': '#f9f6f7', '100': '#f1e9ea', '200': '#e2cace', '300': '#d2a8af', '400': '#c0818b', '500': '#ad5261', '600': '#91414e', '700': '#76323d', '800': '#56242d', '900': '#36171c' }),
    gold: scaleToRgb({ '50': '#f9f8f6', '100': '#f2efe8', '200': '#e5dcc8', '300': '#d6c7a3', '400': '#c8b07a', '500': '#b89647', '600': '#997c38', '700': '#7e652a', '800': '#5b491f', '900': '#392e13' }),
  },
]

export const DEFAULT_THEME_ID = 'obsidian-gold'

export function getThemePreset(themeName: string | null | undefined): ThemePreset {
  return THEME_PRESETS.find((t) => t.id === themeName) ?? THEME_PRESETS.find((t) => t.id === DEFAULT_THEME_ID)!
}

// CSS text for a <style> tag that overrides the brand/gold CSS variables
// declared in globals.css, scoped to :root, for the given theme.
export function themeStyleTagContent(themeName: string | null | undefined): string {
  const theme = getThemePreset(themeName)
  const vars = [
    ...Object.entries(theme.brand).map(([k, v]) => `--brand-${k}: ${v};`),
    ...Object.entries(theme.gold).map(([k, v]) => `--gold-${k}: ${v};`),
  ]
  return `:root{${vars.join('')}}`
}
