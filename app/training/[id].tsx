import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { ExerciseChecklistItem } from "@/src/components/ui/ExerciseChecklistItem";
import { ProgressBar } from "@/src/components/ui/ProgressBar";
import { ScreenContainer } from "@/src/components/ui/ScreenContainer";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { useAppStore } from "@/src/store/useAppStore";
import { colors, spacing } from "@/src/theme";
import { getTrainingCompletion } from "@/src/utils/metrics";

export default function TrainingDetailScreen() {
  const params = useLocalSearchParams<{
    id?: string | string[];
    sessionId?: string | string[];
  }>();
  const trainingId = Array.isArray(params.id) ? params.id[0] : params.id;
  const sessionId = Array.isArray(params.sessionId)
    ? params.sessionId[0]
    : params.sessionId;

  const trainings = useAppStore((state) => state.trainings);
  const completedExerciseIdsBySessionId = useAppStore(
    (state) => state.completedExerciseIdsBySessionId,
  );
  const toggleExerciseCompleted = useAppStore(
    (state) => state.toggleExerciseCompleted,
  );

  const training = trainings.find((entry) => entry.id === trainingId);

  if (!training) {
    return (
      <ScreenContainer>
        <SectionHeader
          title="Training nicht gefunden"
          subtitle="Die angeforderte Session konnte nicht geladen werden."
        />
      </ScreenContainer>
    );
  }

  const progressKey = sessionId ?? training.id;
  const completedForTraining = completedExerciseIdsBySessionId[progressKey] ?? [];
  const progress = getTrainingCompletion(training, completedForTraining);

  return (
    <ScreenContainer>
      <SectionHeader title={training.title} subtitle={training.description} />

      <View style={styles.topMeta}>
        <View>
          <Text style={styles.metaLabel}>Fokus</Text>
          <Text style={styles.metaValue}>{training.focus}</Text>
        </View>
        <View>
          <Text style={styles.metaLabel}>Dauer</Text>
          <Text style={styles.metaValue}>{training.duration} Min</Text>
        </View>
      </View>

      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Training Fortschritt</Text>
          <Text style={styles.progressValue}>{Math.round(progress * 100)}%</Text>
        </View>
        <ProgressBar progress={progress} />
      </View>

      <View style={styles.exerciseList}>
        {training.exercises.map((exercise) => (
          <ExerciseChecklistItem
            key={exercise.id}
            exercise={exercise}
            completed={completedForTraining.includes(exercise.id)}
            onToggle={() => toggleExerciseCompleted(progressKey, exercise.id)}
          />
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  metaLabel: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 6,
  },
  metaValue: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "700",
  },
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressTitle: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  progressValue: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: "800",
  },
  exerciseList: {
    gap: spacing.md,
  },
});
