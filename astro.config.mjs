// @ts-check
import {defineConfig} from 'astro/config';
import {satteri} from '@astrojs/markdown-satteri';

// Sätteri (Astro's default Rust-backed markdown processor) doesn't run
// unified/rehype plugins - it has its own visitor-based hastPlugin API where
// Rust only hands matched elements across to JS. Raw HTML in markdown (the
// <br/>s etc. used throughout the project descriptions) already passes
// through natively with no plugin needed. This one replaces
// rehype-external-links: mark http(s) links external so they open in a new
// tab and pick up the "external link" arrow (see a[target="_blank"]::after
// in style.css). mailto:/relative/anchor links are left alone, matching the
// old rehype-external-links config.
const externalLinks = {
    name: 'external-links',
    element: {
        filter: ['a'],
        visit(node, ctx) {
            const href = node.properties?.href;
            if (typeof href === 'string' && /^https?:\/\//.test(href)) {
                ctx.setProperty(node, 'target', '_blank');
                ctx.setProperty(node, 'rel', 'noopener noreferrer');
            }
        }
    }
};

// https://astro.build/config
export default defineConfig({
    markdown: {
        processor: satteri({
            hastPlugins: [externalLinks]
        })
    },
    site: 'https://davidwahrenburg.de/',
});
