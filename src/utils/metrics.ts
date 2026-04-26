import type {
  MobilityRatings,
  Training,
  TrainingStatus,
  WeekPlanDay,
} from "@/src/types";

export const getTrainingCompletion = (
  training: Training,
  completedExerciseIds: string[],
) => {
  if (training.exercises.length === 0) {
    return 0;
  }

  return completedExerciseIds.length / training.exercises.length;
};

export const isTrainingComplete = (
  training: Training,
  completedExerciseIds: string[],
) => getTrainingCompletion(training, completedExerciseIds) >= 1;

export const getCompletedSessionIds = (
  plan: WeekPlanDay[],
  trainings: Training[],
  completedExerciseIdsBySessionId: Record<string, string[]>,
) =>
  plan
    .filter((day) => {
      if (!day.trainingId || day.status === "pause") {
        return false;
      }

      const training = trainings.find((entry) => entry.id === day.trainingId);

      if (!training) {
        return false;
      }

      return isTrainingComplete(
        training,
        completedExerciseIdsBySessionId[day.id] ?? [],
      );
    })
    .map((day) => day.id);

export const getCompletedTrainingCount = (
  plan: WeekPlanDay[],
  trainings: Training[],
  completedExerciseIdsBySessionId: Record<string, string[]>,
) =>
  getCompletedSessionIds(plan, trainings, completedExerciseIdsBySessionId).length;

export const getWeekPlanWithDerivedStatus = (
  plan: WeekPlanDay[],
  completedSessionIds: string[],
) =>
  plan.map((day) => {
    const derivedStatus: TrainingStatus =
      day.status === "pause"
        ? "pause"
        : completedSessionIds.includes(day.id)
          ? "done"
          : "open";

    return { ...day, status: derivedStatus };
  });

export const getTodayPlanItem = (plan: WeekPlanDay[]) =>
  plan.find((day) => day.isToday) ?? plan[0];

export const getCurrentStreak = (plan: WeekPlanDay[]) => {
  const todayIndex = plan.findIndex((day) => day.isToday);
  const startIndex = todayIndex >= 0 ? todayIndex : plan.length - 1;

  let streak = 0;

  // The streak counts backwards from today and ignores pause days.
  for (let index = startIndex; index >= 0; index -= 1) {
    const day = plan[index];

    if (day.status === "pause") {
      continue;
    }

    if (day.status === "done") {
      streak += 1;
      continue;
    }

    break;
  }

  return streak;
};

export const getMobilityScore = (ratings: MobilityRatings) => {
  const values = Object.values(ratings);

  if (values.length === 0) {
    return 0;
  }

  const average = values.reduce((total, value) => total + value, 0) / values.length;

  return Math.round(average * 20);
};

export const getWeekStats = (plan: WeekPlanDay[]) => {
  const completed = plan.filter((day) => day.status === "done").length;
  const open = plan.filter((day) => day.status === "open").length;
  const pause = plan.filter((day) => day.status === "pause").length;

  return { completed, open, pause };
};
