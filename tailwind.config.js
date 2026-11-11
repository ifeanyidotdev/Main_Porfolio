/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['"Roboto Mono"', 'monospace'],
      },
      colors: {
        surface: {
          bg: 'var(--bg-primary)',
          elevated: 'var(--bg-elevated)',
          card: 'var(--bg-card)',
          glass: 'var(--bg-glass)',
          muted: 'var(--bg-muted)',
        },
        content: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        brand: {
          DEFAULT: 'var(--brand-primary)',
          primary: 'var(--brand-primary)',
          fill: 'var(--brand-fill)',
          onPrimary: 'var(--brand-on-primary)',
          container: 'var(--brand-container)',
          onContainer: 'var(--brand-on-container)',
          border: 'var(--border-subtle)',
          borderStrong: 'var(--border-strong)',
        },
      },
    },
  },
  plugins: [],
};
