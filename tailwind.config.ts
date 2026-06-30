import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0f5ff',
          100: '#e5edff',
          200: '#cddbfe',
          300: '#a4bdfd',
          400: '#7597fa',
          500: '#4d6cf5',
          600: '#324ce6',
          700: '#2639cc',
          800: '#2332a6',
          900: '#164488', // User's requested blue
        },
        gold: {
          50:  '#fdfce8',
          100: '#fcf8c3',
          200: '#f9f08a',
          300: '#f5e24c',
          400: '#ebd025',
          500: '#bab447', // User's requested yellow
          600: '#a39818',
          700: '#827410',
          800: '#6d5e13',
          900: '#5e4f16',
        },
        gray: {
          50:  '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        whatsapp: { DEFAULT: '#25d366', dark: '#1da851' },
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
