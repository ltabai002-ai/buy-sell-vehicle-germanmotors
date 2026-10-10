import { cpSync, mkdirSync, rmSync } from 'node:fs';

// Preserve classic scripts and their global handlers, and include local images.
rmSync('dist', { recursive: true, force: true });
mkdirSync('dist', { recursive: true });
for (const path of ['index.html', 'styles.css', 'script.js', 'image']) {
  cpSync(path, `dist/${path}`, { recursive: true });
}
console.log('Static website packaged into dist.');