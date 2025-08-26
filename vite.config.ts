import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: resolve("node_modules", "@esri", "calcite-components", "dist", "calcite", "assets"),
          dest: ".",
        },
      ],
    }),
  ],
  server: {
    headers: {
      // Content Security Policy - Development Environment
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "img-src 'self' data: https: blob: https://images.unsplash.com",
        "font-src 'self' data: https://fonts.gstatic.com",
        "connect-src 'self' ws://localhost:* wss://localhost:*",
        "media-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        "frame-src 'none'",
        "child-src 'none'",
        "worker-src 'self' blob:",
        "manifest-src 'self'",
        "upgrade-insecure-requests"
      ].join('; '),
      
      // Security Headers
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-DNS-Prefetch-Control': 'off',
      'X-Download-Options': 'noopen',
      'X-Permitted-Cross-Domain-Policies': 'none',
      
      // Cache Control for Security
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    }
  },
  build: {
    // Security settings for production builds
    target: 'es2015',
    minify: 'terser',
    sourcemap: false, // Disable source maps in production for security
    rollupOptions: {
      output: {
        // Add integrity hashes for production builds
        entryFileNames: 'assets/[name]-[hash:8].js',
        chunkFileNames: 'assets/[name]-[hash:8].js',
        assetFileNames: (assetInfo) => {
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name || '')) {
            return `assets/images/[name]-[hash:8].[ext]`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
            return `assets/fonts/[name]-[hash:8].[ext]`;
          }
          return `assets/[name]-[hash:8].[ext]`;
        },
        // Remove comments and debug info
        compact: true,
        // Optimize chunk splitting for better security isolation
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('@esri')) {
              return 'esri-vendor';
            }
            return 'vendor';
          }
        }
      },
      // Security optimizations
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false
      }
    },
    // Additional terser options for security
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true, // Remove debugger statements
        pure_funcs: ['console.log', 'console.info', 'console.debug'], // Remove specific console methods
        passes: 2
      },
      mangle: {
        safari10: true // Ensure Safari compatibility
      },
      format: {
        comments: false // Remove all comments
      }
    }
  }
});
