export interface SlotExercise {
  ex: string;
  sets: number;
  reps: number;
  weight: number;
  alts: string[];
}

export interface WorkoutSlot {
  id: string;
  name: string;
  exercises: SlotExercise[];
}

export interface SessionExerciseLog {
  ex: string;
  weight: number;
  reps: number;
  sets: number;
}

export interface SessionLog {
  date: string;
  slotId: string;
  slotName: string;
  exercises: SessionExerciseLog[];
  volume: number;
}

export const DEFAULT_PROGRAM: WorkoutSlot[] = [
  {
    id: "w1",
    name: "Push A",
    exercises: [
      { ex: "bench-bb", sets: 4, reps: 5, weight: 102.5, alts: ["bench-db", "incline-bb"] },
      { ex: "ohp", sets: 3, reps: 6, weight: 55, alts: ["ohp-db"] },
      { ex: "incline-db", sets: 3, reps: 10, weight: 30, alts: ["incline-bb", "pec-deck"] },
      { ex: "lateral-db", sets: 4, reps: 12, weight: 10, alts: ["lateral-cable"] },
      { ex: "tri-pushdown", sets: 3, reps: 12, weight: 27, alts: ["tri-overhead", "tri-skull"] },
    ],
  },
  {
    id: "w2",
    name: "Pull A",
    exercises: [
      { ex: "deadlift", sets: 3, reps: 5, weight: 140, alts: ["rdl"] },
      { ex: "pullup", sets: 4, reps: 8, weight: 0, alts: ["pulldown", "chinup"] },
      { ex: "row-bb", sets: 3, reps: 8, weight: 80, alts: ["row-db", "row-seated"] },
      { ex: "face-pull", sets: 3, reps: 15, weight: 18, alts: ["rear-delt"] },
      { ex: "curl-bb", sets: 3, reps: 10, weight: 35, alts: ["curl-db", "curl-hammer"] },
    ],
  },
  {
    id: "w3",
    name: "Leg Day",
    exercises: [
      { ex: "squat-bb", sets: 4, reps: 5, weight: 120, alts: ["squat-front", "leg-press"] },
      { ex: "rdl", sets: 3, reps: 8, weight: 100, alts: ["leg-curl", "nordic"] },
      { ex: "leg-press", sets: 3, reps: 10, weight: 200, alts: ["lunge-walk", "bulgarian"] },
      { ex: "leg-ext", sets: 3, reps: 12, weight: 55, alts: ["squat-goblet"] },
      { ex: "calf-standing", sets: 4, reps: 12, weight: 90, alts: ["calf-seated"] },
    ],
  },
  {
    id: "w4",
    name: "Upper B",
    exercises: [
      { ex: "incline-bb", sets: 4, reps: 6, weight: 75, alts: ["incline-db"] },
      { ex: "row-db", sets: 4, reps: 8, weight: 32, alts: ["row-bb", "row-seated"] },
      { ex: "arnold", sets: 3, reps: 10, weight: 20, alts: ["ohp-db"] },
      { ex: "pulldown", sets: 3, reps: 10, weight: 60, alts: ["pullup", "chinup"] },
      { ex: "curl-incline", sets: 3, reps: 10, weight: 12, alts: ["curl-preacher", "curl-db"] },
      { ex: "tri-skull", sets: 3, reps: 10, weight: 30, alts: ["tri-pushdown"] },
    ],
  },
];

export const SESSION_HISTORY: SessionLog[] = (() => {
  const out: SessionLog[] = [];
  const today = new Date("2026-04-22");
  for (let i = 31; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i * 2);
    const slot = DEFAULT_PROGRAM[i % 4];
    const ramp = 1 + (31 - i) * 0.005;
    const exs = slot.exercises.map((e) => ({
      ex: e.ex,
      weight: Math.round((e.weight / ramp) * 10) / 10,
      reps: e.reps,
      sets: e.sets,
    }));
    const vol = exs.reduce((s, e) => s + e.weight * e.reps * e.sets, 0);
    out.push({
      date: d.toISOString().slice(0, 10),
      slotId: slot.id,
      slotName: slot.name,
      exercises: exs,
      volume: Math.round(vol),
    });
  }
  return out;
})();
