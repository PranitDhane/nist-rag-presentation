import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// In dev, the browser talks to Vite and Vite forwards API calls to the FastAPI server, so there is no CORS to configure.
// Point it elsewhere with VITE_API_TARGET (see .env.example). A production build is served by any static host that
// proxies the same paths to the API.
export default defineConfig(({ mode }) => {
  const target = loadEnv(mode, process.cwd(), "").VITE_API_TARGET || "http://127.0.0.1:8000";
  const proxy = Object.fromEntries(["/chat", "/threads", "/health"].map((p) => [p, { target, changeOrigin: true }]));
  return { plugins: [react()], server: { port: 5173, proxy }, preview: { proxy } };
});
