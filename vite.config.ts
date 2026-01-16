
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    allowedHosts: [
      '.trycloudflare.com'
    ],
    hmr: {
      protocol: 'wss',
      clientPort: 443,
    },
  },
  define: {
    // This ensures that process.env exists in the browser to prevent crashes
    'process.env': typeof process !== 'undefined' ? process : {},
  },
});
