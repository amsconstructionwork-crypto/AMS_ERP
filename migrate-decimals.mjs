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
  await sql(`ALTER TABLE measurement_items ALTER COLUMN no_of_items TYPE NUMERIC(12,3)`);
  await sql(`ALTER TABLE measurement_items ALTER COLUMN length_mm TYPE NUMERIC(12,3)`);
  await sql(`ALTER TABLE measurement_items ALTER COLUMN breadth_mm TYPE NUMERIC(12,3)`);
  await sql(`ALTER TABLE measurement_items ALTER COLUMN depth_mm TYPE NUMERIC(12,3)`);
  console.log("Columns altered successfully!");
}

run().catch(console.error);
