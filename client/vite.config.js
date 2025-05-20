import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['jspdf', 'jspdf-autotable']
  },  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
    rollupOptions: {
      // Remove seedrandom from external dependencies so it's bundled
      external: [],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          tensorflow: ['@tensorflow/tfjs']
        }
      }
    }
  }
})
