/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: '#000000',
        surface: '#202020',
        'border-main': '#404040',
        'text-muted': '#5f5f5f',
        accent: '#7f7f7f',

        // Colores derivados para gráficas y estados
        primary: '#7f7f7f',
        success: '#4a9f6f',
        warning: '#d4a574',
        danger: '#c65d5d',
        info: '#6b8fb5',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'custom': '0 2px 8px rgba(0, 0, 0, 0.3)',
        'custom-lg': '0 4px 16px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}
