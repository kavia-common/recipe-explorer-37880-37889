import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Ensure the dev server is reachable from container/host environments
    host: true,           // equivalent to 0.0.0.0 (bind to all interfaces)
    port: 3000,           // required by preview system
    strictPort: true,     // fail if 3000 is not available instead of choosing another port
    hmr: {
      // Use the container host for HMR; fall back to location.hostname in runtime
      host: 'localhost',
      port: 3000,
    },
  },
  preview: {
    host: true,
    port: 3000,
    strictPort: true,
  },
})
