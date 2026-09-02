const { neon } = require("@neondatabase/serverless");
require("dotenv").config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

async function run() {
  const result = await sql`
    UPDATE quotations
    SET notes = REPLACE(
      notes, 
      'Note: Cells shaded in pale orange are for you to fill in (client details, item descriptions, quantities & rates). Amount, Subtotal and Grand Total calculate automatically', 
      ''
    )
    WHERE notes LIKE '%pale orange%';
  `;
  console.log("Updated", result.length, "rows");
}

run().catch(console.error);
