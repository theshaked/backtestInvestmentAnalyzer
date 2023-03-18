import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
import tailwindcss from "tailwindcss";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  server: {
    port: 3000,
  },
  css: {
    modules: {
      localsConvention: "camelCase",
    },
    postcss: {
      plugins: [tailwindcss],
    },
  },
});
