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
  
  // Add summary_items column as JSONB
  await sql(`ALTER TABLE measurements ADD COLUMN IF NOT EXISTS summary_items JSONB DEFAULT '[]'::jsonb`);
  
  console.log("summary_items column added successfully!");
}

run().catch(console.error);
