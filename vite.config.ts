import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            if (id.includes('@reduxjs') || id.includes('react-redux')) {
              return 'redux-vendor';
            }
            if (id.includes('@apollo') || id.includes('graphql')) {
              return 'apollo-vendor';
            }
            if (id.includes('lucide-react') || id.includes('react-webcam')) {
              return 'ui-vendor';
            }
            // All other node_modules
            return 'vendor';
          }
          
          // Feature-based chunks
          if (id.includes('features/auth') || id.includes('pages/auth')) {
            return 'auth';
          }
          if (id.includes('features/students') || id.includes('pages/student')) {
            return 'student';
          }
          if (id.includes('pages/dashboard')) {
            return 'dashboard';
          }
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 600,
    // Enable source maps for production debugging (optional)
    sourcemap: false,
  },
})
