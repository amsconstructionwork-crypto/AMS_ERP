import React from "react";
import { Document, Page, Text, View, Image, StyleSheet, Font } from "@react-pdf/renderer";
import { Quotation, computeTotals, formatINR } from "@/lib/types";

// In a real app we'd load fonts that support the ₹ symbol, but standard Helvetica 
// doesn't support ₹ well in react-pdf without custom font loading. We'll use 'Rs.' or 
// if a font with ₹ is loaded, we could use it. The request asked for '₹', so we'll use it
// and assume default fonts handle it, or we use Rs. if there are issues. We'll stick to ₹.
// Actually react-pdf default font might render '₹' as a question mark or blank. Let's use it
// since the user specifically asked, but fallback to standard text if needed.

const NAVY = "#0F2138";
const NAVY_LIGHT = "#1E3A5F";
const ORANGE = "#F26430";
const PALE_ORANGE = "#FFF3EE"; // Pale orange for editable cells in screenshot
const CREAM = "#FBF9F6";
const GREY = "#6B7280";
const BORDER = "#D6DCE4";

const styles = StyleSheet.create({
  page: { fontSize: 9, color: NAVY, paddingBottom: 60, padding: 20 },
  
  // Header
  topBorder: { height: 10, backgroundColor: ORANGE, width: "100%" },
  headerBar: { backgroundColor: NAVY, paddingHorizontal: 20, paddingVertical: 14, flexDirection: "row", alignItems: "center", borderLeftWidth: 1, borderRightWidth: 1, borderColor: NAVY },
  logoBox: { width: 44, height: 44, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", marginRight: 10 },
  logo: { width: 34, height: 34 },
  companyName: { fontSize: 18, color: "#fff", fontWeight: 700 },
  tagline: { fontSize: 8, color: ORANGE, marginTop: 2, fontStyle: "italic" },
  docTypeBox: { marginLeft: "auto", alignItems: "flex-end" },
  docType: { fontSize: 16, color: ORANGE, fontWeight: 700, letterSpacing: 1 },
  docSub: { fontSize: 8, color: "#fff", marginTop: 2, fontStyle: "italic" },
  
  // Contact strip
  contactStrip: { backgroundColor: "#fff", borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: NAVY, paddingVertical: 4, paddingHorizontal: 20, flexDirection: "row", justifyContent: "center", fontSize: 8, color: NAVY },
  
  body: { paddingTop: 4 },

  // Details Section
  metaRow: { flexDirection: "row" },
  metaCol: { flex: 1 },
  sectionBanner: { backgroundColor: NAVY, color: "#fff", fontSize: 9, fontWeight: 700, paddingVertical: 4, paddingHorizontal: 6 },
  metaLine: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: BORDER, borderLeftWidth: 1, borderRightWidth: 1, borderRightColor: BORDER, borderLeftColor: BORDER },
  metaLabel: { width: 90, fontSize: 8.5, fontWeight: 700, color: NAVY, padding: 4, backgroundColor: "#F9FAFB", borderRightWidth: 1, borderRightColor: BORDER },
  metaValue: { fontSize: 8.5, color: NAVY, flex: 1, padding: 4 },

  // Table
  table: { marginTop: 4, borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: NAVY },
  tHeadRow: { flexDirection: "row", backgroundColor: NAVY },
  tRow: { flexDirection: "row", borderTopWidth: 1, borderTopColor: BORDER },
  cSr: { width: "8%", padding: 5, fontSize: 8.5, textAlign: "center", borderRightWidth: 1, borderRightColor: BORDER },
  cDesc: { width: "42%", padding: 5, fontSize: 8.5, borderRightWidth: 1, borderRightColor: BORDER },
  cUnit: { width: "10%", padding: 5, fontSize: 8.5, textAlign: "center", borderRightWidth: 1, borderRightColor: BORDER },
  cQty: { width: "10%", padding: 5, fontSize: 8.5, textAlign: "center", borderRightWidth: 1, borderRightColor: BORDER },
  cRate: { width: "15%", padding: 5, fontSize: 8.5, textAlign: "right", borderRightWidth: 1, borderRightColor: BORDER },
  cAmt: { width: "15%", padding: 5, fontSize: 8.5, textAlign: "right" },
  thText: { color: "#fff", fontSize: 8.5, fontWeight: 700, textAlign: "center", borderRightWidth: 0 },
  
  // Table Data Cells
  tdDesc: { width: "42%", padding: 5, fontSize: 8.5, borderRightWidth: 1, borderRightColor: BORDER },
  tdUnit: { width: "10%", padding: 5, fontSize: 8.5, textAlign: "center", borderRightWidth: 1, borderRightColor: BORDER },
  tdQty: { width: "10%", padding: 5, fontSize: 8.5, textAlign: "center", borderRightWidth: 1, borderRightColor: BORDER },
  tdRate: { width: "15%", padding: 5, fontSize: 8.5, textAlign: "right", borderRightWidth: 1, borderRightColor: BORDER },
  tdAmt: { width: "15%", padding: 5, fontSize: 8.5, textAlign: "right" },


  // Totals
  subtotalRow: { flexDirection: "row", borderTopWidth: 1, borderTopColor: BORDER },
  subtotalLabel: { width: "85%", padding: 5, fontSize: 8.5, fontWeight: 700, textAlign: "right", borderRightWidth: 1, borderRightColor: BORDER },
  subtotalValue: { width: "15%", padding: 5, fontSize: 8.5, fontWeight: 700, textAlign: "right" },
  
  grandRow: { flexDirection: "row", backgroundColor: NAVY, borderTopWidth: 1, borderTopColor: NAVY },
  grandLabel: { width: "85%", padding: 6, fontSize: 10.5, fontWeight: 700, textAlign: "right", color: "#fff" },
  grandValue: { width: "15%", padding: 6, fontSize: 10.5, fontWeight: 700, textAlign: "right", color: ORANGE },

  termsBanner: { backgroundColor: NAVY, color: "#fff", fontSize: 9, fontWeight: 700, paddingVertical: 4, paddingHorizontal: 6, marginTop: 12 },
  termsBox: { borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: NAVY, padding: 6 },
  termItem: { fontSize: 8, color: NAVY, marginBottom: 4, paddingLeft: 6 },

  signRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 40, paddingHorizontal: 10 },
  signCol: { width: "40%", borderBottomWidth: 1, borderBottomColor: NAVY, paddingBottom: 4, marginBottom: 2 },
  signName: { fontSize: 9, fontWeight: 700, marginBottom: 2 },
  signLabelRow: { flexDirection: "row", justifyContent: "space-between" },
  signLabelAuth: { fontSize: 8, fontWeight: 700 },
  signLabelSmall: { fontSize: 7, color: GREY, fontStyle: "italic" },

  footerBox: { backgroundColor: NAVY, paddingVertical: 4, marginTop: 12 },
  footerText: { color: "#fff", fontSize: 7.5, textAlign: "center", fontStyle: "italic" },
  noteText: { fontSize: 7, color: GREY, fontStyle: "italic", marginTop: 4, paddingHorizontal: 4 },
  
  watermarkContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: -1,
    opacity: 0.08,
    transform: "rotate(-45deg)"
  },
  watermarkLogo: {
    width: 200,
    height: 200,
    marginBottom: 20
  },
  watermarkText: {
    fontSize: 90,
    color: "#001B3D",
    fontWeight: "bold",
    textAlign: "center",
    width: "100%"
  }
});

function fmtDate(d: string | null) {
  if (!d) return "-";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function QuotationPdf({ quotation, logoBase64 }: { quotation: Quotation; logoBase64: string }) {
  const { subtotal, gst, grandTotal } = computeTotals(quotation.items, quotation.gst_percent, quotation.discount);
  const isBill = quotation.doc_type === "bill";

  const defaultBillTerms = [
    "1. Payment Terms: Full payment is due within 7 days from the date of this invoice.",
    "2. Payment Methods: Payments can be made via Cheque in favor of \"AMS Civil Construction\" / \"Kedar Mandal\", or via NEFT/RTGS to the provided bank account. Please verify all details prior to transfer.",
    "3. Warranty: We provide a 1-year workmanship warranty on all completed construction services. Materials supplied are subject to their respective manufacturer's warranty terms and conditions.",
    "4. Jurisdiction: All disputes are subject to Mumbai Jurisdiction.",
    "5. Thank you for choosing AMS Civil Construction!"
  ];

  const defaultQuotationTerms = [
    "1. Payment Terms: 25% on agreement, 35% on foundation completion, 30% on structural completion, 10% on handover (milestone-based).",
    "2. Rates quoted are valid for 30 days from the date of this quotation.",
    "3. 1-Year workmanship warranty on all construction work. Waterproofing carries a 2-year guarantee. Material warranties as per manufacturer terms.",
    "4. Any changes to scope of work will be quoted separately and added to the final bill.",
    "5. Carting Debris Away from Site (Client).",
    "6. Material procurement can be handled by AMS Civil Construction or supplied by client, as mutually agreed."
  ];

  const parsedTerms = quotation.notes 
    ? quotation.notes.split(/\r?\n/).filter(t => t.trim() !== '')
    : (isBill ? defaultBillTerms : defaultQuotationTerms);

  const terms = parsedTerms;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.watermarkContainer} fixed>
          <Image src={logoBase64} style={styles.watermarkLogo} />
          <Text style={styles.watermarkText}>AMS</Text>
        </View>
        <View style={styles.topBorder} />
        <View style={styles.headerBar}>
          <View style={styles.logoBox}>
            <Image src={logoBase64} style={styles.logo} />
          </View>
          <View>
            <Text style={styles.companyName}>AMS CIVIL CONSTRUCTION</Text>
            <Text style={styles.tagline}>Mumbai&apos;s Trusted Construction Partner  |  Since 2001</Text>
          </View>
          <View style={styles.docTypeBox}>
            <Text style={styles.docType}>{isBill ? "BILL" : "QUOTATION"}</Text>
            <Text style={styles.docSub}>Estimate & Proposal</Text>
          </View>
        </View>
        
        <View style={styles.contactStrip}>
          <Text>+91 87793 91690 / +91 90042 98911   |   ams.constructionwork@gmail.com   |   www.amscivilwork.in   |   Mumbai, Maharashtra</Text>
        </View>

        <View style={styles.body}>
          <View style={styles.metaRow}>
            <View style={styles.metaCol}>
              <Text style={styles.sectionBanner}>BILL TO</Text>
              <View style={styles.metaLine}>
                <Text style={styles.metaLabel}>Client Name:</Text>
                <Text style={[styles.metaValue, { fontWeight: 700 }]}>{quotation.client_name || "-"}</Text>
              </View>
              <View style={styles.metaLine}>
                <Text style={styles.metaLabel}>Site Address:</Text>
                <Text style={[styles.metaValue, { fontWeight: 700 }]}>{quotation.site_address || "-"}</Text>
              </View>
              <View style={styles.metaLine}>
                <Text style={styles.metaLabel}>Phone:</Text>
                <Text style={styles.metaValue}>{quotation.client_phone || "-"}</Text>
              </View>
              <View style={[styles.metaLine, { borderBottomWidth: 0 }]}>
                <Text style={styles.metaLabel}>Email:</Text>
                <Text style={styles.metaValue}>{quotation.client_email || "-"}</Text>
              </View>
            </View>
            <View style={styles.metaCol}>
              <Text style={styles.sectionBanner}>{isBill ? "BILL DETAILS" : "QUOTATION DETAILS"}</Text>
              <View style={styles.metaLine}>
                <Text style={styles.metaLabel}>{isBill ? "Bill No.:" : "Quotation No.:"}</Text>
                <Text style={styles.metaValue}>{quotation.doc_number}</Text>
              </View>
              <View style={styles.metaLine}>
                <Text style={styles.metaLabel}>Date:</Text>
                <Text style={styles.metaValue}>{fmtDate(quotation.doc_date)}</Text>
              </View>
              {!isBill && (
                <View style={styles.metaLine}>
                  <Text style={styles.metaLabel}>Valid Until:</Text>
                  <Text style={styles.metaValue}>{fmtDate(quotation.valid_until)}</Text>
                </View>
              )}
              <View style={[styles.metaLine, { borderBottomWidth: 0 }]}>
                <Text style={styles.metaLabel}>{isBill ? "Subject / Bill For:" : "Subject / Quotation For:"}</Text>
                <Text style={[styles.metaValue, { fontWeight: 700 }]}>{quotation.project_type || "-"}</Text>
              </View>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tHeadRow}>
              <Text style={[styles.cSr, styles.thText]}>Sr. No.</Text>
              <Text style={[styles.cDesc, styles.thText]}>Description of Work / Item</Text>
              <Text style={[styles.cUnit, styles.thText]}>Unit</Text>
              <Text style={[styles.cQty, styles.thText]}>Qty</Text>
              <Text style={[styles.cRate, styles.thText]}>Rate (Rs)</Text>
              <Text style={[styles.cAmt, styles.thText]}>Amount (Rs)</Text>
            </View>
            
            {quotation.items.map((it, idx) => (
              <View key={idx} style={styles.tRow}>
                <Text style={styles.cSr}>{idx + 1}</Text>
                <Text style={styles.tdDesc}>{it.description}</Text>
                <Text style={styles.tdUnit}>{it.unit}</Text>
                <Text style={styles.tdQty}>{it.qty}</Text>
                <Text style={styles.tdRate}>{formatINR(Number(it.rate))}</Text>
                <Text style={styles.tdAmt}>{formatINR(Number(it.qty) * Number(it.rate))}</Text>
              </View>
            ))}

            <View style={styles.subtotalRow}>
              <Text style={styles.subtotalLabel}>Subtotal</Text>
              <Text style={styles.subtotalValue}>{formatINR(subtotal)}</Text>
            </View>
            {Number(quotation.discount) > 0 && (
              <View style={[styles.subtotalRow, { borderTopWidth: 0 }]}>
                <Text style={styles.subtotalLabel}>Discount</Text>
                <Text style={styles.subtotalValue}>- {formatINR(Number(quotation.discount))}</Text>
              </View>
            )}
            {Number(quotation.gst_percent) > 0 && (
              <View style={[styles.subtotalRow, { borderTopWidth: 0 }]}>
                <Text style={styles.subtotalLabel}>GST ({quotation.gst_percent}%)</Text>
                <Text style={styles.subtotalValue}>{formatINR(gst)}</Text>
              </View>
            )}
            <View style={styles.grandRow}>
              <Text style={styles.grandLabel}>GRAND TOTAL</Text>
              <Text style={styles.grandValue}>{formatINR(grandTotal)}</Text>
            </View>
          </View>

          <Text style={styles.termsBanner}>TERMS & CONDITIONS</Text>
          <View style={styles.termsBox}>
            {terms.length > 0 ? (
              terms.map((t, i) => {
                const text = t.trim();
                const hasBullet = text.startsWith('•') || text.startsWith('-') || /^\d+\./.test(text);
                return (
                  <Text key={i} style={styles.termItem}>
                    {hasBullet ? text : `\u2022  ${text}`}
                  </Text>
                );
              })
            ) : (
              <Text style={styles.termItem}>-</Text>
            )}
          </View>

          <View style={styles.signRow}>
            <View style={{ width: "45%" }}>
              <Text style={styles.signName}>kedar mandal</Text>
              <View style={styles.signCol} />
              <View style={styles.signLabelRow}>
                <Text style={styles.signLabelAuth}>For AMS Civil Construction</Text>
              </View>
              <Text style={styles.signLabelSmall}>Authorized Signatory</Text>
            </View>
            
            <View style={{ width: "45%", alignItems: "flex-end" }}>
              <View style={[styles.signCol, { width: "100%", marginTop: 14 }]} />
              <View style={[styles.signLabelRow, { width: "100%" }]}>
                <Text style={[styles.signLabelAuth, { width: "100%", textAlign: "left" }]}>Client Signature</Text>
              </View>
              <Text style={[styles.signLabelSmall, { width: "100%", textAlign: "left" }]}>Date: ________________</Text>
            </View>
          </View>
          
          <View style={styles.footerBox}>
            <Text style={styles.footerText}>
              AMS Civil Construction  •  Bungalow Construction | Renovation | Interior Civil Work | Waterproofing
            </Text>
          </View>


        </View>
      </Page>
    </Document>
  );
}
