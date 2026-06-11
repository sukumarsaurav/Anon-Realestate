import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Charcoal/near-black primary, derived from the B&W ANON INDIA logo
        brand: {
          50:  '#f5f5f6',
          100: '#e6e7e9',
          200: '#c9cbcf',
          500: '#3a3d44',
          600: '#24272e',
          700: '#15171c',
          800: '#0f1115',
          900: '#0a0b0d',
        },
        // Warm gold accent for CTAs / highlights
        gold: {
          50:  '#fbf6e9',
          100: '#f5e9c4',
          400: '#d9b65b',
          500: '#c49a3a',
          600: '#a87e26',
          700: '#86631c',
        },
        cream: '#f8f5ef',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-display)', 'Georgia', 'serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
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
