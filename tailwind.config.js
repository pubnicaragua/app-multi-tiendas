/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'], // Fuente predeterminada personalizada
        serif: ['Merriweather', 'serif'], // Otra fuente
        mono: ['Fira Code', 'monospace'] // Fuente monoespaciada
      },
    },
  },
  plugins: [],
}

