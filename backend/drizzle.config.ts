import { defineConfig, type Config } from 'drizzle-kit';

const config: Config = defineConfig({
  dialect: 'postgresql',
  schema: './src/common/database/schemas/*.schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
});

export default config;
