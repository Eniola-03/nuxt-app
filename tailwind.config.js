/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        custom: ['Poppins', 'serif'],
      },
      colors: {
        'green-100': '#008289',
        'green-200': '#008289',
        'green-300': '#60CED4',
        'my-blue': '#5271FF',
        'my-grey': '#B2B2B2',
        'bg-grey-700': '#FFF5A7',
        'bg-light': '#FFFFFF',
        'my-blue-100': '#5271FF',
        'btn-blue': '#06C3B4',
        'btn-danger': '#C34F06', 
        'regular': '#707070',
      },
      fontWeight: {
          light: 300,
          regular: 400,
          medium: 500,
          semibold: 600,
          bold: 700,
          extrabold: 800,
          black: 900,
          
      },
      screens: {
        'breakpoint-3xl': '1920px',
      },
    },
  },
  plugins: [],
}

