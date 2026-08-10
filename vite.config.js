import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      // 1. Penanganan /api/set-password (Spesifik)
      "/api/set-password": {
        target: "https://rpp.bapenda.jatengprov.go.id",
        changeOrigin: true,
        secure: false,
        rewrite: (path) =>
          path.replace(
            /^\/api\/set-password/,
            "/penatausahaan/api/pepakraja/wr/set-password",
          ),
        // Menambahkan header untuk menyamai konfigurasi headers di vercel.json
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.setHeader(
              "Referer",
              "https://rpp.bapenda.jatengprov.go.id/",
            );
            proxyReq.setHeader(
              "Origin",
              "https://rpp.bapenda.jatengprov.go.id/",
            );
          });
        },
      },
'/monev': {
        target: 'https://rpp.bapenda.jatengprov.go.id',
        changeOrigin: true,
        secure: false,
        // Coba hilangkan penambahan /penatausahaan/api di sini jika route backend aslinya berbeda,
        // atau sesuaikan jika endpoint login aslinya berada di jalur lain.
        rewrite: (path) => path.replace(/^\/monev/, '')
      },

      "/bapenda": {
        target: "https://rpp.bapenda.jatengprov.go.id",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/bapenda/, "/penatausahaan/api"),
      },
      "/api-proxy": {
        target:
          "https://rpp.bapenda.jatengprov.go.id/penatausahaan/api/pepakraja/wr",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-proxy/, ""),
      },
      "/api-reset": {
        target:
          "https://rpp.bapenda.jatengprov.go.id/penatausahaan/api/pepakraja/wr",
        changeOrigin: true,
        secure: false, // Menghindari isu sertifikat SSL di lingkungan dev
        rewrite: (path) => path.replace(/^\/api-proxy/, ""),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req, res) => {
            proxyReq.setHeader(
              "Referer",
              "https://rpp.bapenda.jatengprov.go.id/",
            );
            proxyReq.setHeader(
              "Origin",
              "https://rpp.bapenda.jatengprov.go.id",
            );
          });
        },
      },
      // 4. Catch-all /api (Mengarah ke root domain)
      // Pastikan diletakkan di urutan paling bawah agar tidak membajak path lain
      "^/api/": {
        target: "https://rpp.bapenda.jatengprov.go.id",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
