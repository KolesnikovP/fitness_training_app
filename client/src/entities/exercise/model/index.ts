export const MUSCLE_GROUPS = [
  "Chest",
  "Back",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Quads",
  "Hamstrings",
  "Glutes",
  "Calves",
  "Core",
] as const;

export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];

export const EQUIPMENT = [
  "Barbell",
  "Dumbbell",
  "Machine",
  "Cable",
  "Bodyweight",
  "Kettlebell",
  "Band",
] as const;

export type Equipment = (typeof EQUIPMENT)[number];

export interface Exercise {
  id: string;
  name: string;
  groups: MuscleGroup[];
  equipment: Equipment;
  note: string;
}

export const EXERCISES: Exercise[] = [
  // Chest
  { id: "bench-bb", name: "Barbell Bench Press", groups: ["Chest", "Triceps"], equipment: "Barbell", note: "Flat bench, shoulder-width grip, lower to mid-chest." },
  { id: "bench-db", name: "Dumbbell Bench Press", groups: ["Chest", "Triceps"], equipment: "Dumbbell", note: "Full stretch at bottom; press until elbows nearly lock." },
  { id: "incline-bb", name: "Incline Barbell Press", groups: ["Chest", "Shoulders"], equipment: "Barbell", note: "Bench at 30°; bar to upper chest." },
  { id: "incline-db", name: "Incline Dumbbell Press", groups: ["Chest", "Shoulders"], equipment: "Dumbbell", note: "Bench at 30–45°; control the eccentric." },
  { id: "cable-fly", name: "Cable Chest Fly", groups: ["Chest"], equipment: "Cable", note: "Slight elbow bend; squeeze at midline." },
  { id: "pec-deck", name: "Pec Deck", groups: ["Chest"], equipment: "Machine", note: "Seat height so forearms are parallel to floor." },
  { id: "pushup", name: "Push-Up", groups: ["Chest", "Triceps", "Core"], equipment: "Bodyweight", note: "Straight line from heels to head." },
  { id: "dip-chest", name: "Chest Dip", groups: ["Chest", "Triceps"], equipment: "Bodyweight", note: "Lean forward; dip until upper arms parallel." },
  // Back
  { id: "deadlift", name: "Conventional Deadlift", groups: ["Back", "Glutes", "Hamstrings"], equipment: "Barbell", note: "Bar over mid-foot, neutral spine, drive floor away." },
  { id: "rdl", name: "Romanian Deadlift", groups: ["Hamstrings", "Glutes", "Back"], equipment: "Barbell", note: "Hinge at hips; soft knees." },
  { id: "row-bb", name: "Barbell Row", groups: ["Back", "Biceps"], equipment: "Barbell", note: "Torso ~45°; pull to lower ribs." },
  { id: "row-db", name: "Dumbbell Row", groups: ["Back", "Biceps"], equipment: "Dumbbell", note: "One-arm, braced on bench." },
  { id: "pulldown", name: "Lat Pulldown", groups: ["Back", "Biceps"], equipment: "Cable", note: "Pull to upper chest; squeeze lats." },
  { id: "pullup", name: "Pull-Up", groups: ["Back", "Biceps"], equipment: "Bodyweight", note: "Chin over bar; full hang at bottom." },
  { id: "chinup", name: "Chin-Up", groups: ["Back", "Biceps"], equipment: "Bodyweight", note: "Supinated grip; emphasizes biceps." },
  { id: "row-seated", name: "Seated Cable Row", groups: ["Back", "Biceps"], equipment: "Cable", note: "Neutral spine; pull to belly button." },
  { id: "face-pull", name: "Face Pull", groups: ["Shoulders", "Back"], equipment: "Cable", note: "Elbows high; external rotation at end." },
  { id: "shrug", name: "Dumbbell Shrug", groups: ["Back"], equipment: "Dumbbell", note: "Straight up, not forward; hold 1s." },
  // Shoulders
  { id: "ohp", name: "Overhead Press", groups: ["Shoulders", "Triceps"], equipment: "Barbell", note: "Bar path over mid-foot; glutes tight." },
  { id: "ohp-db", name: "Dumbbell Shoulder Press", groups: ["Shoulders", "Triceps"], equipment: "Dumbbell", note: "Seated, neutral spine." },
  { id: "lateral-db", name: "Lateral Raise", groups: ["Shoulders"], equipment: "Dumbbell", note: "Soft elbows; lead with the pinky side." },
  { id: "lateral-cable", name: "Cable Lateral Raise", groups: ["Shoulders"], equipment: "Cable", note: "Constant tension; one arm at a time." },
  { id: "rear-delt", name: "Rear Delt Fly", groups: ["Shoulders", "Back"], equipment: "Dumbbell", note: "Hinge forward; pinch shoulder blades." },
  { id: "arnold", name: "Arnold Press", groups: ["Shoulders"], equipment: "Dumbbell", note: "Rotate palms from facing you to facing out." },
  // Arms
  { id: "curl-bb", name: "Barbell Curl", groups: ["Biceps"], equipment: "Barbell", note: "Elbows pinned; no swing." },
  { id: "curl-db", name: "Dumbbell Curl", groups: ["Biceps"], equipment: "Dumbbell", note: "Supinate as you lift." },
  { id: "curl-hammer", name: "Hammer Curl", groups: ["Biceps"], equipment: "Dumbbell", note: "Neutral grip; targets brachialis." },
  { id: "curl-preacher", name: "Preacher Curl", groups: ["Biceps"], equipment: "Machine", note: "Full stretch at bottom." },
  { id: "curl-incline", name: "Incline Dumbbell Curl", groups: ["Biceps"], equipment: "Dumbbell", note: "Bench at 60°; long-head bias." },
  { id: "tri-pushdown", name: "Triceps Pushdown", groups: ["Triceps"], equipment: "Cable", note: "Elbows pinned to sides." },
  { id: "tri-overhead", name: "Overhead Triceps Extension", groups: ["Triceps"], equipment: "Dumbbell", note: "Full stretch overhead; keep elbows close." },
  { id: "tri-skull", name: "Skull Crusher", groups: ["Triceps"], equipment: "Barbell", note: "EZ-bar; lower to forehead." },
  { id: "tri-dip", name: "Triceps Dip", groups: ["Triceps", "Chest"], equipment: "Bodyweight", note: "Upright torso; dip until 90°." },
  // Legs
  { id: "squat-bb", name: "Barbell Back Squat", groups: ["Quads", "Glutes"], equipment: "Barbell", note: "Hip crease below knee crease; brace core." },
  { id: "squat-front", name: "Front Squat", groups: ["Quads", "Core"], equipment: "Barbell", note: "Elbows high; upright torso." },
  { id: "squat-goblet", name: "Goblet Squat", groups: ["Quads", "Glutes"], equipment: "Dumbbell", note: "Hold DB at chest; elbows inside knees." },
  { id: "leg-press", name: "Leg Press", groups: ["Quads", "Glutes"], equipment: "Machine", note: "Feet shoulder-width, mid-platform." },
  { id: "lunge-walk", name: "Walking Lunge", groups: ["Quads", "Glutes"], equipment: "Dumbbell", note: "Long stride; knee tracks over toe." },
  { id: "bulgarian", name: "Bulgarian Split Squat", groups: ["Quads", "Glutes"], equipment: "Dumbbell", note: "Rear foot elevated; lean slightly forward." },
  { id: "leg-ext", name: "Leg Extension", groups: ["Quads"], equipment: "Machine", note: "Full extension; 1s hold at top." },
  { id: "leg-curl", name: "Lying Leg Curl", groups: ["Hamstrings"], equipment: "Machine", note: "Hips pinned to pad." },
  { id: "leg-curl-seated", name: "Seated Leg Curl", groups: ["Hamstrings"], equipment: "Machine", note: "Longer stretch than lying." },
  { id: "hip-thrust", name: "Hip Thrust", groups: ["Glutes", "Hamstrings"], equipment: "Barbell", note: "Upper back on bench; pause at top." },
  { id: "glute-bridge", name: "Glute Bridge", groups: ["Glutes"], equipment: "Bodyweight", note: "Squeeze glutes at top for 2s." },
  { id: "calf-standing", name: "Standing Calf Raise", groups: ["Calves"], equipment: "Machine", note: "Full stretch at bottom." },
  { id: "calf-seated", name: "Seated Calf Raise", groups: ["Calves"], equipment: "Machine", note: "Targets soleus." },
  { id: "nordic", name: "Nordic Curl", groups: ["Hamstrings"], equipment: "Bodyweight", note: "Control the eccentric as long as possible." },
  // Core
  { id: "plank", name: "Plank", groups: ["Core"], equipment: "Bodyweight", note: "Tight body line; breathe." },
  { id: "sit-up", name: "Sit-Up", groups: ["Core"], equipment: "Bodyweight", note: "Full range; controlled." },
  { id: "hang-leg", name: "Hanging Leg Raise", groups: ["Core"], equipment: "Bodyweight", note: "Straight legs; no swing." },
  { id: "cable-crunch", name: "Cable Crunch", groups: ["Core"], equipment: "Cable", note: "Round the spine — it's the point." },
  { id: "roll-out", name: "Ab Roll-Out", groups: ["Core"], equipment: "Bodyweight", note: "Hollow body; no lower-back sag." },
  { id: "russian-twist", name: "Russian Twist", groups: ["Core"], equipment: "Bodyweight", note: "Slow and controlled." },
  // Posterior / Misc
  { id: "good-morning", name: "Good Morning", groups: ["Hamstrings", "Back"], equipment: "Barbell", note: "Hinge, not squat; soft knees." },
  { id: "kb-swing", name: "Kettlebell Swing", groups: ["Glutes", "Hamstrings", "Back"], equipment: "Kettlebell", note: "Hip hinge, not squat; hike the bell back." },
  { id: "farmer", name: "Farmer's Carry", groups: ["Core", "Back"], equipment: "Dumbbell", note: "Shoulders packed; steady breath." },
  { id: "band-pull-apart", name: "Band Pull-Apart", groups: ["Shoulders", "Back"], equipment: "Band", note: "Great warm-up; squeeze shoulder blades." },
];

export function findExercise(id: string): Exercise | undefined {
  return EXERCISES.find((e) => e.id === id);
}

export function muscleShort(g: string): string {
  const map: Record<string, string> = {
    Chest: "CHEST", Back: "BACK", Shoulders: "SHLDR",
    Biceps: "BIS", Triceps: "TRIS", Quads: "QUAD",
    Hamstrings: "HAM", Glutes: "GLUTE", Calves: "CALF", Core: "CORE",
  };
  return map[g] ?? g.toUpperCase();
}
