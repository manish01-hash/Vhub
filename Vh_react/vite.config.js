import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    https: false,
    cors: true,
    proxy: {
      "/api": {
        target: "https://vhub-zb2y.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
    middlewareMode: "html", // ✅ Fix: Ensures correct history fallback
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true,
  },
});
