import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Berita/artikel — dikelola lewat dashboard /admin (folder src/content/news)
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.string().default('Kegiatan'),
    thumbnail: z.string().optional(),
    excerpt: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

// Galeri foto — satu file JSON per foto (folder src/content/gallery)
const gallery = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/gallery' }),
  schema: z.object({
    title: z.string(),
    image: z.string(),
    date: z.coerce.date(),
    caption: z.string().optional(),
  }),
});

export const collections = { news, gallery };
