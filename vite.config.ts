
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// Import process explicitly from node:process to fix type issues for cwd()
import process from 'node:process';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all envs regardless of the `VITE_` prefix.
  // Using process.cwd() here is correct for getting the root directory of the project.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      port: 3000,
      host: true, // Listen on all addresses
      allowedHosts: [
        '.trycloudflare.com'
      ],
      hmr: {
        // Required for HMR to work through a Cloudflare tunnel (HTTPS -> WSS)
        protocol: 'wss',
        clientPort: 443,
      },
    },
    // Removed the 'define' section for process.env.API_KEY to comply with the requirement 
    // that process.env.API_KEY must be sourced exclusively from the environment.
  };
});
