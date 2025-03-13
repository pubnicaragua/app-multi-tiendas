import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',  // Asegura que las rutas sean correctas en producción
  server: {
    historyApiFallback: true, // Maneja las rutas correctamente en Vercel
  }
})
