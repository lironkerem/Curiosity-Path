import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { viteStaticCopy } from 'vite-plugin-static-copy';

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

  plugins: [
    viteStaticCopy({
      targets: [
        // Service worker — lives at root, copy to dist root
        {
          src: 'service-worker.js',
          dest: '.'
        },
        // Features data JSON files — fetched at runtime via fetch()
        {
          src: 'src/Features/Data/*',
          dest: 'src/Features/Data'
        },
        // CommunityHub — all files, loaded via @vite-ignore at runtime
        {
          src: 'src/Mini-Apps/CommunityHub/**/*',
          dest: 'src/Mini-Apps/CommunityHub'
        },
        // SelfAnalysisPro — loader fetches index.html and JS at runtime
        {
          src: 'src/Mini-Apps/SelfAnalysisPro/**/*',
          dest: 'src/Mini-Apps/SelfAnalysisPro'
        },
        // ShadowAlchemyLab — JSON data + JS loaded at runtime
        {
          src: 'src/Mini-Apps/ShadowAlchemyLab/**/*',
          dest: 'src/Mini-Apps/ShadowAlchemyLab'
        },
        // FlipTheScript data files
        {
          src: 'src/Mini-Apps/FlipTheScript/**/*',
          dest: 'src/Mini-Apps/FlipTheScript'
        },
      ]
    })
  ],

  server: {
    port: 3000,
    open: true,
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    manifest: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
});