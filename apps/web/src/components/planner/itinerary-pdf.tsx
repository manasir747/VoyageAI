import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { TripPlanResponse } from "@/types/planner";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 30,
    borderBottom: "2px solid #0f172a",
    paddingBottom: 15,
  },
  brand: {
    fontSize: 12,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: "#64748b",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 10,
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: 5,
  },
  text: {
    fontSize: 11,
    color: "#334155",
    lineHeight: 1.6,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  col: {
    flex: 1,
  },
  card: {
    padding: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 6,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 4,
  },
  cardText: {
    fontSize: 10,
    color: "#475569",
  },
  dayHeader: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff",
    backgroundColor: "#0f172a",
    padding: 10,
    borderRadius: 4,
    marginBottom: 12,
    marginTop: 10,
  },
  activityBlock: {
    marginLeft: 10,
    borderLeft: "2px solid #e2e8f0",
    paddingLeft: 12,
    marginBottom: 15,
  },
  activityTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 4,
  },
  bulletItem: {
    flexDirection: "row",
    marginBottom: 6,
  },
  bulletPoint: {
    width: 15,
    fontSize: 11,
    color: "#0f172a",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 10,
    borderTop: "1px solid #e2e8f0",
    paddingTop: 10,
  },
});

export const ItineraryPDF = ({ data }: { data: TripPlanResponse }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.brand}>VoyageAI Itinerary</Text>
        <Text style={styles.title}>Trip to {data.destination}</Text>
        <Text style={styles.subtitle}>
          {data.budgetSummary.travelTime} • {data.budgetSummary.total}
        </Text>
      </View>

      {/* Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.text}>{data.overview}</Text>
      </View>

      {/* Flights & Hotels */}
      <View style={styles.row}>
        {data.flights.length > 0 && (
          <View style={[styles.col, { paddingRight: 10 }]}>
            <Text style={styles.sectionTitle}>Flights</Text>
            {data.flights.map((f: any, i: number) => (
              <View key={i} style={styles.card}>
                <Text style={styles.cardTitle}>{f.airline}</Text>
                <Text style={styles.cardText}>{f.route}</Text>
                <Text style={[styles.cardText, { marginTop: 4, fontWeight: "bold" }]}>
                  {f.price}
                </Text>
              </View>
            ))}
          </View>
        )}

        {data.hotels.length > 0 && (
          <View style={[styles.col, { paddingLeft: 10 }]}>
            <Text style={styles.sectionTitle}>Accommodations</Text>
            {data.hotels.map((h: any, i: number) => (
              <View key={i} style={styles.card}>
                <Text style={styles.cardTitle}>{h.name}</Text>
                <Text style={styles.cardText}>{h.location}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <Text
        style={styles.footer}
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages} • VoyageAI`}
        fixed
      />
    </Page>

    {/* Daily Itinerary */}
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Itinerary</Text>

        {data.days.map((day: any, i: number) => (
          <View key={i} wrap={false}>
            <Text style={styles.dayHeader}>
              {day.date} - {day.title}
            </Text>
            {day.activities.map((act: any, j: number) => (
              <View key={j} style={styles.activityBlock}>
                <Text style={styles.activityTitle}>{act.title}</Text>
                {act.meta && <Text style={[styles.cardText, { marginBottom: 4 }]}>{act.meta}</Text>}
                <Text style={styles.text}>{act.description}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      <Text
        style={styles.footer}
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages} • VoyageAI`}
        fixed
      />
    </Page>

    {/* Tips & Packing */}
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Travel Tips</Text>
        <View style={{ marginTop: 10 }}>
          {data.travelTips
            .split(".")
            .filter((t: string) => t.trim().length > 5)
            .map((tip: string, i: number) => (
              <View key={i} style={styles.bulletItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.text}>{tip.trim()}.</Text>
              </View>
            ))}
        </View>
      </View>

      {data.packingSuggestions && data.packingSuggestions.length > 0 && (
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Packing List</Text>
          <View style={{ marginTop: 10 }}>
            {data.packingSuggestions.map((item: string, i: number) => (
              <View key={i} style={styles.bulletItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.text}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <Text
        style={styles.footer}
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages} • VoyageAI`}
        fixed
      />
    </Page>
  </Document>
);
