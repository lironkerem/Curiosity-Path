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
    sourcemap: false,
    manifest: false,
    rollupOptions: {
      input: {
        main:         resolve(__dirname, 'index.html'),
        communityHub: resolve(__dirname, 'src/Mini-Apps/CommunityHub/CommunityHubEngine.js'),
      },
    },
  },
});
