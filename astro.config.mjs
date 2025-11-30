// @ts-check
import {defineConfig} from 'astro/config';
import rehypeTitleFigure from 'rehype-title-figure';
import rehypeRaw from 'rehype-raw';
import rehypeExternalLinks from 'rehype-external-links';

// https://astro.build/config
export default defineConfig({
    markdown: {
        remarkRehype: {
            allowDangerousHtml: true
        },
        rehypePlugins: [
            rehypeRaw, // Process HTML and markdown inside it
            // @ts-ignore
            rehypeTitleFigure,
            [rehypeExternalLinks, { target: '_blank' }]
        ]
    },
    site: 'https://davidwahrenburg.de/',
});
