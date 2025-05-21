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
        // Use environment variable to switch between local and remote API
        target: process.env.USE_LOCAL_API === 'true' 
          ? 'http://localhost:5000' 
          : 'https://community-empowerment-hub-313ac18da07a.herokuapp.com',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost',
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Set correct origin header for CORS
            const target = process.env.USE_LOCAL_API === 'true'
              ? 'http://localhost:5000'
              : 'https://community-empowerment-hub-313ac18da07a.herokuapp.com';
            proxyReq.setHeader('origin', target);
            
            // Log proxy requests in development
            if (process.env.NODE_ENV !== 'production') {
              console.log(`Proxying ${req.method} ${req.url} → ${target}${req.url}`);
            }
          });
          
          // Handle proxy errors
          proxy.on('error', (err, req, res) => {
            console.error('Proxy error:', err);
            res.writeHead(500, {
              'Content-Type': 'text/plain'
            });
            res.end(`Proxy error: ${err.message}`);
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
