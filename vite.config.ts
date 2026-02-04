import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['sonner', 'react-markdown', 'mermaid', 'rehype-highlight'],
  },
  server: {
    port: 5173,
    strictPort: false,
    hmr: {
      port: 5173,
    },
  },
  logLevel: 'error'
});
