import { StyleSheet, Text, View } from "react-native";

import { Card } from "@/src/components/ui/Card";
import { ScreenContainer } from "@/src/components/ui/ScreenContainer";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { StatCard } from "@/src/components/ui/StatCard";
import { useAppStore } from "@/src/store/useAppStore";
import { colors, radius, spacing } from "@/src/theme";
import {
  getCompletedTrainingCount,
  getCompletedSessionIds,
  getCurrentStreak,
  getMobilityScore,
  getWeekPlanWithDerivedStatus,
  getWeekStats,
} from "@/src/utils/metrics";

export default function ProgressScreen() {
  const trainings = useAppStore((state) => state.trainings);
  const weekPlan = useAppStore((state) => state.weekPlan);
  const mobilityRatings = useAppStore((state) => state.mobilityRatings);
  const completedExerciseIdsBySessionId = useAppStore(
    (state) => state.completedExerciseIdsBySessionId,
  );

  const completedSessionIds = getCompletedSessionIds(
    weekPlan,
    trainings,
    completedExerciseIdsBySessionId,
  );
  const completedTrainingCount = getCompletedTrainingCount(
    weekPlan,
    trainings,
    completedExerciseIdsBySessionId,
  );
  const resolvedWeekPlan = getWeekPlanWithDerivedStatus(weekPlan, completedSessionIds);
  const streak = getCurrentStreak(resolvedWeekPlan);
  const mobilityScore = getMobilityScore(mobilityRatings);
  const weekStats = getWeekStats(resolvedWeekPlan);

  const chartValues = [
    { label: "Done", value: weekStats.completed, color: colors.accent },
    { label: "Open", value: weekStats.open, color: "#9FB4C8" },
    { label: "Pause", value: weekStats.pause, color: "#F3C969" },
  ];
  const maxValue = Math.max(...chartValues.map((item) => item.value), 1);

  return (
    <ScreenContainer>
      <SectionHeader
        title="Fortschritt"
        subtitle="Alle wichtigen Signale auf einen Blick: Training, Routine und Beweglichkeit."
      />

      <View style={styles.statsRow}>
        <StatCard label="Erledigte Trainings" value={`${completedTrainingCount}`} />
        <StatCard label="Aktuelle Streak" value={`${streak}`} tone="dark" />
      </View>

      <StatCard label="Mobility Score" value={`${mobilityScore}`} />

      <Card>
        <SectionHeader
          title="Wochenstatistik"
          subtitle="Ein einfacher Blick auf deine aktuelle Trainingswoche."
        />
        <View style={styles.chartRow}>
          {chartValues.map((item) => (
            <View key={item.label} style={styles.chartItem}>
              <View style={styles.chartBarTrack}>
                <View
                  style={[
                    styles.chartBarFill,
                    {
                      backgroundColor: item.color,
                      height: `${(item.value / maxValue) * 100}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.chartValue}>{item.value}</Text>
              <Text style={styles.chartLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </Card>

      <Card>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryValue}>{weekStats.completed}</Text>
            <Text style={styles.summaryLabel}>Erledigt</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryValue}>{weekStats.open}</Text>
            <Text style={styles.summaryLabel}>Offen</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryValue}>{weekStats.pause}</Text>
            <Text style={styles.summaryLabel}>Pause</Text>
          </View>
        </View>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  chartRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.lg,
    marginTop: spacing.xl,
  },
  chartItem: {
    flex: 1,
    alignItems: "center",
    gap: spacing.sm,
  },
  chartBarTrack: {
    width: "100%",
    maxWidth: 56,
    height: 150,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  chartBarFill: {
    width: "100%",
    borderRadius: radius.md,
    minHeight: 8,
  },
  chartValue: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "800",
  },
  chartLabel: {
    color: colors.textMuted,
    fontSize: 13,
  },
  summaryGrid: {
    flexDirection: "row",
    gap: spacing.md,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 6,
  },
  summaryValue: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: "800",
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: 13,
  },
});
