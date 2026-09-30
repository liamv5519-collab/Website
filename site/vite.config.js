import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // GSAP + Framer Motion + React land just over the default 500 kB warning.
    chunkSizeWarningLimit: 700,
  },
})
