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
        target: "https://vhub-5dvu.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
    historyApiFallback: true,  // ✅ Ensures React Router works on refresh
  },
  build: {
    outDir: "dist",  // ✅ Ensures Vercel picks up the correct build folder
  },
});
