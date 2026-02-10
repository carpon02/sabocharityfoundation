import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:5000/v1',  // ✅ Bridge to backend's haven
        changeOrigin: true,  // Masquerade as kin, easing CORS's guard
        secure: false,  // For dev's unencrypted whispers
      },
    },
  },
})
