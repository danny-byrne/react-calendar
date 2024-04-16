import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@src": resolve(__dirname, "src/components"),
      // '@styles': resolve(__dirname, 'src/styles'),
      // Add more aliases as needed
    },
  },
});
