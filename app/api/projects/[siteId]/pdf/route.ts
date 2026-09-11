import { NextRequest, NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import SiteBalanceSheetPdf from "@/components/SiteBalanceSheetPdf";
import { getSiteById, getSiteBills, getSitePayments } from "@/lib/actions/projects";
import fs from "node:fs";
import path from "node:path";

// Required for Node.js streaming compatibility in Next.js
export const dynamic = "force-dynamic";

let cachedLogoBase64: string | null = null;
function getLogoBase64() {
  if (cachedLogoBase64) return cachedLogoBase64;
  const logoPath = path.join(process.cwd(), "public", "logo.png");
  if (fs.existsSync(logoPath)) {
    const buf = fs.readFileSync(logoPath);
    cachedLogoBase64 = `data:image/png;base64,${buf.toString("base64")}`;
  } else {
    cachedLogoBase64 = "";
  }
  return cachedLogoBase64;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { siteId: string } }
) {
  try {
    const siteId = parseInt(params.siteId);
    if (isNaN(siteId)) {
      return new NextResponse("Invalid Site ID", { status: 400 });
    }

    const site = await getSiteById(siteId);
    if (!site) {
      return new NextResponse("Site not found", { status: 404 });
    }

    const bills = await getSiteBills(siteId);
    const payments = await getSitePayments(siteId);
    const logoBase64 = getLogoBase64();

    const stream = await renderToStream(
      SiteBalanceSheetPdf({ site, bills, payments, logoBase64 })
    );

    const safeName = site.name.replace(/[^a-zA-Z0-9-]/g, "_");
    const filename = `Balance_Sheet_${safeName}.pdf`;

    return new NextResponse(stream as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return new NextResponse("Error generating PDF", { status: 500 });
  }
}
