import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.', // Set root to current directory (Frontend)
  publicDir: 'public', // Public assets directory
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist', // Output directory for the build (relative to Frontend folder)
    emptyOutDir: true, // Clean the output directory before build
  },
  server: {
    port: 5173,
    host: true,
  },
});
