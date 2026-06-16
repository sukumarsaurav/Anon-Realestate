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
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-display)', 'Georgia', 'serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
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
    },
  },
  plugins: [],
}

export default config
