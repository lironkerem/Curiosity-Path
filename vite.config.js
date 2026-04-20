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
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks(id) {
          // ── Vendor ──────────────────────────────────────────────────────────
          if (id.includes('node_modules/@supabase'))    return 'supabase';

          // ── Community Hub (largest chunk — lazy loaded) ──────────────────
          if (id.includes('CommunityHub'))              return 'community';

          // ── Mini-Apps ────────────────────────────────────────────────────
          if (id.includes('ShadowAlchemyLab'))          return 'shadow-alchemy';
          if (id.includes('FlipTheScript'))             return 'flip-script';
          if (id.includes('SelfAnalysisPro'))           return 'calculator';

          // ── Features ─────────────────────────────────────────────────────
          if (id.includes('Features/TarotEngine') ||
              id.includes('Features/TarotVision')) return 'tarot';
          if (id.includes('Features/ChatBot'))          return 'chatbot';
          if (id.includes('Features/KarmaShop'))        return 'karma-shop';
          if (id.includes('Features/Journal'))          return 'journal';
          if (id.includes('Features/Meditations'))      return 'meditations';
          if (id.includes('Features/ShadowAlchemy'))    return 'shadow-alchemy';
          if (id.includes('Features/Happiness'))        return 'happiness';
          if (id.includes('Features/Gratitude'))        return 'gratitude';
          if (id.includes('Features/EnergyTracker'))    return 'energy';
        },
      },
    },
  },
});
