import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import nodemailer from "nodemailer";
import { requireDb } from "@/lib/db";
import QuotationPdf from "@/components/QuotationPdf";
import type { Quotation } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

let cachedLogoBase64: string | null = null;
function getLogoBase64() {
  if (cachedLogoBase64) return cachedLogoBase64;
  const logoPath = path.join(process.cwd(), "public", "logo.png");
  const buf = fs.readFileSync(logoPath);
  cachedLogoBase64 = `data:image/png;base64,${buf.toString("base64")}`;
  return cachedLogoBase64;
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = await req.json();
    const { to, subject, html } = body;

    if (!to) {
      return NextResponse.json({ error: "Recipient email is required" }, { status: 400 });
    }

    const sql = requireDb();
    const qRows = await sql(`SELECT * FROM quotations WHERE id = $1`, [id]);
    if (qRows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const items = await sql(
      `SELECT description, unit, qty, rate FROM quotation_items WHERE quotation_id = $1 ORDER BY position ASC`,
      [id]
    );

    const quotation = { ...qRows[0], items } as unknown as Quotation;
    const logoBase64 = getLogoBase64();

    // 1. Generate PDF Buffer
    const buffer = await renderToBuffer(
      React.createElement(QuotationPdf, { quotation, logoBase64 }) as any
    );

    // 2. Setup Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      }
    });

    // 3. Send Email
    const info = await transporter.sendMail({
      from: `"AMS Civil Construction" <${process.env.EMAIL_USER}>`,
      to,
      subject: subject || `AMS Civil Construction - ${quotation.doc_type === 'bill' ? 'Bill' : 'Quotation'} ${quotation.doc_number}`,
      html: html || `<p>Please find the attached document.</p>`,
      attachments: [
        {
          filename: `${quotation.doc_number}.pdf`,
          content: Buffer.from(buffer),
          contentType: 'application/pdf'
        }
      ]
    });

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (err: any) {
    console.error("Email error:", err);
    return NextResponse.json({ error: err.message ?? "Failed to send email" }, { status: 500 });
  }
}
