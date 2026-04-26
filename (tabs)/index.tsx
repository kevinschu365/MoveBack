import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { Card } from "@/src/components/ui/Card";
import { PrimaryButton } from "@/src/components/ui/PrimaryButton";
import { ProgressBar } from "@/src/components/ui/ProgressBar";
import { ScreenContainer } from "@/src/components/ui/ScreenContainer";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { StatCard } from "@/src/components/ui/StatCard";
import { StatusPill } from "@/src/components/ui/StatusPill";
import { userProfile } from "@/src/data/mockData";
import { colors, radius, spacing } from "@/src/theme";
import { useAppStore } from "@/src/store/useAppStore";
import {
  getCompletedTrainingCount,
  getCompletedSessionIds,
  getCurrentStreak,
  getMobilityScore,
  getTodayPlanItem,
  getTrainingCompletion,
  getWeekPlanWithDerivedStatus,
} from "@/src/utils/metrics";

export default function DashboardScreen() {
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
  const today = getTodayPlanItem(resolvedWeekPlan);
  const todayTraining = trainings.find((training) => training.id === today?.trainingId);
  const todayProgress = todayTraining
    ? getTrainingCompletion(
        todayTraining,
        completedExerciseIdsBySessionId[today.id] ?? [],
      )
    : 0;
  const streak = getCurrentStreak(resolvedWeekPlan);
  const mobilityScore = getMobilityScore(mobilityRatings);

  return (
    <ScreenContainer>
      <Card style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View style={styles.heroCopy}>
            <Text style={styles.kicker}>MoveBack</Text>
            <Text style={styles.heroTitle}>Willkommen zurueck, {userProfile.firstName}</Text>
            <Text style={styles.heroSubtitle}>{userProfile.goal}</Text>
          </View>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeValue}>{streak}</Text>
            <Text style={styles.heroBadgeLabel}>Tage</Text>
          </View>
        </View>
        <PrimaryButton
          label="Training starten"
          onPress={() => {
            if (todayTraining) {
              router.push({
                pathname: "/training/[id]",
                params: { id: todayTraining.id, sessionId: today.id },
              });
            }
          }}
        />
      </Card>

      <SectionHeader
        title="Heutiges Training"
        subtitle="Klar strukturiert, kompakt und ideal fuer den Wiedereinstieg."
      />

      <Card>
        <View style={styles.cardHeader}>
          <View style={styles.cardCopy}>
            <Text style={styles.cardTitle}>{todayTraining?.title ?? today.trainingType}</Text>
            <Text style={styles.cardMeta}>
              {todayTraining?.focus ?? "Erholung"} - {today.duration} Min
            </Text>
          </View>
          <StatusPill status={today.status} />
        </View>
        <Text style={styles.cardDescription}>
          {todayTraining?.description ??
            "Heute steht eine leichte Pause mit Fokus auf Regeneration und Bewegung im Alltag an."}
        </Text>
        <View style={styles.progressBlock}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Fortschritt</Text>
            <Text style={styles.progressValue}>
              {Math.round(todayProgress * 100)}%
            </Text>
          </View>
          <ProgressBar progress={todayProgress} />
        </View>
      </Card>

      <Card style={styles.mobilityCard}>
        <View style={styles.cardCopy}>
          <Text style={styles.cardTitle}>Mobility Routine</Text>
          <Text style={styles.cardDescription}>
            In 5 Minuten deine Beweglichkeit checken und den Tageszustand besser einschaetzen.
          </Text>
        </View>
        <PrimaryButton
          label="Mobility Check oeffnen"
          onPress={() => router.push("/mobility-check")}
        />
      </Card>

      <View style={styles.statsRow}>
        <StatCard label="Aktuelle Streak" value={`${streak}`} tone="dark" />
        <StatCard label="Mobility Score" value={`${mobilityScore}`} />
      </View>

      <Card>
        <SectionHeader
          title="Fortschritt"
          subtitle="Dein Fortschritt bleibt sichtbar, auch wenn du klein startest."
        />
        <View style={styles.progressSummaryRow}>
          <View style={styles.progressSummaryBox}>
            <Text style={styles.progressSummaryValue}>{completedTrainingCount}</Text>
            <Text style={styles.progressSummaryLabel}>Trainings erledigt</Text>
          </View>
          <View style={styles.progressSummaryBox}>
            <Text style={styles.progressSummaryValue}>
              {
                resolvedWeekPlan.filter((day) => day.status === "open" && day.trainingId)
                  .length
              }
            </Text>
            <Text style={styles.progressSummaryLabel}>Noch offen</Text>
          </View>
        </View>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    gap: spacing.lg,
    paddingTop: spacing.xl,
  },
  heroTop: {
    flexDirection: "row",
    gap: spacing.md,
  },
  heroCopy: {
    flex: 1,
    gap: spacing.sm,
  },
  kicker: {
    color: "#8AA3BF",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  heroTitle: {
    color: colors.surface,
    fontSize: 30,
    fontWeight: "800",
    lineHeight: 36,
  },
  heroSubtitle: {
    color: "#D8E4F0",
    fontSize: 15,
    lineHeight: 22,
  },
  heroBadge: {
    width: 82,
    minHeight: 82,
    borderRadius: radius.md,
    backgroundColor: "#0E2742",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.sm,
  },
  heroBadgeValue: {
    color: colors.accent,
    fontSize: 28,
    fontWeight: "800",
  },
  heroBadgeLabel: {
    color: "#A7BCD1",
    fontSize: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  cardCopy: {
    flex: 1,
    gap: 6,
  },
  cardTitle: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "700",
  },
  cardMeta: {
    color: colors.textMuted,
    fontSize: 13,
  },
  cardDescription: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing.md,
  },
  progressBlock: {
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabel: {
    color: colors.textMuted,
    fontSize: 13,
  },
  progressValue: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  mobilityCard: {
    gap: spacing.lg,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  progressSummaryRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  progressSummaryBox: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 6,
  },
  progressSummaryValue: {
    color: colors.primary,
    fontSize: 26,
    fontWeight: "800",
  },
  progressSummaryLabel: {
    color: colors.textMuted,
    fontSize: 13,
  },
});
