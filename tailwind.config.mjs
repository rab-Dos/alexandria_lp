/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,svelte,vue}'],
  theme: {
    extend: {
      // Paleta de Alexandria Studio – ajustar según identidad final
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#dce6ff',
          500: '#3b6fd4',
          700: '#1e3fa3',
          900: '#0d1f52',
        },
        gold: {
          400: '#e6b84a',
          500: '#c99a2e',
        },
      },
      fontFamily: {
        sans: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display Variable', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
