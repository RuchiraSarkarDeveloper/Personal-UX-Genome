/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        genome: {
          primary: 'var(--genome-primary)',
          secondary: 'var(--genome-secondary)',
          accent: 'var(--genome-accent)',
        },
      },
      transitionDuration: {
        'genome-fast': 'var(--genome-animation-fast)',
        'genome-balanced': 'var(--genome-animation-balanced)',
        'genome-slow': 'var(--genome-animation-slow)',
      },
      spacing: {
        'genome-compact': 'var(--genome-spacing-compact)',
        'genome-standard': 'var(--genome-spacing-standard)',
        'genome-spacious': 'var(--genome-spacing-spacious)',
      },
    },
  },
  plugins: [],
}

