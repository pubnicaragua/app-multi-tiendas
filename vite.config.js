import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // ⚠️ Importante: Esto ayuda a cargar correctamente los archivos en Vercel
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@': '/src',
    }
  }
})
