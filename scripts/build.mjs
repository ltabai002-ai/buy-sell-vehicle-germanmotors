import './prepare-public.mjs';
import { spawnSync } from 'node:child_process';
// Preserve classic public handlers and image paths while packaging secure app routes.
const result = spawnSync('bunx', ['vite', 'build'], { stdio: 'inherit' });
process.exit(result.status ?? 1);