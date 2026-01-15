import { neon, NeonQueryFunction } from '@neondatabase/serverless';

// Create a SQL query function
// In production, DATABASE_URL comes from environment
// For development without Neon, we'll use local JSON data

let sql: NeonQueryFunction<false, false> | null = null;

if (process.env.DATABASE_URL) {
  sql = neon(process.env.DATABASE_URL);
}

export { sql };

// Helper for parameterized queries once Neon is configured
export async function query<T>(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<T[]> {
  if (!sql) {
    throw new Error('Database not configured. Set DATABASE_URL environment variable.');
  }

  const result = await sql(strings, ...values);
  return result as T[];
}
