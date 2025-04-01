import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://vhub-zb2y.onrender.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false // Add if using self-signed certs
      }
    }
  },
  build: {
    outDir: "dist",
    manifest: true, // Critical for production
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-[hash].js`, // Changed to hyphen
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash][extname]` // Better pattern
      }
    }
  }
});