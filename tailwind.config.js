/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#007BFF',
          '50': '#E6F2FF',
          '100': '#BEDAFF',
          '200': '#94C1FF',
          '300': '#6BA9FF',
          '400': '#4290FF',
          '500': '#1978FF',
          '600': '#0062CC',
          '700': '#004C9E',
          '800': '#003670',
          '900': '#002042',
        },
        secondary: '#6c757d',
        success: '#28a745',
        danger: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8',
      }
    }
  },
  plugins: [],
}
