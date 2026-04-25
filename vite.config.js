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
          // Supabase → own chunk
          if (id.includes('node_modules/@supabase')) return 'supabase';

          // active-members → isolated small chunk (used by Dashboard widget)
          // Must be defined BEFORE the broad community-hub rule
          if (id.includes('CommunityHub/js/active-members')) return 'active-members';

          // Full CommunityHub (all other files) → own lazy chunk
          if (id.includes('Mini-Apps/CommunityHub')) return 'community-hub';

          // Heavy features → deferred chunk
          if (
            id.includes('TarotVisionAI') ||
            id.includes('ChatBotAI') ||
            id.includes('ShadowAlchemyLab') ||
            id.includes('FlipTheScript')
          ) return 'features-lazy';

          // SelfAnalysisPro → own chunk
          if (id.includes('SelfAnalysisPro')) return 'self-analysis';
        },
      },
    },
  },
});