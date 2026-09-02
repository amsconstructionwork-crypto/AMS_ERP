// Usage: DATABASE_URL="postgres://..." npm run db:init
// Or add DATABASE_URL to .env.local and just run: npm run db:init
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env.local manually (no extra dependency needed)
function loadEnvLocal() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    value = value.replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL not found. Add it to .env.local or pass it as an env var.");
  process.exit(1);
}

const sql = neon(connectionString);
const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf-8");

// Split on semicolons at end of statements (schema.sql has no semicolons inside strings)
const statements = schema
  .split(/;\s*(?:\n|$)/)
  .map((s) => s.trim())
  .filter(Boolean);

console.log(`Running ${statements.length} statements against your Neon database...`);

for (const stmt of statements) {
  await sql(stmt);
}

console.log("Done! Tables created: quotations, quotation_items");
