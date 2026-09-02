import { neon } from "@neondatabase/serverless";

// DATABASE_URL comes from your Neon project's connection string.
// Set it in .env.local for local dev, and in your host's (Vercel) env vars for production.
const connectionString = process.env.DATABASE_URL;

if (!connectionString && process.env.NODE_ENV !== "production") {
  // Only warn during dev/build; API routes check for this themselves before querying.
  console.warn(
    "[db] DATABASE_URL is not set. Add it to .env.local (see README.md)."
  );
}

// `sql` is a tagged-template query function: sql`select * from table where id = ${id}`
export const sql = connectionString ? neon(connectionString) : null;

export function requireDb() {
  if (!sql) {
    throw new Error(
      "DATABASE_URL is not configured. Add your Neon connection string to .env.local or your deployment's environment variables."
    );
  }
  return sql;
}
