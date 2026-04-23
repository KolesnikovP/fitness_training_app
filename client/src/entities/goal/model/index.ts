export interface Goal {
  id: string;
  kind: "bodyweight" | "strength" | "frequency";
  label: string;
  exercise?: string;
  current: number;
  target: number;
  unit: string;
  deadline?: string;
}

export const GOALS: Goal[] = [
  { id: "g1", kind: "bodyweight", label: "Cut to 78 kg", current: 82.4, target: 78, unit: "kg", deadline: "2026-07-01" },
  { id: "g2", kind: "strength", label: "Squat 140 × 5", exercise: "squat-bb", current: 120, target: 140, unit: "kg", deadline: "2026-08-15" },
  { id: "g3", kind: "frequency", label: "Train 4× / week", current: 3, target: 4, unit: "sessions" },
  { id: "g4", kind: "strength", label: "Bench 110 × 5", exercise: "bench-bb", current: 102.5, target: 110, unit: "kg", deadline: "2026-06-01" },
];

export interface BodyWeightEntry {
  date: string;
  weight: number;
}

export const BODY_WEIGHT_LOG: BodyWeightEntry[] = (() => {
  const out: BodyWeightEntry[] = [];
  const start = new Date("2026-02-01");
  let w = 85.2;
  for (let i = 0; i < 12; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i * 7);
    w -= 0.2 + Math.random() * 0.3;
    out.push({ date: d.toISOString().slice(0, 10), weight: Math.round(w * 10) / 10 });
  }
  return out;
})();
