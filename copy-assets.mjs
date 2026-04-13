import { cpSync, readdirSync, unlinkSync } from 'fs';

const copies = [
  // [source, destination]
  ['service-worker.js',              'dist/service-worker.js'],
  ['src/Mini-Apps/SelfAnalysisPro',  'dist/src/Mini-Apps/SelfAnalysisPro'],
];

for (const [src, dest] of copies) {
  try {
    cpSync(src, dest, { recursive: true });
    console.log(`✓ Copied ${src} → ${dest}`);
  } catch (e) {
    console.error(`✗ Failed ${src}: ${e.message}`);
  }
}

// Remove stale Vite build manifest from dist/assets/
try {
  const files = readdirSync('dist/assets');
  for (const f of files) {
    if (f.startsWith('manifest-') && f.endsWith('.json')) {
      unlinkSync(`dist/assets/${f}`);
      console.log(`✓ Deleted stale build manifest: dist/assets/${f}`);
    }
  }
} catch (e) {
  console.error(`✗ Failed to clean stale manifest: ${e.message}`);
}
