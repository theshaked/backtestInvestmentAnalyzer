/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{tsx,jsx,ts,js}"],
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#007acc",
        secondary: "#3e3e42",
        background: "#1e1e1e",
        foreground: "#d4d4d4",
        accent: "#56b6c2",
        error: "#f44747",
        warning: "#ffb000",
        info: "#75beff",
        success: "#89d185",
      },
    },
  },
  plugins: [require("autoprefixer"), require("prettier-plugin-tailwindcss")],
};
