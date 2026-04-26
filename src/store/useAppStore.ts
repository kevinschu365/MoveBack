import { create } from "zustand";

import {
  initialMobilityRatings,
  trainings,
  weekPlan,
} from "@/src/data/mockData";
import type { MobilityAreaKey, MobilityRatings, Training, WeekPlanDay } from "@/src/types";

type AppState = {
  trainings: Training[];
  weekPlan: WeekPlanDay[];
  mobilityRatings: MobilityRatings;
  completedExerciseIdsBySessionId: Record<string, string[]>;
  toggleExerciseCompleted: (sessionId: string, exerciseId: string) => void;
  setMobilityRating: (area: MobilityAreaKey, rating: number) => void;
};

export const useAppStore = create<AppState>((set) => ({
  trainings,
  weekPlan,
  mobilityRatings: initialMobilityRatings,
  completedExerciseIdsBySessionId: {
    mon: ["breathing-squat", "glute-bridge", "incline-pushup", "dead-bug"],
    tue: ["thread-needle", "worlds-greatest", "hamstring-fold"],
    wed: ["bird-dog"],
  },
  toggleExerciseCompleted: (sessionId, exerciseId) =>
    set((state) => {
      const completedForSession =
        state.completedExerciseIdsBySessionId[sessionId] ?? [];
      const alreadyCompleted = completedForSession.includes(exerciseId);

      // Exercise state stays completely local so the MVP works offline without a backend.
      const nextCompletedForSession = alreadyCompleted
        ? completedForSession.filter((id) => id !== exerciseId)
        : [...completedForSession, exerciseId];

      return {
        completedExerciseIdsBySessionId: {
          ...state.completedExerciseIdsBySessionId,
          [sessionId]: nextCompletedForSession,
        },
      };
    }),
  setMobilityRating: (area, rating) =>
    set((state) => ({
      mobilityRatings: {
        ...state.mobilityRatings,
        [area]: rating,
      },
    })),
}));
