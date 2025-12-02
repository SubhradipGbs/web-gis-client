import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5177,
    proxy: {
      "/geo": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/geo/, ""),

        configure: (proxy, options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log("Request sent to target:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log(
              "Response received from target:",
              proxyRes.statusCode,
              req.url
            );
          });
        },
      },
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    },
  },
});
