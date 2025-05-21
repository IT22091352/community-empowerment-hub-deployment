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
  },  server: {
    proxy: {
      '/api': {
        target: 'https://community-empowerment-hub-313ac18da07a.herokuapp.com',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost',
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // This will enable CORS requests to be proxied correctly
            proxyReq.setHeader('origin', 'https://community-empowerment-hub-313ac18da07a.herokuapp.com');
          });
        }
      },
    },
  },
  optimizeDeps: {
    include: ['jspdf', 'jspdf-autotable']
  },build: {
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
