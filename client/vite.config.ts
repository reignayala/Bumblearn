import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const basePath = env.VITE_BASE_PATH || "/";

  return {
    base: basePath,
    plugins: [react(), tailwindcss()],
    server: {
      port: 5173,
      allowedHosts: true,
      proxy: {
        "/api": {
          target: "http://localhost:4000",
          changeOrigin: true,
        },
        "/health": {
          target: "http://localhost:4000",
          changeOrigin: true,
        },
        "/socket.io": {
          target: "http://localhost:4000",
          ws: true,
          changeOrigin: true,
        },
      },
    },
  };
});
