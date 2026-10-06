import { defineConfig } from 'astro/config';

// The page renders the piece title as its only <h1>, so the brief's own "# Title" is dropped.
const dropFirstH1 = () => (tree) => {
  const i = tree.children.findIndex((n) => n.type === 'heading' && n.depth === 1);
  if (i >= 0) tree.children.splice(i, 1);
};

// Task lists ("- [ ]") render as disabled checkboxes with no label. A checklist in a brief is a list of
// criteria, not a form, so the box becomes a drawn mark that screen readers skip.
const taskBoxes = () => (tree) => {
  const walk = (node) => {
    node.children?.forEach((child, i) => {
      if (child.type === 'element' && child.tagName === 'input' && child.properties?.type === 'checkbox') {
        node.children[i] = { type: 'element', tagName: 'span', properties: { className: ['task-box'], ariaHidden: 'true' }, children: [] };
      } else walk(child);
    });
  };
  walk(tree);
};

export default defineConfig({
  site: 'https://www.designlounge.live',
  output: 'static',
  devToolbar: { enabled: false },
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'always' },
  markdown: {
    remarkPlugins: [dropFirstH1],
    rehypePlugins: [taskBoxes],
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark-dimmed' }, defaultColor: false },
  },
  vite: { build: { assetsInlineLimit: 0 } },
});
