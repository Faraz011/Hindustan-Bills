import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // allow external connections (LAN, ngrok, etc.)
    port: 3000,
    open: true,
    allowedHosts: [
      "a6d1c7b91d8c.ngrok-free.app", // 👈 your ngrok domain here
    ],
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
