import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  root: '.',
  publicDir: 'public',

  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '/Core/':       resolve(__dirname, './src/Core/'),
      '/Features/':   resolve(__dirname, './src/Features/'),
      '/Mini-Apps/':  resolve(__dirname, './src/Mini-Apps/'),
      '/CSS/':        resolve(__dirname, './src/styles/'),
    },
  },

  server: {
    port: 3000,
    open: true,
  },

  plugins: [
    {
      name: 'fix-manifest-link',
      enforce: 'post',
      transformIndexHtml(html) {
        return html.replace(
          /<link rel="manifest" href="\/assets\/[^"]+\.json">/,
          '<link rel="manifest" href="/manifest.json">'
        );
      }
    }
  ],

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: 'hidden',
    manifest: false,
    cssCodeSplit: true,

    // Raise warning threshold — our chunks are intentionally split
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        // Deterministic file names — improves CDN/browser caching
        entryFileNames:  'assets/[name]-[hash].js',
        chunkFileNames:  'assets/[name]-[hash].js',
        assetFileNames:  'assets/[name]-[hash][extname]',

        manualChunks(id) {
          // ── Vendor: Supabase ────────────────────────────────────────────────
          if (id.includes('node_modules/@supabase')) return 'supabase';

          // ── Core shared files — let Rollup decide (no forced chunk) ─────────
          if (id.includes('src/Core/')) return undefined;

          // ── CommunityHub sub-chunks (must precede catch-all) ────────────────
          if (id.includes('CommunityHub/js/Solar')) return 'community-solar';
          if (id.includes('CommunityHub/js/Lunar')) return 'community-lunar';
          if (id.includes('CommunityHub/js/Rooms')) return 'community-rooms';

          // ── Remaining CommunityHub → lazy chunk ─────────────────────────────
          if (id.includes('Mini-Apps/CommunityHub')) return 'community-hub';

          // ── Other deferred features ─────────────────────────────────────────
          if (
            id.includes('TarotVisionAI') ||
            id.includes('ChatBotAI') ||
            id.includes('ShadowAlchemyLab') ||
            id.includes('FlipTheScript')
          ) return 'features-lazy';

          if (id.includes('SelfAnalysisPro')) return 'self-analysis';

          // ── CSS chunks: split user-tab and community from main ───────────────
          if (id.includes('user-tab-styles')) return 'css-user-tab';
          if (id.includes('community-hub.css')) return 'css-community';
        },
      },
    },
  },
});