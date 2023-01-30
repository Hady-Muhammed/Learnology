/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    screens: {
      'xxs': '150px' ,
      // => @media (min-width: 150px) { ... }

      'xs': '300px' ,
      // => @media (min-width: 300px) { ... }

      'msm': '440px' ,
      // => @media (min-width: 400px) { ... }

      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    textShadow: {
      'default': '0px 0px 4px rgb(255 255 255), 0 0 11px rgb(255 255 255)',
    },
    extend: {},
  },
  plugins: [],
}
