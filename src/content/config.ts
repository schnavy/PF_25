import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    url: z.string().optional().default(""),
    hasImages: z.boolean().default(false),
    showImages: z.boolean().default(true),
    tags: z.array(z.string()).default([]),
    year: z.number(),
    order: z.number().default(999), // For custom sorting
    active: z.boolean().default(true), // Show/hide project
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