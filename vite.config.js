import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import vercel from 'vite-plugin-vercel';

export default defineConfig({
  plugins: [react(), vercel()],
  server: {
    port: import.meta.env.PORT,
  },
})

