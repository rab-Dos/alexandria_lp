// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://alexandriastudio.mx', // <-- Ajustar al dominio real
  vite: {
    plugins: [tailwindcss()],
  },
});
