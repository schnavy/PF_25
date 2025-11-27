// @ts-check
import {defineConfig} from 'astro/config';
import rehypeTitleFigure from 'rehype-title-figure';
import rehypeRaw from 'rehype-raw';

// https://astro.build/config
export default defineConfig({
    markdown: {
        remarkRehype: {
            allowDangerousHtml: true
        },
        // @ts-expect-error - rehype-title-figure uses older unified types
        rehypePlugins: [
            rehypeRaw, // Process HTML and markdown inside it
            rehypeTitleFigure
        ]
    },
    site: 'https://schnavy.github.io/',
    base: '/PF_25/',
});
