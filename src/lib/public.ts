import path from 'node:path';

// A file in public/, for checks at build time. Astro runs the build from the project root, and the bundler moves
// compiled pages elsewhere, so a path relative to import.meta.url no longer points at public/.
export const publicFile = (rel: string) => path.join(process.cwd(), 'public', rel);
