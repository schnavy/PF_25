// @ts-check
import { defineConfig } from 'astro/config';
import rehypeTitleFigure from 'rehype-title-figure';

// https://astro.build/config
export default defineConfig({
  markdown: {
    rehypePlugins: [rehypeTitleFigure]
  }
});
