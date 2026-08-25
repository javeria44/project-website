/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: '#201F1C',
        slab:     '#4A4743',
        concrete: '#ACA79E',
        paper:    '#EAE7DF',
        amber:    '#E8A233',
        rebar:    '#C4472A',
      },
      fontFamily: {
        stencil: ['"Archivo Black"', 'sans-serif'],
        condensed: ['"Barlow Condensed"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
