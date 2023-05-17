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
          lighter: "#8a7fc5",
          light: "#7a6ebd",
          DEFAULT: "#6a5cb5",
          dark: "#5c4daa	",
        },
        secondary: {
          lighter: "#606060",
          light: "#505050",
          DEFAULT: "#404040",
          dark: "#303030",
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
