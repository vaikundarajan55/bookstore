/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  darkMode: 'class',  // toggle dark mode via <html class="dark">

  theme: {
    extend: {

      // ── Brand colours ─────────────────────────────
      colors: {
        primary: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#7c3aed',   // main
          600: '#6d28d9',
          700: '#5b21b6',
          800: '#4c1d95',
          900: '#2e1065',
        },
        accent: {
          400: '#fb923c',
          500: '#f97316',   // main
          600: '#ea580c',
        },
        surface: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          800: '#1e293b',
          900: '#0f172a',
        },
        success: '#22c55e',
        warning: '#f59e0b',
        danger:  '#ef4444',
        info:    '#3b82f6',
      },

      // ── Typography ────────────────────────────────
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        mono:  ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },

      // ── Spacing & sizing ──────────────────────────
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        card:    '0 1px 3px 0 rgb(0 0 0 / 0.08)',
        popover: '0 8px 24px -4px rgb(0 0 0 / 0.12)',
        glow:    '0 0 0 3px rgb(124 58 237 / 0.25)',  // focus ring
      },

      // ── Keyframe animations ───────────────────────
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        cardRise: {
          '0%':   { opacity: '0', transform: 'translateY(16px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0)  scale(1)' },
        },
        blobDrift: {
          '0%,100%': { transform: 'translate(0,0)' },
          '50%':     { transform: 'translate(20px,15px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition:  '400px 0' },
        },
      },
      animation: {
        fadeUp:    'fadeUp 0.4s ease-out both',
        cardRise:  'cardRise 0.5s cubic-bezier(0.22,1,0.36,1) both',
        blobDrift: 'blobDrift 10s ease-in-out infinite',
        shimmer:   'shimmer 1.4s linear infinite',
      },
    },
  },

  plugins: [
    require('@tailwindcss/forms'),       // resets + styles all form elements
    require('@tailwindcss/typography'),  // prose class for rich text
    require('daisyui'),                  // full component library
  ],

  // ── DaisyUI theme config ───────────────────────────
  daisyui: {
    themes: [
      {
        acme: {                          // custom theme name
          'primary':         '#7c3aed',
          'primary-focus':   '#6d28d9',
          'primary-content': '#ffffff',
          'secondary':       '#f97316',
          'accent':          '#4f46e5',
          'neutral':         '#1e293b',
          'base-100':        '#ffffff',
          'base-200':        '#f8fafc',
          'base-300':        '#e2e8f0',
          'info':            '#3b82f6',
          'success':         '#22c55e',
          'warning':         '#f59e0b',
          'error':           '#ef4444',
        },
      },
      'light',
      'dark',   // keep built-in themes available too
    ],
    darkTheme: 'dark',
    base:      true,
    styled:    true,
    utils:     true,
    logs:      false,
  },
}