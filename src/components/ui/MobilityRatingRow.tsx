import { Pressable, StyleSheet, Text, View } from "react-native";

import { Card } from "@/src/components/ui/Card";
import { colors, radius, spacing } from "@/src/theme";
import type { MobilityArea, MobilityAreaKey } from "@/src/types";

type MobilityRatingRowProps = {
  area: MobilityArea;
  value: number;
  onChange: (area: MobilityAreaKey, nextValue: number) => void;
};

export function MobilityRatingRow({
  area,
  value,
  onChange,
}: MobilityRatingRowProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.copy}>
        <Text style={styles.title}>{area.label}</Text>
        <Text style={styles.note}>{area.note}</Text>
      </View>
      <View style={styles.options}>
        {[1, 2, 3, 4, 5].map((option) => {
          const active = option === value;

          return (
            <Pressable
              key={option}
              onPress={() => onChange(area.key, option)}
              style={[styles.option, active && styles.optionActive]}
            >
              <Text style={[styles.optionLabel, active && styles.optionLabelActive]}>
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  copy: {
    gap: 6,
  },
  title: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "700",
  },
  note: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  options: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  option: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  optionActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  optionLabel: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  optionLabelActive: {
    color: colors.primary,
  },
});
