import type {
  MobilityArea,
  MobilityRatings,
  Training,
  UserProfile,
  WeekPlanDay,
} from "@/src/types";

export const userProfile: UserProfile = {
  firstName: "Kevin",
  goal: "Wieder fit, beweglich und belastbar werden",
};

export const trainings: Training[] = [
  {
    id: "full-body-reset",
    title: "Full Body Reset",
    focus: "Kraft + Mobilitaet",
    duration: 28,
    description:
      "Ein ruhiger Wiedereinstieg mit Fokus auf saubere Bewegungen, Atemkontrolle und leichte Aktivierung.",
    exercises: [
      {
        id: "breathing-squat",
        name: "Atem-Squat",
        prescription: "2 Saetze x 8 Wiederholungen",
        description:
          "Langsame Kniebeuge mit tiefer Nasenatmung fuer mehr Kontrolle und Mobilitaet in Huefte und Ruecken.",
      },
      {
        id: "glute-bridge",
        name: "Glute Bridge",
        prescription: "3 Saetze x 10 Wiederholungen",
        description:
          "Aktiviert Gesaess und hintere Kette, ohne den unteren Ruecken zu ueberlasten.",
      },
      {
        id: "incline-pushup",
        name: "Incline Push-up",
        prescription: "3 Saetze x 8 Wiederholungen",
        description:
          "Leichte Druckbewegung fuer Schultern, Brust und Rumpf. Perfekt fuer den Wiedereinstieg.",
      },
      {
        id: "dead-bug",
        name: "Dead Bug",
        prescription: "2 Saetze x 40 Sekunden",
        description:
          "Verbessert Rumpfspannung und Bewegungskoordination bei ruhigem Tempo.",
      },
    ],
  },
  {
    id: "mobility-flow",
    title: "Mobility Flow",
    focus: "Beweglichkeit + Erholung",
    duration: 18,
    description:
      "Eine kompakte Routine fuer Schultern, Brustwirbelsaeule, Huefte und Nacken, um den Alltag auszugleichen.",
    exercises: [
      {
        id: "thread-needle",
        name: "Thread the Needle",
        prescription: "2 Saetze x 6 pro Seite",
        description:
          "Rotationsbewegung fuer die Brustwirbelsaeule und eine entspanntere Schulterposition.",
      },
      {
        id: "worlds-greatest",
        name: "World's Greatest Stretch",
        prescription: "2 Saetze x 5 pro Seite",
        description:
          "Oeffnet Huefte, Leiste und Brustkorb in einer zusammenhaengenden Bewegung.",
      },
      {
        id: "hamstring-fold",
        name: "Hamstring Fold",
        prescription: "2 Saetze x 30 Sekunden",
        description:
          "Sanfte Dehnung fuer Rueckseite der Beine mit Fokus auf kontrollierte Atmung.",
      },
    ],
  },
  {
    id: "core-stability",
    title: "Core Stability Builder",
    focus: "Stabilitaet + Haltung",
    duration: 24,
    description:
      "Eine kurze Session fuer Rumpfstabilitaet, Haltung und koordinierte Kraftentwicklung.",
    exercises: [
      {
        id: "bird-dog",
        name: "Bird Dog",
        prescription: "3 Saetze x 8 pro Seite",
        description:
          "Verbessert die Ansteuerung von Rumpf, Gesaess und Rueckenstreckern.",
      },
      {
        id: "side-plank-knee",
        name: "Side Plank Knee Support",
        prescription: "2 Saetze x 30 Sekunden pro Seite",
        description:
          "Seitliche Rumpfspannung fuer mehr Stabilitaet in Taille und Schulterguertel.",
      },
      {
        id: "reverse-lunge",
        name: "Reverse Lunge",
        prescription: "3 Saetze x 8 pro Seite",
        description:
          "Schonender Ausfallschritt fuer Beine, Balance und belastbare Hueften.",
      },
    ],
  },
];

export const weekPlan: WeekPlanDay[] = [
  {
    id: "mon",
    dayLabel: "Mo",
    fullLabel: "Montag",
    trainingType: "Reset Training",
    duration: 28,
    status: "done",
    trainingId: "full-body-reset",
  },
  {
    id: "tue",
    dayLabel: "Di",
    fullLabel: "Dienstag",
    trainingType: "Mobility Flow",
    duration: 18,
    status: "done",
    trainingId: "mobility-flow",
  },
  {
    id: "wed",
    dayLabel: "Mi",
    fullLabel: "Mittwoch",
    trainingType: "Core Stability",
    duration: 24,
    status: "open",
    trainingId: "core-stability",
    isToday: true,
  },
  {
    id: "thu",
    dayLabel: "Do",
    fullLabel: "Donnerstag",
    trainingType: "Pause & Spaziergang",
    duration: 20,
    status: "pause",
  },
  {
    id: "fri",
    dayLabel: "Fr",
    fullLabel: "Freitag",
    trainingType: "Reset Training",
    duration: 28,
    status: "open",
    trainingId: "full-body-reset",
  },
  {
    id: "sat",
    dayLabel: "Sa",
    fullLabel: "Samstag",
    trainingType: "Mobility Flow",
    duration: 18,
    status: "open",
    trainingId: "mobility-flow",
  },
  {
    id: "sun",
    dayLabel: "So",
    fullLabel: "Sonntag",
    trainingType: "Pause",
    duration: 0,
    status: "pause",
  },
];

export const mobilityAreas: MobilityArea[] = [
  {
    key: "shoulder",
    label: "Schulter",
    note: "Wie frei fuehlt sich deine Schulter heute an?",
  },
  {
    key: "hip",
    label: "Huefte",
    note: "Wie beweglich und stabil fuehlt sich deine Huefte an?",
  },
  {
    key: "back",
    label: "Ruecken",
    note: "Wie locker und belastbar fuehlt sich dein Ruecken an?",
  },
  {
    key: "legs",
    label: "Beine",
    note: "Wie leicht bewegen sich deine Beine und Oberschenkel?",
  },
  {
    key: "neck",
    label: "Nacken",
    note: "Wie entspannt und frei ist dein Nacken heute?",
  },
];

export const initialMobilityRatings: MobilityRatings = {
  shoulder: 3,
  hip: 4,
  back: 3,
  legs: 4,
  neck: 2,
};
