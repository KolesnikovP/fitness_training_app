import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { G } from "@/shared/config/gridiron";
import { Card } from "@/shared/ui";
import { Chip } from "@/shared/ui";
import { Exercise, muscleShort } from "@/entities/exercise/model";

interface ExerciseCardProps {
  exercise: Exercise;
  onAdd: () => void;
}

export function ExerciseCard({ exercise, onAdd }: ExerciseCardProps) {
  return (
    <Card pad={14}>
      <View style={styles.row}>
        <View style={styles.thumb}>
          <Text style={styles.thumbText}>{exercise.groups[0][0]}</Text>
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.name} numberOfLines={1}>
            {exercise.name}
          </Text>
          <View style={{ flexDirection: "row", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
            {exercise.groups.slice(0, 2).map((g) => (
              <Chip key={g}>{muscleShort(g)}</Chip>
            ))}
            <Chip tone="ghost">{exercise.equipment}</Chip>
          </View>
        </View>
        <TouchableOpacity onPress={onAdd} style={styles.addBtn}>
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 14 },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: G.elevated,
    borderWidth: 1,
    borderColor: G.hairline,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  thumbText: { fontSize: 22, fontWeight: "700", color: G.accent },
  name: { fontSize: 15, fontWeight: "700", color: G.text, letterSpacing: -0.2 },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: G.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  addBtnText: { color: G.accent, fontSize: 24, fontWeight: "300", lineHeight: 30 },
});
