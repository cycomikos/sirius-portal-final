import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Fix React plugin preamble detection issues
      include: "**/*.{jsx,tsx}",
      babel: {
        plugins: [],
        presets: []
      }
    }),
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
      // Development CSP - More permissive for Vite dev server
      'Content-Security-Policy': [
        "default-src 'self'",
        // Allow unsafe-inline for development (Vite needs this)
        "script-src 'self' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net 'unsafe-inline' 'unsafe-eval'",
        // Style sources - allow unsafe-inline for development
        "style-src 'self' https://fonts.googleapis.com 'unsafe-inline'",
        // Image sources - allow all for development flexibility
        "img-src 'self' data: https: http:",
        // Font sources
        "font-src 'self' data: https://fonts.gstatic.com",
        // Connection sources for development (WebSocket, HMR)
        "connect-src 'self' ws://localhost:* wss://localhost:* https://cdnjs.cloudflare.com https://images.unsplash.com",
        // Media sources
        "media-src 'self'",
        // Disable objects
        "object-src 'none'",
        // Base URI restrictions
        "base-uri 'self'",
        // Form action restrictions
        "form-action 'self'",
        // Worker sources
        "worker-src 'self' blob:",
        // Manifest sources
        "manifest-src 'self'"
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
        // Simplified chunk splitting to avoid initialization issues
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'esri-vendor': ['@esri/calcite-components-react']
        }
      },
      // Simplified treeshaking to avoid initialization issues
      treeshake: {
        moduleSideEffects: true
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
