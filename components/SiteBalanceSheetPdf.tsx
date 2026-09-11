import React from "react";
import { Page, Text, View, Document, StyleSheet, Font, Image } from "@react-pdf/renderer";
import { formatINR } from "@/lib/types";

Font.register({
  family: "Helvetica",
  fonts: [
    { src: "https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyCg4Q4Fq.ttf" } // Fallback, standard PDF fonts are built in.
  ]
});

const NAVY = "#0F2138";
const NAVY_LIGHT = "#1E3A5F";
const ORANGE = "#F26430";
const PALE_ORANGE = "#FFF3EE"; 
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
  contactStrip: { backgroundColor: "#fff", borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: NAVY, paddingVertical: 4, paddingHorizontal: 20, flexDirection: "row", justifyContent: "center", fontSize: 8, color: NAVY, marginBottom: 20 },

  // Watermark
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
  watermarkLogo: { width: 200, height: 200, marginBottom: 20 },
  watermarkText: { fontSize: 90, color: "#001B3D", fontWeight: "bold", textAlign: "center", width: "100%" },
  
  siteInfoBox: { backgroundColor: "#F8FAFC", padding: 15, borderRadius: 4, marginBottom: 20 },
  siteName: { fontSize: 14, fontWeight: "bold", marginBottom: 4 },
  siteDetails: { fontSize: 10, color: "#475569", marginBottom: 2 },
  
  summaryBox: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30, padding: 15, border: "1px solid #E2E8F0", borderRadius: 4 },
  summaryItem: { flex: 1, alignItems: "center" },
  summaryLabel: { fontSize: 9, color: "#64748B", textTransform: "uppercase", marginBottom: 4 },
  summaryValue: { fontSize: 14, fontWeight: "bold" },
  summaryValuePending: { fontSize: 14, fontWeight: "bold", color: "#F97316" },

  sectionTitle: { fontSize: 12, fontWeight: "bold", backgroundColor: "#E2E8F0", padding: 5, marginBottom: 10 },
  
  table: { width: "auto", marginBottom: 20 },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#E2E8F0", borderBottomStyle: "solid", alignItems: "center", minHeight: 24 },
  tableHeader: { backgroundColor: NAVY, color: "#fff", fontWeight: "bold", fontSize: 9 },
  colDate: { width: "15%", padding: 5 },
  colRef: { width: "20%", padding: 5 },
  colArea: { width: "20%", padding: 5 },
  colDesc: { width: "25%", padding: 5 },
  colAmt: { width: "20%", padding: 5, textAlign: "right" },
  
  footer: { position: "absolute", bottom: 20, left: 40, right: 40, textAlign: "center", color: "#94A3B8", fontSize: 8, borderTop: "1px solid #E2E8F0", paddingTop: 10 }
});

export default function SiteBalanceSheetPdf({ site, bills, payments, logoBase64 }: { site: any, bills: any[], payments: any[], logoBase64?: string }) {
  const generatedAt = new Date().toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric"
  });

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {logoBase64 && (
          <View style={styles.watermarkContainer} fixed>
            <Image src={logoBase64} style={styles.watermarkLogo} />
            <Text style={styles.watermarkText}>AMS</Text>
          </View>
        )}
        
        <View style={styles.topBorder} />
        <View style={styles.headerBar}>
          {logoBase64 && (
            <View style={styles.logoBox}>
              <Image src={logoBase64} style={styles.logo} />
            </View>
          )}
          <View>
            <Text style={styles.companyName}>AMS CIVIL CONSTRUCTION</Text>
            <Text style={styles.tagline}>Mumbai&apos;s Trusted Construction Partner  |  Since 2001</Text>
          </View>
          <View style={styles.docTypeBox}>
            <Text style={styles.docType}>BALANCE SHEET</Text>
            <Text style={styles.docSub}>Project Ledger</Text>
          </View>
        </View>

        <View style={styles.contactStrip}>
          <Text>+91 87793 91690 / +91 90042 98911   |   ams.constructionwork@gmail.com   |   www.amscivilwork.in   |   Mumbai, Maharashtra</Text>
        </View>

        <View style={styles.siteInfoBox}>
          <Text style={styles.siteName}>Project: {site.name}</Text>
          {site.client_name && <Text style={styles.siteDetails}>Client: {site.client_name}</Text>}
          {site.address && <Text style={styles.siteDetails}>Address: {site.address}</Text>}
          <Text style={[styles.siteDetails, { marginTop: 5 }]}>Generated on: {generatedAt}</Text>
        </View>

        <Text style={styles.sectionTitle}>BILLS GENERATED (WORK DONE)</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.colDate}>Date</Text>
            <Text style={styles.colRef}>Bill No.</Text>
            <Text style={styles.colArea}>Work Area</Text>
            <Text style={styles.colDesc}>Description</Text>
            <Text style={styles.colAmt}>Amount (Rs)</Text>
          </View>
          {bills.length === 0 ? (
            <View style={styles.tableRow}><Text style={[styles.colDate, { width: "100%", textAlign: "center" }]}>No bills generated.</Text></View>
          ) : (
            bills.map((b) => (
              <View style={styles.tableRow} key={b.id}>
                <Text style={styles.colDate}>{new Date(b.bill_date).toLocaleDateString("en-IN")}</Text>
                <Text style={styles.colRef}>{b.bill_number}</Text>
                <Text style={styles.colArea}>{b.work_area || "-"}</Text>
                <Text style={styles.colDesc}>{b.description}</Text>
                <Text style={styles.colAmt}>{formatINR(Number(b.amount))}</Text>
              </View>
            ))
          )}
        </View>

        <Text style={styles.sectionTitle} break>PAYMENTS RECEIVED</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.colDate}>Date</Text>
            <Text style={styles.colRef}>Reference No.</Text>
            <Text style={[styles.colDesc, { width: "35%" }]}></Text>
            <Text style={styles.colAmt}>Amount (Rs)</Text>
          </View>
          {payments.length === 0 ? (
            <View style={styles.tableRow}><Text style={[styles.colDate, { width: "100%", textAlign: "center" }]}>No payments received.</Text></View>
          ) : (
            payments.map((p) => (
              <View style={styles.tableRow} key={p.id}>
                <Text style={styles.colDate}>{new Date(p.payment_date).toLocaleDateString("en-IN")}</Text>
                <Text style={styles.colRef}>{p.reference_no}</Text>
                <Text style={[styles.colDesc, { width: "35%" }]}></Text>
                <Text style={styles.colAmt}>{formatINR(Number(p.amount))}</Text>
              </View>
            ))
          )}
        </View>

        <View style={{ marginTop: 20, borderTopWidth: 2, borderTopColor: NAVY, paddingTop: 10, width: "50%", marginLeft: "auto" }}>
          <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 10, color: NAVY }}>FINAL LEDGER SUMMARY</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
            <Text style={{ fontSize: 10 }}>Total Billed (Work Done):</Text>
            <Text style={{ fontSize: 10, fontWeight: "bold" }}>Rs. {formatINR(Number(site.total_billed))}</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
            <Text style={{ fontSize: 10 }}>Total Payments Received:</Text>
            <Text style={{ fontSize: 10, fontWeight: "bold", color: "#16A34A" }}>(-) Rs. {formatINR(Number(site.total_received))}</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 4, borderTopWidth: 1, borderTopColor: BORDER, paddingTop: 6 }}>
            <Text style={{ fontSize: 12, fontWeight: "bold", color: ORANGE }}>NET PENDING BALANCE:</Text>
            <Text style={{ fontSize: 12, fontWeight: "bold", color: ORANGE }}>Rs. {formatINR(site.pending_balance)}</Text>
          </View>
        </View>

        <Text style={styles.footer} fixed>
          This is a computer-generated document and does not require a signature.
        </Text>
      </Page>
    </Document>
  );
}
