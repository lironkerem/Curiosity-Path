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
          if (id.includes('node_modules/@supabase')) return 'supabase';

          // Core shared files — never group into community-hub
          if (id.includes('src/Core/')) return undefined;

          // CommunityHub sub-chunks — must come BEFORE the catch-all rule
          if (id.includes('CommunityHub/js/Solar')) return 'community-solar';
          if (id.includes('CommunityHub/js/Lunar')) return 'community-lunar';
          if (id.includes('CommunityHub/js/Rooms')) return 'community-rooms';

          // Remaining CommunityHub files → main lazy chunk
          if (id.includes('Mini-Apps/CommunityHub')) return 'community-hub';

          if (
            id.includes('TarotVisionAI') ||
            id.includes('ChatBotAI') ||
            id.includes('ShadowAlchemyLab') ||
            id.includes('FlipTheScript')
          ) return 'features-lazy';

          if (id.includes('SelfAnalysisPro')) return 'self-analysis';
        },
      },
    },
  },
});