const { Pool } = require('@neondatabase/serverless');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function main() {
  try {
    const res = await pool.query('DELETE FROM quotations WHERE doc_number = $1 RETURNING id', ['AMS-QT-0007']);
    console.log(`Deleted ${res.rowCount} row(s) with doc_number AMS-QT-0007. Returned ID(s):`, res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
