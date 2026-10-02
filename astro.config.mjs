import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://designlounge.vercel.app',
  output: 'static',
  devToolbar: { enabled: false },
  trailingSlash: 'never',
  build: { format: 'file' },
  markdown: {
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark-dimmed' }, defaultColor: false },
  },
  vite: { build: { assetsInlineLimit: 0 } },
});
