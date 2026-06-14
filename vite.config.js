import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Deployed to GitHub Pages on a custom domain (CNAME) -> base '/'
// Beim SSR-/Prerender-Build (isSsrBuild) entfällt das manuelle Chunk-Splitting,
// da Abhängigkeiten dort als externe Module behandelt werden.
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 900,
    rollupOptions: isSsrBuild
      ? {}
      : {
          output: {
            manualChunks: {
              firebase: ['firebase/app', 'firebase/firestore', 'firebase/storage', 'firebase/auth'],
              motion: ['framer-motion'],
              react: ['react', 'react-dom', 'react-router-dom'],
            },
          },
        },
  },
}))
