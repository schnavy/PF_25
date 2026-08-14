import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// generateId keeps ids exactly as they were under the old legacy content
// collections (the raw file path relative to the collection folder,
// extension included, e.g. "intro.md" or "<project-slug>/desc.md") so the
// rest of the codebase (entry.id.split('/')[0], entry.id === 'intro.md')
// doesn't need to change.
const projectsCollection = defineCollection({
  loader: glob({
    pattern: '*/desc.md',
    base: './src/content/projects',
    generateId: ({ entry }) => entry,
  }),
  schema: z.object({
    title: z.string(),
    year: z.number(),
    medium: z.string().optional(),
    // Written as a markdown link, e.g. "[Visit Web Version](https://...)",
    // rendered as a normal link on the detail page.
    url: z.string().optional(),
    collaborators: z.array(z.string()).default([]),
    // Whether the project is listed in the home page's project list and
    // gets a "?" mark on the curtain, linking to its detail page.
    showDetails: z.boolean().default(true),
  }),
});

const sectionsCollection = defineCollection({
  loader: glob({
    pattern: '*.md',
    base: './src/content/sections',
    generateId: ({ entry }) => entry,
  }),
  schema: z.object({
    title: z.string().optional(),
  }),
});

export const collections = {
  'projects': projectsCollection,
  'sections': sectionsCollection,
};
