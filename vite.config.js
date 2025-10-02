import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  // Otimizações de build
  build: {
    // Minification com esbuild (padrão do Vite - mais rápido)
    minify: 'esbuild',
    
    // Code splitting otimizado
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendor chunks grandes
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'animation-vendor': ['framer-motion'],
          'video-vendor': ['hls.js'],
        },
      },
    },
    
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
    
    // Otimizar CSS
    cssCodeSplit: true,
  },
  
  // Otimizar dependências
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'hls.js'],
  }
})
