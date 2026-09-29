import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { MeasurementSheet, MeasurementItem } from "@/lib/types";

const NAVY = "#0F2138";
const BORDER = "#D6DCE4";

const styles = StyleSheet.create({
  page: { fontSize: 10, color: NAVY, padding: 30, paddingBottom: 60, fontFamily: "Helvetica" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: "bold" },
  headerRight: { fontSize: 12, textAlign: "right" },
  topLine: { borderBottomWidth: 1, borderBottomColor: NAVY, marginBottom: 5 },
  
  metaRow: { flexDirection: "row", marginBottom: 5 },
  metaLabel: { width: 80, fontSize: 10 },
  metaValue: { flex: 1, borderBottomWidth: 1, borderBottomColor: NAVY, fontSize: 10 },

  table: { marginTop: 15, borderLeftWidth: 1, borderRightWidth: 1, borderTopWidth: 1, borderColor: NAVY },
  tRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: NAVY },
  tHeadRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: NAVY, backgroundColor: "#f0f0f0" },
  
  // Columns
  colNo: { width: "5%", padding: 4, textAlign: "center", borderRightWidth: 1, borderRightColor: NAVY },
  colParticulars: { width: "35%", padding: 4, borderRightWidth: 1, borderRightColor: NAVY },
  colItemNo: { width: "8%", padding: 4, textAlign: "center", borderRightWidth: 1, borderRightColor: NAVY },
  colL: { width: "10%", padding: 4, textAlign: "center", borderRightWidth: 1, borderRightColor: NAVY },
  colB: { width: "10%", padding: 4, textAlign: "center", borderRightWidth: 1, borderRightColor: NAVY },
  colD: { width: "10%", padding: 4, textAlign: "center", borderRightWidth: 1, borderRightColor: NAVY },
  colQty: { width: "12%", padding: 4, textAlign: "center", borderRightWidth: 1, borderRightColor: NAVY },
  colRemarks: { width: "10%", padding: 4, textAlign: "center" },

  thText: { fontSize: 9, fontWeight: "bold", textAlign: "center" },
  tdText: { fontSize: 9 },

  totalsBox: { marginTop: 20, alignSelf: "flex-end", width: "40%", border: 1, borderColor: NAVY, padding: 10 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  totalLabel: { fontWeight: "bold" },
  totalVal: { fontWeight: "bold", color: "#F26430" },

  signRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 50 },
  signCol: { width: "30%", textAlign: "right" },
  signName: { fontSize: 12, fontWeight: "bold" }
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
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{sheet.company_name || 'KEDAR MANDAL'}</Text>
          <View style={styles.headerRight}>
            <Text style={{ marginBottom: 15, fontSize: 14 }}>Measurement Form</Text>
            <Text>No. {sheet.sheet_number}</Text>
          </View>
        </View>

        <View style={styles.topLine} />
        <View style={styles.topLine} />

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Name of Work</Text>
          <Text style={styles.metaValue}>{sheet.name_of_work}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Item</Text>
          <Text style={styles.metaValue}>{sheet.item}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tHeadRow}>
            <Text style={[styles.colNo, styles.thText]}>No</Text>
            <Text style={[styles.colParticulars, styles.thText]}>Particulars</Text>
            <Text style={[styles.colItemNo, styles.thText]}>No</Text>
            <Text style={[styles.colL, styles.thText]}>Length</Text>
            <Text style={[styles.colB, styles.thText]}>Breadth</Text>
            <Text style={[styles.colD, styles.thText]}>Depth</Text>
            <Text style={[styles.colQty, styles.thText]}>Quantity</Text>
            <Text style={[styles.colRemarks, styles.thText]}>Remarks</Text>
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

            return (
              <View key={idx} style={styles.tRow}>
                <Text style={[styles.colNo, styles.tdText]}>{hasData ? idx + 1 : ""}</Text>
                <Text style={[styles.colParticulars, styles.tdText]}>{it.particulars}</Text>
                <Text style={[styles.colItemNo, styles.tdText]}>{hasData ? it.no_of_items : ""}</Text>
                <Text style={[styles.colL, styles.tdText]}>{wrapLess(it.length_mm)}</Text>
                <Text style={[styles.colB, styles.tdText]}>{wrapLess(it.breadth_mm)}</Text>
                <Text style={[styles.colD, styles.tdText]}>{wrapLess(it.depth_mm)}</Text>
                <Text style={[styles.colQty, styles.tdText, it.is_less ? { color: "#D32F2F" } : {}]}>
                  {hasData && qty > 0 ? (it.is_less ? `(${qty.toFixed(4)})` : qty.toFixed(4)) : ""}
                </Text>
                <Text style={[styles.colRemarks, styles.tdText]}>{it.remarks}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.totalsBox}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Gross Area (Sq.M):</Text>
            <Text style={styles.totalVal}>{totalAddSqm.toFixed(4)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Deductions:</Text>
            <Text style={styles.totalVal}>- {totalLessSqm.toFixed(4)}</Text>
          </View>
          <View style={[styles.totalRow, { marginTop: 5, paddingTop: 5, borderTopWidth: 1, borderTopColor: NAVY }]}>
            <Text style={styles.totalLabel}>Net Area (Sq.M):</Text>
            <Text style={styles.totalVal}>{(totalAddSqm - totalLessSqm).toFixed(4)}</Text>
          </View>
          {totalAddRm > 0 && (
            <View style={[styles.totalRow, { marginTop: 5 }]}>
              <Text style={styles.totalLabel}>Net Length (R.M):</Text>
              <Text style={styles.totalVal}>{(totalAddRm - totalLessRm).toFixed(4)}</Text>
            </View>
          )}
        </View>

        <View style={styles.signRow}>
          <View style={{ flex: 1 }} />
          <View style={styles.signCol}>
            <Text style={styles.signName}>{sheet.company_name || 'Kedar Mandal'}</Text>
          </View>
        </View>
      </Page>

      {/* SUMMARY PAGE */}
      <Page size="A4" style={styles.page}>
        <View style={[styles.header, { justifyContent: 'center', marginBottom: 40 }]}>
          <Text style={[styles.headerTitle, { fontSize: 20, textDecoration: 'underline' }]}>ABSTRACT / SUMMARY</Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={[styles.metaLabel, { width: 120, fontSize: 12, fontWeight: 'bold' }]}>Name of Work:</Text>
          <Text style={[styles.metaValue, { fontSize: 12 }]}>{sheet.name_of_work}</Text>
        </View>
        <View style={[styles.metaRow, { marginBottom: 30 }]}>
          <Text style={[styles.metaLabel, { width: 120, fontSize: 12, fontWeight: 'bold' }]}>Particular (Item):</Text>
          <Text style={[styles.metaValue, { fontSize: 12 }]}>{sheet.item}</Text>
        </View>

        <View style={[styles.table, { marginTop: 0 }]}>
          <View style={[styles.tHeadRow, { backgroundColor: '#f0f0f0' }]}>
            <Text style={[styles.colNo, styles.thText, { width: '10%' }]}>S.No</Text>
            <Text style={[styles.colParticulars, styles.thText, { width: '50%' }]}>Description</Text>
            <Text style={[styles.colQty, styles.thText, { width: '20%' }]}>Quantity</Text>
            <Text style={[styles.colRemarks, styles.thText, { width: '20%' }]}>Unit</Text>
          </View>

          <View style={styles.tRow}>
            <Text style={[styles.colNo, styles.tdText, { width: '10%' }]}>1</Text>
            <Text style={[styles.colParticulars, styles.tdText, { width: '50%' }]}>{sheet.item} (Area)</Text>
            <Text style={[styles.colQty, styles.tdText, { width: '20%' }]}>{(totalAddSqm - totalLessSqm).toFixed(3)}</Text>
            <Text style={[styles.colRemarks, styles.tdText, { width: '20%' }]}>Sq.M</Text>
          </View>
          <View style={styles.tRow}>
            <Text style={[styles.colNo, styles.tdText, { width: '10%' }]}>2</Text>
            <Text style={[styles.colParticulars, styles.tdText, { width: '50%' }]}>{sheet.item} (Area)</Text>
            <Text style={[styles.colQty, styles.tdText, { width: '20%', fontWeight: 'bold' }]}>{((totalAddSqm - totalLessSqm) * 10.7639).toFixed(3)}</Text>
            <Text style={[styles.colRemarks, styles.tdText, { width: '20%', fontWeight: 'bold' }]}>Sq.Ft</Text>
          </View>

          {(totalAddRm - totalLessRm) > 0 && (
            <>
              <View style={styles.tRow}>
                <Text style={[styles.colNo, styles.tdText, { width: '10%' }]}>3</Text>
                <Text style={[styles.colParticulars, styles.tdText, { width: '50%' }]}>{sheet.item} (Running)</Text>
                <Text style={[styles.colQty, styles.tdText, { width: '20%' }]}>{(totalAddRm - totalLessRm).toFixed(3)}</Text>
                <Text style={[styles.colRemarks, styles.tdText, { width: '20%' }]}>R.M</Text>
              </View>
              <View style={styles.tRow}>
                <Text style={[styles.colNo, styles.tdText, { width: '10%' }]}>4</Text>
                <Text style={[styles.colParticulars, styles.tdText, { width: '50%' }]}>{sheet.item} (Running)</Text>
                <Text style={[styles.colQty, styles.tdText, { width: '20%', fontWeight: 'bold' }]}>{((totalAddRm - totalLessRm) * 3.28084).toFixed(3)}</Text>
                <Text style={[styles.colRemarks, styles.tdText, { width: '20%', fontWeight: 'bold' }]}>R.Ft</Text>
              </View>
            </>
          )}
        </View>
        
        <View style={styles.signRow}>
          <View style={{ flex: 1 }} />
          <View style={styles.signCol}>
            <Text style={styles.signName}>{sheet.company_name || 'Kedar Mandal'}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
