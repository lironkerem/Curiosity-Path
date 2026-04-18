import { cpSync, readdirSync, unlinkSync } from 'fs';

const copies = [
  // [source, destination]
  ['src/Mini-Apps/SelfAnalysisPro', 'dist/src/Mini-Apps/SelfAnalysisPro'],
  // Note: service-worker.js is automatically handled by Vite via the public/ folder
];

for (const [src, dest] of copies) {
  try {
    cpSync(src, dest, { recursive: true });
    console.log(`✓ Copied ${src} → ${dest}`);
  } catch (e) {
    console.error(`✗ Failed to copy ${src}: ${e.message}`);
  }
}

// Clean up stale Vite build manifests
try {
  const files = readdirSync('dist/assets');
  for (const f of files) {
    if (f.startsWith('manifest-') && f.endsWith('.json')) {
      unlinkSync(`dist/assets/${f}`);
      console.log(`✓ Deleted stale build manifest: dist/assets/${f}`);
    }
  }
} catch (e) {
  // dist/assets may not exist yet on first build
  if (e.code !== 'ENOENT') {
    console.error(`✗ Failed to clean stale manifest: ${e.message}`);
  }
}