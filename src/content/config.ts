import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    year: z.number(),
    collaborators: z.array(z.string()).default([]),
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