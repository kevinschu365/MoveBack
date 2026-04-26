export type TrainingStatus = "open" | "done" | "pause";

export type MobilityAreaKey = "shoulder" | "hip" | "back" | "legs" | "neck";

export type Exercise = {
  id: string;
  name: string;
  prescription: string;
  description: string;
};

export type Training = {
  id: string;
  title: string;
  focus: string;
  duration: number;
  description: string;
  exercises: Exercise[];
};

export type WeekPlanDay = {
  id: string;
  dayLabel: string;
  fullLabel: string;
  trainingType: string;
  duration: number;
  status: TrainingStatus;
  trainingId?: string;
  isToday?: boolean;
};

export type MobilityArea = {
  key: MobilityAreaKey;
  label: string;
  note: string;
};

export type MobilityRatings = Record<MobilityAreaKey, number>;

export type UserProfile = {
  firstName: string;
  goal: string;
};
