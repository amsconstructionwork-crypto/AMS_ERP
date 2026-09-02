const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function clean() {
  const all = await sql`SELECT id, doc_number FROM quotations ORDER BY id ASC`;
  console.log("All quotations:", all);
  
  // Delete all quotations except IDs 4, 5, 6, 7
  const idsToDelete = all.map(q => q.id).filter(id => ![4,5,6,7].includes(id));
  if (idsToDelete.length > 0) {
    await sql`DELETE FROM quotation_items WHERE quotation_id = ANY(${idsToDelete})`;
    await sql`DELETE FROM quotations WHERE id = ANY(${idsToDelete})`;
    console.log("Deleted IDs:", idsToDelete);
  } else {
    console.log("No old quotations found to delete.");
  }
}

clean().catch(console.error);
