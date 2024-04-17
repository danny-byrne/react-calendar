import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// import { resolve } from "path";
import * as path from "path";

// const { resolve } = path;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "./src"),
      // '@styles': resolve(__dirname, 'src/styles'),
      // Add more aliases as needed
    },
  },
});
