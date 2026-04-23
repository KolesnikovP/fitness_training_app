import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { G } from "@/shared/config/gridiron";
import { Exercise } from "@/entities/exercise/model";
import { DEFAULT_PROGRAM } from "@/entities/workout/model";

interface AddToProgramSheetProps {
  exercise: Exercise;
  onAdd: (slotId: string) => void;
}

export function AddToProgramSheet({ exercise, onAdd }: AddToProgramSheetProps) {
  return (
    <ScrollView style={{ paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
      <View style={styles.preview}>
        <View style={styles.thumb}>
          <Text style={styles.thumbText}>{exercise.groups[0][0]}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{exercise.name}</Text>
          <Text style={{ fontSize: 11, color: G.secondary, marginTop: 2, letterSpacing: 0.5 }}>
            {exercise.groups.join(" · ").toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={styles.slotLabel}>PICK A WORKOUT SLOT</Text>

      {DEFAULT_PROGRAM.map((slot) => (
        <TouchableOpacity
          key={slot.id}
          onPress={() => onAdd(slot.id)}
          style={styles.slotOption}
          activeOpacity={0.75}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.slotName}>{slot.name}</Text>
            <Text style={styles.slotMeta}>{slot.exercises.length} exercises</Text>
          </View>
          <View style={styles.slotBtn}>
            <Text style={{ color: G.accentInk, fontSize: 18, fontWeight: "700" }}>+</Text>
          </View>
        </TouchableOpacity>
      ))}

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  preview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: G.hairline,
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: G.elevated,
    borderWidth: 1,
    borderColor: G.hairline,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbText: { fontSize: 22, fontWeight: "700", color: G.accent },
  name: { fontSize: 15, fontWeight: "700", color: G.text, letterSpacing: -0.2 },
  slotLabel: {
    fontSize: 10,
    color: G.muted,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    fontWeight: "600",
    marginBottom: 8,
  },
  slotOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: G.elevated,
    borderWidth: 1,
    borderColor: G.hairline,
    borderRadius: G.radius.md,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  slotName: { fontSize: 15, fontWeight: "700", color: G.text, marginBottom: 2 },
  slotMeta: { fontSize: 12, color: G.secondary },
  slotBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: G.accent,
    alignItems: "center",
    justifyContent: "center",
  },
});
