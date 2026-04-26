import { router } from "expo-router";

import { ScreenContainer } from "@/src/components/ui/ScreenContainer";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { WeekPlanCard } from "@/src/components/ui/WeekPlanCard";
import { useAppStore } from "@/src/store/useAppStore";
import {
  getCompletedSessionIds,
  getWeekPlanWithDerivedStatus,
} from "@/src/utils/metrics";

export default function WeeklyPlanScreen() {
  const trainings = useAppStore((state) => state.trainings);
  const weekPlan = useAppStore((state) => state.weekPlan);
  const completedExerciseIdsBySessionId = useAppStore(
    (state) => state.completedExerciseIdsBySessionId,
  );

  const completedSessionIds = getCompletedSessionIds(
    weekPlan,
    trainings,
    completedExerciseIdsBySessionId,
  );
  const resolvedWeekPlan = getWeekPlanWithDerivedStatus(weekPlan, completedSessionIds);

  return (
    <ScreenContainer>
      <SectionHeader
        title="Wochenplan"
        subtitle="Sieben klare Tage mit Trainingstyp, Dauer und Status."
      />

      {resolvedWeekPlan.map((day) => (
        <WeekPlanCard
          key={day.id}
          day={day}
          onPress={
            day.trainingId
              ? () =>
                  router.push({
                    pathname: "/training/[id]",
                    params: { id: day.trainingId, sessionId: day.id },
                  })
              : undefined
          }
        />
      ))}
    </ScreenContainer>
  );
}
