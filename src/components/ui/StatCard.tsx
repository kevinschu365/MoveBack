import { StyleSheet, Text, View } from "react-native";

import { Card } from "@/src/components/ui/Card";
import { colors, spacing } from "@/src/theme";

type StatCardProps = {
  label: string;
  value: string;
  tone?: "light" | "dark";
};

export function StatCard({ label, value, tone = "light" }: StatCardProps) {
  const darkTone = tone === "dark";

  return (
    <Card
      style={[
        styles.card,
        darkTone && { backgroundColor: colors.primary, borderColor: colors.primary },
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.value, darkTone && styles.valueDark]}>{value}</Text>
        <Text style={[styles.label, darkTone && styles.labelDark]}>{label}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 112,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    gap: spacing.md,
  },
  value: {
    color: colors.primary,
    fontSize: 30,
    fontWeight: "800",
  },
  valueDark: {
    color: colors.surface,
  },
  label: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  labelDark: {
    color: "#D8E4F0",
  },
});
