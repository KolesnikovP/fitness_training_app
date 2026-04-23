import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { G } from "@/shared/config/gridiron";
import { SlotExercise } from "@/entities/workout/model";
import { findExercise } from "@/entities/exercise/model";

interface SubstitutionSheetProps {
  entry: SlotExercise;
  onSwap: (id: string) => void;
}

export function SubstitutionSheet({ entry, onSwap }: SubstitutionSheetProps) {
  const current = findExercise(entry.ex);
  const alts = entry.alts.map((id) => findExercise(id)).filter(Boolean);

  return (
    <ScrollView style={{ paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionLabel}>CURRENT</Text>
      {current && (
        <View style={[styles.card, { opacity: 0.6, marginBottom: 18 }]}>
          <View style={styles.thumb}>
            <Text style={styles.thumbText}>{current.groups[0][0]}</Text>
          </View>
          <View>
            <Text style={styles.exName}>{current.name}</Text>
            <Text style={styles.exMeta}>
              {current.groups.map((g) => g.toUpperCase()).join(" · ")}
            </Text>
          </View>
        </View>
      )}

      <Text style={styles.sectionLabel}>SWAP TO ({alts.length} PRESET)</Text>
      {alts.map(
        (ae) =>
          ae && (
            <TouchableOpacity
              key={ae.id}
              onPress={() => onSwap(ae.id)}
              style={styles.card}
              activeOpacity={0.75}
            >
              <View style={styles.thumb}>
                <Text style={styles.thumbText}>{ae.groups[0][0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.exName}>{ae.name}</Text>
                <Text style={styles.exMeta}>
                  {ae.equipment} · {ae.groups[0].toUpperCase()}
                </Text>
              </View>
              <Text style={{ color: G.accent, fontSize: 18 }}>›</Text>
            </TouchableOpacity>
          ),
      )}
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: 10,
    color: G.muted,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 4,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: G.elevated,
    borderRadius: G.radius.md,
    borderWidth: 1,
    borderColor: G.hairline,
    padding: 12,
    marginBottom: 8,
  },
  thumb: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: G.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbText: { fontSize: 16, fontWeight: "700", color: G.accent },
  exName: { fontSize: 14, fontWeight: "700", color: G.text, marginBottom: 2 },
  exMeta: { fontSize: 11, color: G.secondary, letterSpacing: 0.5 },
});
