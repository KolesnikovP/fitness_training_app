import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { G } from "@/shared/config/gridiron";
import { Chip, NumStepper } from "@/shared/ui";
import { WorkoutSlot, SlotExercise } from "@/entities/workout/model";
import { findExercise, muscleShort } from "@/entities/exercise/model";

// ── SlotCard ──────────────────────────────────────────────────────────────────

interface SlotCardProps {
  slot: WorkoutSlot;
  idx: number;
  expanded: boolean;
  onToggle: () => void;
  onRename: (name: string) => void;
  onSubstitute: (i: number) => void;
  onUpdate: (i: number, patch: Partial<SlotExercise>) => void;
  onRemove: (i: number) => void;
}

export function SlotCard({
  slot,
  idx,
  expanded,
  onToggle,
  onRename,
  onSubstitute,
  onUpdate,
  onRemove,
}: SlotCardProps) {
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(slot.name);
  const totalSets = slot.exercises.reduce((s, e) => s + e.sets, 0);

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.header} onPress={onToggle} activeOpacity={0.8}>
        <View style={styles.num}>
          <Text style={styles.numText}>{String(idx + 1).padStart(2, "0")}</Text>
        </View>
        <View style={{ flex: 1 }}>
          {editing ? (
            <TextInput
              autoFocus
              value={tempName}
              onChangeText={setTempName}
              onBlur={() => {
                onRename(tempName.trim() || slot.name);
                setEditing(false);
              }}
              onSubmitEditing={() => {
                onRename(tempName.trim() || slot.name);
                setEditing(false);
              }}
              style={styles.nameInput}
            />
          ) : (
            <TouchableOpacity onPress={(e) => { e.stopPropagation?.(); setEditing(true); }}>
              <Text style={styles.name}>{slot.name}</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.meta}>
            {slot.exercises.length} EXERCISES · {totalSets} SETS
          </Text>
        </View>
        <Text style={[styles.chevron, expanded && { transform: [{ rotate: "180deg" }] }]}>›</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.body}>
          {slot.exercises.map((entry, i) => (
            <ExerciseRow
              key={i}
              entry={entry}
              onSubstitute={() => onSubstitute(i)}
              onUpdate={(patch) => onUpdate(i, patch)}
              onRemove={() => onRemove(i)}
            />
          ))}
          <TouchableOpacity style={styles.addExBtn}>
            <Text style={styles.addExText}>+ Add exercise</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ── ExerciseRow ────────────────────────────────────────────────────────────────

interface ExerciseRowProps {
  entry: SlotExercise;
  onSubstitute: () => void;
  onUpdate: (patch: Partial<SlotExercise>) => void;
  onRemove: () => void;
}

function ExerciseRow({ entry, onSubstitute, onUpdate, onRemove }: ExerciseRowProps) {
  const ex = findExercise(entry.ex);
  if (!ex) return null;

  return (
    <View style={styles.exRow}>
      <View style={styles.exRowTop}>
        <View style={styles.exThumb}>
          <Text style={styles.exThumbText}>{ex.groups[0][0]}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.exName} numberOfLines={1}>{ex.name}</Text>
          <View style={{ flexDirection: "row", gap: 4, marginTop: 3, flexWrap: "wrap" }}>
            {ex.groups.slice(0, 2).map((g) => (
              <Chip key={g}>{muscleShort(g)}</Chip>
            ))}
          </View>
        </View>
        <TouchableOpacity onPress={onSubstitute} style={styles.swapBtn}>
          <Text style={styles.swapBtnText}>⇄</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.steppers}>
        <NumStepper
          label="Sets"
          value={entry.sets}
          onInc={() => onUpdate({ sets: Math.min(10, entry.sets + 1) })}
          onDec={() => onUpdate({ sets: Math.max(1, entry.sets - 1) })}
        />
        <NumStepper
          label="Reps"
          value={entry.reps}
          onInc={() => onUpdate({ reps: Math.min(30, entry.reps + 1) })}
          onDec={() => onUpdate({ reps: Math.max(1, entry.reps - 1) })}
        />
        <NumStepper
          label="Weight"
          value={entry.weight}
          unit="kg"
          decimals={1}
          onInc={() => onUpdate({ weight: Math.round((entry.weight + 2.5) * 10) / 10 })}
          onDec={() => onUpdate({ weight: Math.max(0, Math.round((entry.weight - 2.5) * 10) / 10) })}
        />
      </View>

      {entry.alts.length > 0 && (
        <View style={styles.alts}>
          <Text style={styles.altsLabel}>ALTERNATES: </Text>
          {entry.alts.map((a) => {
            const ae = findExercise(a);
            return ae ? <Chip key={a} tone="ghost">{ae.name.toUpperCase()}</Chip> : null;
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: G.surface,
    borderRadius: G.radius.lg,
    borderWidth: 1,
    borderColor: G.hairline,
    overflow: "hidden",
  },
  header: { padding: 14, flexDirection: "row", alignItems: "center", gap: 12 },
  num: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: G.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  numText: { color: G.accent, fontSize: 13, fontWeight: "700" },
  name: { fontSize: 16, fontWeight: "700", color: G.textHi, letterSpacing: -0.3, marginBottom: 2 },
  nameInput: {
    backgroundColor: G.elevated,
    borderWidth: 1,
    borderColor: G.accent,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    color: G.textHi,
    fontSize: 16,
    fontWeight: "700",
  },
  meta: { fontSize: 11, color: G.muted, letterSpacing: 0.8, textTransform: "uppercase" },
  chevron: { fontSize: 24, color: G.muted, transform: [{ rotate: "90deg" }] },
  body: { borderTopWidth: 1, borderTopColor: G.hairline, paddingVertical: 4 },

  exRow: {
    padding: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: G.hairline,
    gap: 10,
  },
  exRowTop: { flexDirection: "row", alignItems: "center", gap: 10 },
  exThumb: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: G.elevated,
    borderWidth: 1,
    borderColor: G.hairline,
    alignItems: "center",
    justifyContent: "center",
  },
  exThumbText: { fontSize: 16, fontWeight: "700", color: G.accent },
  exName: { fontSize: 14, fontWeight: "700", color: G.text, letterSpacing: -0.2 },
  swapBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: G.elevated,
    borderWidth: 1,
    borderColor: G.hairline,
    alignItems: "center",
    justifyContent: "center",
  },
  swapBtnText: { color: G.secondary, fontSize: 18 },
  steppers: { flexDirection: "row", gap: 8 },
  alts: { flexDirection: "row", flexWrap: "wrap", gap: 4, alignItems: "center" },
  altsLabel: { fontSize: 10, color: G.muted, letterSpacing: 0.6, textTransform: "uppercase" },

  addExBtn: {
    margin: 12,
    height: 40,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: G.hairline,
    borderRadius: G.radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  addExText: { color: G.secondary, fontSize: 13, fontWeight: "600" },
});
