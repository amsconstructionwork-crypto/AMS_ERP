import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { MeasurementSheet, MeasurementItem } from "@/lib/types";

const NAVY = "#0F2138";
const ORANGE = "#F26430";
const BORDER = "#E2E8F0";
const LIGHT_BG = "#F8FAFC";

const styles = StyleSheet.create({
  page: { fontSize: 10, color: NAVY, padding: 0, paddingBottom: 60, fontFamily: "Helvetica" },
  
  // Header Section (Full width colored)
  headerBanner: { 
    backgroundColor: NAVY, 
    padding: 30, 
    paddingBottom: 25,
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center"
  },
  headerTitle: { fontSize: 26, fontWeight: "bold", color: "#FFFFFF", textTransform: "uppercase" },
  headerRight: { textAlign: "right", color: "#FFFFFF" },
  headerSubtitle: { fontSize: 14, color: ORANGE, fontWeight: "bold", marginBottom: 4 },
  headerNo: { fontSize: 10, color: "#94A3B8" },

  // Content Wrapper
  content: { paddingHorizontal: 30, paddingTop: 20 },

  // Meta Section
  metaBox: { 
    backgroundColor: LIGHT_BG, 
    padding: 15, 
    borderRadius: 4, 
    borderWidth: 1, 
    borderColor: BORDER,
    marginBottom: 20
  },
  metaRow: { flexDirection: "row", marginBottom: 6 },
  metaLabel: { width: 100, fontSize: 10, fontWeight: "bold", color: "#64748B" },
  metaValue: { flex: 1, fontSize: 10, fontWeight: "bold", color: NAVY },

  // Table
  table: { 
    borderWidth: 1, 
    borderColor: BORDER, 
    borderRadius: 4,
    overflow: "hidden"
  },
  tRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: BORDER },
  tRowAlt: { backgroundColor: "#FAFAFA" },
  tHeadRow: { 
    flexDirection: "row", 
    backgroundColor: NAVY,
    borderBottomWidth: 1,
    borderBottomColor: NAVY
  },
  
  // Columns
  colNo: { width: "5%", padding: 6, textAlign: "center", borderRightWidth: 1, borderRightColor: BORDER },
  colParticulars: { width: "35%", padding: 6, borderRightWidth: 1, borderRightColor: BORDER },
  colItemNo: { width: "8%", padding: 6, textAlign: "center", borderRightWidth: 1, borderRightColor: BORDER },
  colL: { width: "10%", padding: 6, textAlign: "center", borderRightWidth: 1, borderRightColor: BORDER },
  colB: { width: "10%", padding: 6, textAlign: "center", borderRightWidth: 1, borderRightColor: BORDER },
  colD: { width: "10%", padding: 6, textAlign: "center", borderRightWidth: 1, borderRightColor: BORDER },
  colQty: { width: "12%", padding: 6, textAlign: "center", borderRightWidth: 1, borderRightColor: BORDER },
  colRemarks: { width: "10%", padding: 6, textAlign: "center" },

  thText: { fontSize: 9, fontWeight: "bold", textAlign: "center", color: "#FFFFFF" },
  tdText: { fontSize: 9, color: "#334155" },

  // Totals Box
  totalsContainer: { flexDirection: "row", justifyContent: "flex-end", marginTop: 20 },
  totalsBox: { 
    width: "45%", 
    backgroundColor: LIGHT_BG,
    borderWidth: 1, 
    borderColor: BORDER, 
    borderRadius: 4,
    padding: 15
  },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  totalLabel: { fontWeight: "bold", color: "#64748B", fontSize: 10 },
  totalVal: { fontWeight: "bold", fontSize: 11, color: NAVY, textAlign: "right" },
  totalValHighlight: { fontWeight: "bold", fontSize: 12, color: ORANGE, textAlign: "right" },
  totalDivider: { borderTopWidth: 1, borderTopColor: BORDER, marginVertical: 8 },

  // Signature
  signRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 60, paddingHorizontal: 30 },
  signCol: { width: "40%", textAlign: "center" },
  signLine: { borderTopWidth: 1, borderTopColor: "#94A3B8", marginBottom: 8, borderStyle: "dashed" },
  signName: { fontSize: 10, fontWeight: "bold", color: NAVY },
  signFor: { fontSize: 9, color: "#64748B", marginBottom: 40 }
});

export default function MeasurementPdf({ sheet }: { sheet: MeasurementSheet }) {
  // Fill empty rows to make it look like the sheet
  const displayItems = [...sheet.items];
  while (displayItems.length < 15) {
    displayItems.push({ particulars: "", no_of_items: 0, length_mm: 0, breadth_mm: 0, depth_mm: 0, remarks: "" } as MeasurementItem);
  }

  let totalAddSqm = 0;
  let totalLessSqm = 0;
  let totalAddRm = 0;
  let totalLessRm = 0;
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header Banner */}
        <View style={styles.headerBanner}>
          <Text style={styles.headerTitle}>{sheet.company_name || 'KEDAR MANDAL'}</Text>
          <View style={styles.headerRight}>
            <Text style={styles.headerSubtitle}>MEASUREMENT SHEET</Text>
            <Text style={styles.headerNo}>Ref No: {sheet.sheet_number}</Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Meta Details */}
          <View style={styles.metaBox}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>PROJECT / WORK:</Text>
              <Text style={styles.metaValue}>{sheet.name_of_work}</Text>
            </View>
            <View style={[styles.metaRow, { marginBottom: 0 }]}>
              <Text style={styles.metaLabel}>PARTICULAR ITEM:</Text>
              <Text style={styles.metaValue}>{sheet.item}</Text>
            </View>
          </View>

          {/* Table */}
          <View style={styles.table}>
            <View style={styles.tHeadRow}>
              <View style={[styles.colNo, { borderRightColor: "#334155" }]}><Text style={styles.thText}>S.N</Text></View>
              <View style={[styles.colParticulars, { borderRightColor: "#334155" }]}><Text style={styles.thText}>Description</Text></View>
              <View style={[styles.colItemNo, { borderRightColor: "#334155" }]}><Text style={styles.thText}>No</Text></View>
              <View style={[styles.colL, { borderRightColor: "#334155" }]}><Text style={styles.thText}>Length</Text></View>
              <View style={[styles.colB, { borderRightColor: "#334155" }]}><Text style={styles.thText}>Breadth</Text></View>
              <View style={[styles.colD, { borderRightColor: "#334155" }]}><Text style={styles.thText}>Depth</Text></View>
              <View style={[styles.colQty, { borderRightColor: "#334155" }]}><Text style={styles.thText}>Qty</Text></View>
              <View style={styles.colRemarks}><Text style={styles.thText}>Remarks</Text></View>
            </View>

            {displayItems.map((it, idx) => {
              const hasData = it.particulars || it.length_mm > 0;
              let qty = 0;
              let isRm = false;

              if (hasData) {
                const l_m = Number(it.length_mm) || 0;
                const b_m = Number(it.breadth_mm) || 0;
                const d_m = Number(it.depth_mm) || 0;
                const num = Number(it.no_of_items) || 1;
                
                if (l_m > 0 && b_m === 0 && d_m === 0) {
                  qty = l_m * num;
                  isRm = true;
                } else {
                  qty = (d_m > 0 ? l_m * b_m * d_m : l_m * b_m) * num;
                }
                
                if (it.is_less) {
                  if (isRm) totalLessRm += qty;
                  else totalLessSqm += qty;
                } else {
                  if (isRm) totalAddRm += qty;
                  else totalAddSqm += qty;
                }
              }

              const wrapLess = (val: any) => {
                if (!hasData || val === "" || val === null || val === undefined || val === 0) return "";
                const formatted = Number(val).toFixed(3);
                if (it.is_less) return `(${formatted})`;
                return formatted;
              };

              const isAlt = idx % 2 === 1;

              return (
                <View key={idx} style={[styles.tRow, isAlt ? styles.tRowAlt : {}]}>
                  <Text style={[styles.colNo, styles.tdText]}>{hasData ? idx + 1 : ""}</Text>
                  <Text style={[styles.colParticulars, styles.tdText, { fontWeight: hasData ? "bold" : "normal" }]}>{it.particulars}</Text>
                  <Text style={[styles.colItemNo, styles.tdText]}>{hasData ? it.no_of_items : ""}</Text>
                  <Text style={[styles.colL, styles.tdText]}>{wrapLess(it.length_mm)}</Text>
                  <Text style={[styles.colB, styles.tdText]}>{wrapLess(it.breadth_mm)}</Text>
                  <Text style={[styles.colD, styles.tdText]}>{wrapLess(it.depth_mm)}</Text>
                  <Text style={[styles.colQty, styles.tdText, it.is_less ? { color: "#EF4444" } : { fontWeight: "bold" }]}>
                    {hasData && qty > 0 ? (it.is_less ? `(${qty.toFixed(4)})` : qty.toFixed(4)) : ""}
                  </Text>
                  <Text style={[styles.colRemarks, styles.tdText, { fontSize: 8 }]}>{it.remarks}</Text>
                </View>
              );
            })}
          </View>

          {/* Totals Section */}
          <View style={styles.totalsContainer}>
            <View style={styles.totalsBox}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Gross Area (Sq.M):</Text>
                <Text style={styles.totalVal}>{totalAddSqm.toFixed(4)}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Deductions (-):</Text>
                <Text style={[styles.totalVal, { color: "#EF4444" }]}>{totalLessSqm.toFixed(4)}</Text>
              </View>
              <View style={styles.totalDivider} />
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>NET AREA (Sq.M):</Text>
                <Text style={styles.totalValHighlight}>{(totalAddSqm - totalLessSqm).toFixed(4)}</Text>
              </View>
              {totalAddRm > 0 && (
                <View style={[styles.totalRow, { marginTop: 4 }]}>
                  <Text style={styles.totalLabel}>NET LENGTH (R.M):</Text>
                  <Text style={styles.totalValHighlight}>{(totalAddRm - totalLessRm).toFixed(4)}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.signRow}>
          <View style={styles.signCol}>
            <Text style={styles.signFor}>For {sheet.company_name || 'Kedar Mandal'}</Text>
            <View style={styles.signLine} />
            <Text style={styles.signName}>Authorized Signatory</Text>
          </View>
        </View>
      </Page>

      {/* SUMMARY PAGE (Manual Abstract) */}
      {sheet.summary_items && sheet.summary_items.length > 0 && (
        <Page size="A4" style={styles.page}>
          
          <View style={styles.headerBanner}>
            <Text style={styles.headerTitle}>{sheet.company_name || 'KEDAR MANDAL'}</Text>
            <View style={styles.headerRight}>
              <Text style={styles.headerSubtitle}>ABSTRACT / SUMMARY</Text>
              <Text style={styles.headerNo}>Ref No: {sheet.sheet_number}</Text>
            </View>
          </View>

          <View style={styles.content}>
            <View style={styles.metaBox}>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>PROJECT / WORK:</Text>
                <Text style={styles.metaValue}>{sheet.name_of_work}</Text>
              </View>
              <View style={[styles.metaRow, { marginBottom: 0 }]}>
                <Text style={styles.metaLabel}>PARTICULAR ITEM:</Text>
                <Text style={styles.metaValue}>{sheet.item}</Text>
              </View>
            </View>

            <View style={styles.table}>
              <View style={styles.tHeadRow}>
                <View style={[styles.colNo, { width: "10%", borderRightColor: "#334155" }]}><Text style={styles.thText}>S.No</Text></View>
                <View style={[styles.colParticulars, { width: "50%", borderRightColor: "#334155" }]}><Text style={styles.thText}>Particulars / Description</Text></View>
                <View style={[styles.colQty, { width: "20%", borderRightColor: "#334155" }]}><Text style={styles.thText}>Quantity</Text></View>
                <View style={[styles.colRemarks, { width: "20%" }]}><Text style={styles.thText}>Unit</Text></View>
              </View>

              {sheet.summary_items.map((sumItem, sIdx) => {
                const isAlt = sIdx % 2 === 1;
                return (
                  <View key={`sum-${sIdx}`} style={[styles.tRow, isAlt ? styles.tRowAlt : {}]}>
                    <Text style={[styles.colNo, styles.tdText, { width: "10%" }]}>{sIdx + 1}</Text>
                    <Text style={[styles.colParticulars, styles.tdText, { width: "50%", fontWeight: "bold" }]}>{sumItem.particulars}</Text>
                    <Text style={[styles.colQty, styles.tdText, { width: "20%", fontWeight: "bold", color: ORANGE }]}>{Number(sumItem.qty).toFixed(3)}</Text>
                    <Text style={[styles.colRemarks, styles.tdText, { width: "20%" }]}>{sumItem.unit}</Text>
                  </View>
                );
              })}
            </View>
          </View>
          
          <View style={styles.signRow}>
            <View style={styles.signCol}>
              <Text style={styles.signFor}>For {sheet.company_name || 'Kedar Mandal'}</Text>
              <View style={styles.signLine} />
              <Text style={styles.signName}>Authorized Signatory</Text>
            </View>
          </View>
        </Page>
      )}
    </Document>
  );
}
