import z from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'test', 'production']),
  DATABASE_URL: z.url().startsWith('postgresql://'),
});

export const env = envSchema.parse(process.env);
