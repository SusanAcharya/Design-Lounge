import { defineConfig } from 'astro/config';

// The page renders the piece title as its only <h1>, so the brief's own "# Title" is dropped.
const dropFirstH1 = () => (tree) => {
  const i = tree.children.findIndex((n) => n.type === 'heading' && n.depth === 1);
  if (i >= 0) tree.children.splice(i, 1);
};

export default defineConfig({
  site: 'https://www.designlounge.live',
  output: 'static',
  devToolbar: { enabled: false },
  trailingSlash: 'never',
  build: { format: 'file' },
  markdown: {
    remarkPlugins: [dropFirstH1],
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark-dimmed' }, defaultColor: false },
  },
  vite: { build: { assetsInlineLimit: 0 } },
});
