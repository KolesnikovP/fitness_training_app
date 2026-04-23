import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { G } from "@/shared/config/gridiron";
import { BottomSheet, ScreenHeader } from "@/shared/ui";
import { DEFAULT_PROGRAM, WorkoutSlot, SlotExercise } from "@/entities/workout/model";
import { SlotCard } from "@/widgets/slot-card/ui";
import { SubstitutionSheet } from "@/features/substitute-exercise/ui/substitution-sheet";

export default function ProgramScreen() {
  const [program, setProgram] = useState<WorkoutSlot[]>(() =>
    JSON.parse(JSON.stringify(DEFAULT_PROGRAM)),
  );
  const [expanded, setExpanded] = useState<string | null>(program[0]?.id ?? null);
  const [subFor, setSubFor] = useState<{ slotId: string; idx: number } | null>(null);

  const toggleExpand = (id: string) =>
    setExpanded((prev) => (prev === id ? null : id));

  const renameSlot = (slotId: string, name: string) =>
    setProgram((p) => p.map((s) => (s.id === slotId ? { ...s, name } : s)));

  const updateExercise = (slotId: string, idx: number, patch: Partial<SlotExercise>) =>
    setProgram((p) =>
      p.map((s) =>
        s.id === slotId
          ? { ...s, exercises: s.exercises.map((e, i) => (i === idx ? { ...e, ...patch } : e)) }
          : s,
      ),
    );

  const swapExercise = (slotId: string, idx: number, newEx: string) => {
    updateExercise(slotId, idx, { ex: newEx });
    setSubFor(null);
  };

  const removeExercise = (slotId: string, idx: number) =>
    setProgram((p) =>
      p.map((s) =>
        s.id === slotId
          ? { ...s, exercises: s.exercises.filter((_, i) => i !== idx) }
          : s,
      ),
    );

  const subSlot = subFor ? program.find((s) => s.id === subFor.slotId) : null;
  const subEntry = subSlot && subFor ? subSlot.exercises[subFor.idx] : null;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScreenHeader
        title="Program"
        subtitle={`ROTATION · ${program.length} WORKOUTS`}
        trailing={
          <TouchableOpacity
            onPress={() => Alert.alert("Share", "Share link copied to clipboard.")}
            style={styles.shareBtn}
          >
            <Text style={styles.shareBtnText}>↑ Share</Text>
          </TouchableOpacity>
        }
      />

      <Text style={styles.infoText}>
        Workouts run in sequence — no days assigned. Tap a slot to edit sets, reps and alternates.
      </Text>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {program.map((slot, idx) => (
          <SlotCard
            key={slot.id}
            slot={slot}
            idx={idx}
            expanded={expanded === slot.id}
            onToggle={() => toggleExpand(slot.id)}
            onRename={(name) => renameSlot(slot.id, name)}
            onSubstitute={(i) => setSubFor({ slotId: slot.id, idx: i })}
            onUpdate={(i, patch) => updateExercise(slot.id, i, patch)}
            onRemove={(i) => removeExercise(slot.id, i)}
          />
        ))}

        <TouchableOpacity style={styles.addSlotBtn}>
          <Text style={styles.addSlotText}>+ Add workout slot</Text>
        </TouchableOpacity>
      </ScrollView>

      {subFor && subSlot && subEntry && (
        <BottomSheet visible onClose={() => setSubFor(null)} title="Substitute exercise">
          <SubstitutionSheet
            entry={subEntry}
            onSwap={(newEx) => swapExercise(subFor.slotId, subFor.idx, newEx)}
          />
        </BottomSheet>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: G.bg },
  infoText: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 8,
    fontSize: 12,
    color: G.secondary,
    lineHeight: 18,
  },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 10, paddingBottom: 40 },
  shareBtn: {
    backgroundColor: G.elevated,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: G.radius.full,
    borderWidth: 1,
    borderColor: G.hairline,
  },
  shareBtnText: { color: G.text, fontSize: 12, fontWeight: "600" },
  addSlotBtn: {
    height: 48,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: G.hairline,
    borderRadius: G.radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  addSlotText: { color: G.secondary, fontSize: 14, fontWeight: "600" },
});
