import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(16),
  BACKEND_PORT: z.string().default('3001').transform(Number),
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:5173,http://localhost:3000')
    .transform((str) => str.split(',').map((origin) => origin.trim())),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validate(config: Record<string, unknown>) {
  const parsed = envSchema.safeParse(config);

  if (!parsed.success) {
    console.error(
      '❌ Configuração de ambiente inválida:',
      parsed.error.format(),
    );
    throw new Error('Configuração de ambiente inválida');
  }

  return parsed.data;
}
