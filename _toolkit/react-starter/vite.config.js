import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// The built site lands one level up (<site_dir>/index.html + assets/),
// so the repo gallery can link to the folder with no deploy step.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '..',
    emptyOutDir: false,
    assetsDir: 'assets',
    chunkSizeWarningLimit: 600,
  },
});
