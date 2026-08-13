import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'content',
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
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
  }),
});

export const collections = {
  'projects': projectsCollection,
  'sections': sectionsCollection,
};