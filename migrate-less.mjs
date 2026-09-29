import { neon } from "@neondatabase/serverless";
import fs from "node:fs";

function loadEnv() {
  const content = fs.readFileSync(".env.local", "utf-8");
  for (const line of content.split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const idx = line.indexOf("=");
    if (idx !== -1) {
      const key = line.slice(0, idx).trim();
      let value = line.slice(idx + 1).trim();
      value = value.replace(/^["']|["']$/g, "");
      process.env[key] = value;
    }
  }
}

async function run() {
  loadEnv();
  const sql = neon(process.env.DATABASE_URL);
  await sql(`ALTER TABLE measurement_items ADD COLUMN IF NOT EXISTS is_less BOOLEAN NOT NULL DEFAULT false`);
  console.log("Column is_less added successfully!");
}

run().catch(console.error);
