import { Pressable, StyleSheet, Text, View } from "react-native";

import { Card } from "@/src/components/ui/Card";
import { StatusPill } from "@/src/components/ui/StatusPill";
import { colors, spacing } from "@/src/theme";
import type { WeekPlanDay } from "@/src/types";

type WeekPlanCardProps = {
  day: WeekPlanDay;
  onPress?: () => void;
};

export function WeekPlanCard({ day, onPress }: WeekPlanCardProps) {
  const content = (
    <Card style={[styles.card, day.isToday && styles.cardToday]}>
      <View style={styles.row}>
        <View style={styles.dayBlock}>
          <Text style={styles.dayLabel}>{day.dayLabel}</Text>
          <Text style={styles.fullLabel}>{day.fullLabel}</Text>
        </View>
        <View style={styles.mainBlock}>
          <Text style={styles.trainingType}>{day.trainingType}</Text>
          <Text style={styles.duration}>
            {day.duration > 0 ? `${day.duration} Min` : "Regeneration"}
          </Text>
        </View>
        <StatusPill status={day.status} />
      </View>
    </Card>
  );

  if (!onPress || !day.trainingId) {
    return content;
  }

  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: spacing.md,
  },
  cardToday: {
    borderColor: colors.accent,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  dayBlock: {
    width: 54,
    gap: 2,
  },
  dayLabel: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.primary,
  },
  fullLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  mainBlock: {
    flex: 1,
    gap: 4,
  },
  trainingType: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  duration: {
    fontSize: 13,
    color: colors.textMuted,
  },
  pressed: {
    opacity: 0.9,
  },
});
