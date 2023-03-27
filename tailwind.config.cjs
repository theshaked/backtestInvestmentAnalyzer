/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/styles/**/*.{tsx,jsx,ts,js}"],
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Canva Sans",
          "Noto Sans Variable",
          "Noto Sans",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        primary: {
          light: "#84a962	",
          DEFAULT: "#65943b",
          dark: "#51762f	",
        },
        secondary: {
          light: "#656568	 ",
          DEFAULT: "#3e3e42",
          dark: "#323235	 ",
        },
        background: "#1e1e1e",
        foreground: "#FFFFF0",
        accent: "#56b6c2",
        error: "#f44747",
        warning: "#ffb000",
        info: "#cce7ff",
        success: "#0f75bc",
      },
    },
  },
  plugins: [
    require("autoprefixer"),
    require("prettier-plugin-tailwindcss"),
    require("@tailwindcss/typography"),
  ],
};
