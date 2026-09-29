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

  let totalSqm = 0;
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>KEDAR MANDAL</Text>
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
            let qtySqm = 0;
            if (hasData) {
              const l_m = Number(it.length_mm) || 0;
              const b_m = Number(it.breadth_mm) || 0;
              const d_m = Number(it.depth_mm) || 0;
              const num = Number(it.no_of_items) || 1;
              qtySqm = (d_m > 0 ? l_m * b_m * d_m : l_m * b_m) * num;
              totalSqm += qtySqm;
            }

            return (
              <View key={idx} style={styles.tRow}>
                <Text style={[styles.colNo, styles.tdText]}>{hasData ? idx + 1 : ""}</Text>
                <Text style={[styles.colParticulars, styles.tdText]}>{it.particulars}</Text>
                <Text style={[styles.colItemNo, styles.tdText]}>{hasData ? it.no_of_items : ""}</Text>
                <Text style={[styles.colL, styles.tdText]}>{hasData && it.length_mm ? it.length_mm : ""}</Text>
                <Text style={[styles.colB, styles.tdText]}>{hasData && it.breadth_mm ? it.breadth_mm : ""}</Text>
                <Text style={[styles.colD, styles.tdText]}>{hasData && it.depth_mm ? it.depth_mm : ""}</Text>
                <Text style={[styles.colQty, styles.tdText]}>{hasData ? qtySqm.toFixed(4) : ""}</Text>
                <Text style={[styles.colRemarks, styles.tdText]}>{it.remarks}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.totalsBox}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Area (Sq.M):</Text>
            <Text style={styles.totalVal}>{totalSqm.toFixed(4)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Area (Sq.Ft):</Text>
            <Text style={styles.totalVal}>{(totalSqm * 10.7639).toFixed(4)}</Text>
          </View>
        </View>

        <View style={styles.signRow}>
          <View style={{ flex: 1 }} />
          <View style={styles.signCol}>
            <Text style={styles.signName}>Kedar Mandal</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
