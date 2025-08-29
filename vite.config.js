import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  preview: {
    port: process.env.PORT || 4173,
    host: "0.0.0.0",
    allowedHosts: [
      "n-queens-1vha.onrender.com" // ✅ your Render domain here
    ]
  },
  server: {
    port: process.env.PORT || 5173,
    host: "0.0.0.0"
  }
});
