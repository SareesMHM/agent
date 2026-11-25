/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        base: '#f4f1ec',
        panel: '#ffffff',
        sage: '#8a9a86',
        terracotta: '#d97a5a',
        plum: '#4a3b4c',
        slate: '#5c636a',
        soft: '#e8e4db',
      },
      boxShadow: {
        soft: '0 10px 40px -10px rgba(0,0,0,0.08)',
        float: '0 20px 40px -10px rgba(0,0,0,0.12)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
    },
  },
  plugins: [],
};