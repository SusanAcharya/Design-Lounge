import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

// The builds under /built are other agents' sites, served as they were made. Vercel's clean URLs send
// /built/x/index.html to /built/x with no trailing slash, so their relative "styles.css" and "main.js" resolve
// one folder up and 404. In the deployed copy only, make those attribute paths absolute. The files in
// public/built stay as the runs produced them, and in-page anchors are untouched (a <base> tag would turn
// every "#id" link into a reload).
const absoluteBuiltAssets = () => ({
  name: 'absolute-built-assets',
  hooks: {
    'astro:build:done': ({ dir }) => {
      const root = path.join(fileURLToPath(dir), 'built');
      if (!fs.existsSync(root)) return;
      const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
      for (const file of walk(root).filter((f) => f.endsWith('.html'))) {
        const folder = '/' + path.relative(fileURLToPath(dir), path.dirname(file)).split(path.sep).join('/') + '/';
        const html = fs.readFileSync(file, 'utf8');
        const out = html.replace(/\b(href|src|poster)="(?![#/]|[a-z][a-z0-9+.-]*:)([^"]+)"/gi, (_, attr, url) => `${attr}="${folder}${url.replace(/^\.\//, '')}"`);
        if (out !== html) fs.writeFileSync(file, out);
      }
    },
  },
});

// Astro 6 reports the home page's pathname as /index.html under build.format 'file'. Vercel Analytics reads it from
// the data-pathname attribute its component writes, so put the home page back to "/" and keep its page views in one row.
const homeAnalyticsPath = () => ({
  name: 'home-analytics-path',
  hooks: {
    'astro:build:done': ({ dir }) => {
      const file = path.join(fileURLToPath(dir), 'index.html');
      if (!fs.existsSync(file)) return;
      const html = fs.readFileSync(file, 'utf8');
      fs.writeFileSync(file, html.replace('data-pathname="/index.html"', 'data-pathname="/"'));
    },
  },
});

export default defineConfig({
  integrations: [absoluteBuiltAssets(), homeAnalyticsPath()],
  site: 'https://www.designlounge.live',
  output: 'static',
  devToolbar: { enabled: false },
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'always' },
  // Astro 7 drops the whitespace between inline elements by default ('jsx'). Keep the v5 output.
  compressHTML: true,
  markdown: {
    // Astro 7's default Markdown processor is Sätteri. The briefs use these two remark and rehype plugins, so keep unified.
    processor: unified({ remarkPlugins: [dropFirstH1], rehypePlugins: [taskBoxes] }),
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark-dimmed' }, defaultColor: false, langAlias: { svg: 'xml' } },
  },
  vite: { build: { assetsInlineLimit: 0 } },
});
