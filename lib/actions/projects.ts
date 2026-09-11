"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";

function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  return neon(process.env.DATABASE_URL);
}

// ==========================================
// SITES
// ==========================================

export async function getSites() {
  const sql = getSql();
  // Fetch sites with their balance
  // Balance = sum(bills) - sum(payments)
  const rows = await sql`
    SELECT 
      s.id, 
      s.name, 
      s.client_name, 
      s.address,
      COALESCE((SELECT SUM(amount) FROM site_bills WHERE site_id = s.id), 0) AS total_billed,
      COALESCE((SELECT SUM(amount) FROM site_payments WHERE site_id = s.id), 0) AS total_received
    FROM sites s
    ORDER BY s.created_at DESC
  `;
  return rows.map((r: any) => ({
    ...r,
    pending_balance: Number(r.total_billed) - Number(r.total_received)
  }));
}

export async function getSiteById(id: number) {
  const sql = getSql();
  const rows = await sql`
    SELECT 
      s.id, 
      s.name, 
      s.client_name, 
      s.address,
      COALESCE((SELECT SUM(amount) FROM site_bills WHERE site_id = s.id), 0) AS total_billed,
      COALESCE((SELECT SUM(amount) FROM site_payments WHERE site_id = s.id), 0) AS total_received
    FROM sites s
    WHERE s.id = ${id}
  `;
  if (rows.length === 0) return null;
  const r = rows[0] as any;
  return {
    ...r,
    pending_balance: Number(r.total_billed) - Number(r.total_received)
  };
}

export async function createSite(formData: FormData) {
  const sql = getSql();
  const name = formData.get("name") as string;
  const client_name = (formData.get("client_name") as string) || "";
  const address = (formData.get("address") as string) || "";

  if (!name) throw new Error("Site name is required");

  await sql`
    INSERT INTO sites (name, client_name, address)
    VALUES (${name}, ${client_name}, ${address})
  `;
  revalidatePath("/projects");
}

// ==========================================
// BILLS
// ==========================================

export async function getSiteBills(siteId: number) {
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM site_bills 
    WHERE site_id = ${siteId} 
    ORDER BY bill_date DESC, created_at DESC
  `;
  return rows;
}

export async function createSiteBill(siteId: number, formData: FormData) {
  const sql = getSql();
  const bill_date = formData.get("bill_date") as string;
  const bill_number = formData.get("bill_number") as string;
  const description = (formData.get("description") as string) || "";
  const work_area = (formData.get("work_area") as string) || "";
  const amount = Number(formData.get("amount"));

  if (!bill_number) throw new Error("Bill number is required");
  if (!amount || isNaN(amount)) throw new Error("Valid amount is required");

  await sql`
    INSERT INTO site_bills (site_id, bill_date, bill_number, description, work_area, amount)
    VALUES (${siteId}, ${bill_date}, ${bill_number}, ${description}, ${work_area}, ${amount})
  `;
  revalidatePath(`/projects/${siteId}`);
  revalidatePath("/projects");
}

export async function deleteSiteBill(id: number, siteId: number) {
  const sql = getSql();
  await sql`DELETE FROM site_bills WHERE id = ${id}`;
  revalidatePath(`/projects/${siteId}`);
  revalidatePath("/projects");
}

// ==========================================
// PAYMENTS
// ==========================================

export async function getSitePayments(siteId: number) {
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM site_payments 
    WHERE site_id = ${siteId} 
    ORDER BY payment_date DESC, created_at DESC
  `;
  return rows;
}

export async function createSitePayment(siteId: number, formData: FormData) {
  const sql = getSql();
  const payment_date = formData.get("payment_date") as string;
  const reference_no = (formData.get("reference_no") as string) || "";
  const amount = Number(formData.get("amount"));

  if (!amount || isNaN(amount)) throw new Error("Valid amount is required");

  await sql`
    INSERT INTO site_payments (site_id, payment_date, reference_no, amount)
    VALUES (${siteId}, ${payment_date}, ${reference_no}, ${amount})
  `;
  revalidatePath(`/projects/${siteId}`);
  revalidatePath("/projects");
}

export async function deleteSitePayment(id: number, siteId: number) {
  const sql = getSql();
  await sql`DELETE FROM site_payments WHERE id = ${id}`;
  revalidatePath(`/projects/${siteId}`);
  revalidatePath("/projects");
}
