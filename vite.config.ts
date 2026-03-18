import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { adminApiPlugin } from "./vite-plugin-admin-api"

export default defineConfig({
  base: '/',
  plugins: [react(), adminApiPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['sonner', 'react-markdown', 'mermaid', 'rehype-highlight'],
  },
  server: {
    port: 4173,
    strictPort: false,
    hmr: {
      port: 4173,
    },
  },
});
