import { cpSync, readdirSync, unlinkSync } from 'fs';

const copies = [
  // [source, destination]
  ['service-worker.js',              'dist/service-worker.js'],
  ['src/Features/Data',              'dist/src/Features/Data'],
  ['src/Mini-Apps/CommunityHub',     'dist/src/Mini-Apps/CommunityHub'],
  ['src/Mini-Apps/SelfAnalysisPro',  'dist/src/Mini-Apps/SelfAnalysisPro'],
  ['src/Mini-Apps/ShadowAlchemyLab', 'dist/src/Mini-Apps/ShadowAlchemyLab'],
  ['src/Mini-Apps/FlipTheScript',    'dist/src/Mini-Apps/FlipTheScript'],
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
