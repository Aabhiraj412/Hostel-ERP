import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    historyApiFallback: true, // Enables fallback for client-side routing during development
  },
  build: {
    outDir: 'dist', // Ensures Vite builds to the "dist" folder
  },
});
