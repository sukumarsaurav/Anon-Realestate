import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Charcoal/near-black primary, derived from the B&W ANON INDIA logo.
        // 300/400 fill the gap between 200 and 500 for mid-tone chrome.
        brand: {
          50:  '#f5f5f6',
          100: '#e6e7e9',
          200: '#c9cbcf',
          300: '#9b9ea4',
          400: '#6c6f76',
          500: '#3a3d44',
          600: '#24272e',
          700: '#15171c',
          800: '#0f1115',
          900: '#0a0b0d',
        },
        // Warm gold accent for CTAs / highlights. 200/300 give usable light-golds,
        // 800/900 give deep accents. Use 700+ for gold *text* on light surfaces.
        gold: {
          50:  '#fbf6e9',
          100: '#f5e9c4',
          200: '#eedfa3',
          300: '#e2cb7d',
          400: '#d9b65b',
          500: '#c49a3a',
          600: '#a87e26',
          700: '#86631c',
          800: '#6b4f16',
          900: '#4f3a10',
        },
        // Warm-neutral ramp — overrides Tailwind's cool default gray so all
        // neutrals share the warmth of cream/gold. Lightness tuned to preserve
        // contrast (500 passes AA on white; 400 is for borders/large/UI only).
        gray: {
          50:  '#faf8f5',
          100: '#f2efe9',
          200: '#e6e2da',
          300: '#d2cdc3',
          400: '#a39d92',
          500: '#736d63',
          600: '#565049',
          700: '#423d37',
          800: '#292621',
          900: '#1a1714',
        },
        cream: '#f8f5ef',
        // WhatsApp brand — kept distinct from semantic success-green.
        whatsapp: { DEFAULT: '#25d366', dark: '#1da851' },
        // Semantic intent tokens (values mirror Tailwind green/amber/red so
        // the rename is visually identical). Use these instead of raw colours.
        success: { 50: '#f0fdf4', 100: '#dcfce7', 500: '#22c55e', 600: '#16a34a', 700: '#15803d' },
        warning: { 50: '#fffbeb', 100: '#fef3c7', 500: '#f59e0b', 600: '#d97706', 700: '#b45309' },
        danger:  { 50: '#fef2f2', 100: '#fee2e2', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c' },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        // Manrope display family. Key names kept ('serif'/'display') so existing
        // font-serif/font-display utilities map straight onto the new heading font.
        serif: ['var(--font-display)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      // Additive editorial type scale (named keys; Tailwind defaults stay intact).
      fontSize: {
        display: ['clamp(2.5rem, 5vw, 3.75rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        heading: ['clamp(2rem, 3.5vw, 2.6rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        title:   ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        lead:    ['1.125rem', { lineHeight: '1.7' }],
      },
      keyframes: {
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(24px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'slow-zoom': { '0%': { transform: 'scale(1)' }, '100%': { transform: 'scale(1.12)' } },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in': 'fade-in 0.8s ease forwards',
        'slow-zoom': 'slow-zoom 18s ease-in-out infinite alternate',
      },
      boxShadow: {
        'soft': '0 2px 8px -2px rgb(26 23 20 / 0.08)',
        'card': '0 8px 30px -8px rgb(26 23 20 / 0.12)',
        'lift': '0 20px 50px -12px rgb(26 23 20 / 0.22)',
        'gold': '0 10px 30px -10px rgb(196 154 58 / 0.35)',
      },
    },
  },
  plugins: [],
}

export default config
