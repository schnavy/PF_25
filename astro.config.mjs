// @ts-check
import {defineConfig} from 'astro/config';
import rehypeTitleFigure from 'rehype-title-figure';

// https://astro.build/config
export default defineConfig({
    markdown: {
        // @ts-expect-error - rehype-title-figure uses older unified types
        rehypePlugins: [rehypeTitleFigure]
    },
    site: 'http://schnavy.github.io/',
    base: '/PF_25',
});
