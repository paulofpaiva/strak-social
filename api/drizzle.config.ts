import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: [
    './src/schemas/auth.ts',
    './src/schemas/posts.ts',
    './src/schemas/comments.ts',
    './src/schemas/likes.ts',
  ],
  out: './drizzle',
  dialect: 'postgresql',
  schemaFilter: ['strak_social'],
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  strict: false,
});
