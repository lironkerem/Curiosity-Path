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
        // CommunityHub — loaded via @vite-ignore dynamic imports at runtime
        { src: 'src/Mini-Apps/CommunityHub', dest: 'src/Mini-Apps' },
        // SelfAnalysisPro — loader fetches index.html and JS files at runtime
        { src: 'src/Mini-Apps/SelfAnalysisPro', dest: 'src/Mini-Apps' },
        // ShadowAlchemyLab JSON data — fetched at runtime
        {
          src: 'src/Mini-Apps/ShadowAlchemyLab/js/engines/archetypes_data.json',
          dest: 'src/Mini-Apps/ShadowAlchemyLab/js/engines'
        },
        // Features data files — fetched at runtime via fetch()
        { src: 'src/Features/Data', dest: 'src/Features' },
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