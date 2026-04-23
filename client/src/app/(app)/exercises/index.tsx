import React, { useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { G } from "@/shared/config/gridiron";
import { BottomSheet, ScreenHeader } from "@/shared/ui";
import { EXERCISES, MUSCLE_GROUPS, EQUIPMENT, Exercise, MuscleGroup } from "@/entities/exercise/model";
import { ExerciseCard } from "@/entities/exercise/ui/exercise-card";
import { FilterPill } from "@/features/filter-exercises/ui/filter-pill";
import { AddToProgramSheet } from "@/features/add-to-program/ui/add-to-program-sheet";
import { DEFAULT_PROGRAM } from "@/entities/workout/model";

export default function LibraryScreen() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<string>("All");
  const [equip, setEquip] = useState<string>("All");
  const [addTarget, setAddTarget] = useState<Exercise | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const filtered = EXERCISES.filter((e) => {
    if (query && !e.name.toLowerCase().includes(query.toLowerCase())) return false;
    if (group !== "All" && !e.groups.includes(group as MuscleGroup)) return false;
    if (equip !== "All" && e.equipment !== equip) return false;
    return true;
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  const handleAdd = (slotId: string) => {
    const slotName = DEFAULT_PROGRAM.find((s) => s.id === slotId)?.name ?? slotId;
    showToast(`${addTarget?.name} added to ${slotName}`);
    setAddTarget(null);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScreenHeader title="Library" subtitle="EXERCISE DATABASE" />

      <View style={styles.searchWrapper}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={`Search ${EXERCISES.length} exercises`}
            placeholderTextColor={G.muted}
            style={styles.searchInput}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Text style={{ color: G.muted, fontSize: 16, padding: 4 }}>×</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillRow}
        style={{ flexGrow: 0 }}
      >
        <FilterPill
          label="All"
          active={group === "All" && equip === "All"}
          onPress={() => { setGroup("All"); setEquip("All"); }}
        />
        {MUSCLE_GROUPS.map((g) => (
          <FilterPill
            key={g}
            label={g}
            active={group === g}
            onPress={() => setGroup(group === g ? "All" : g)}
          />
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.pillRow, { paddingTop: 0 }]}
        style={{ flexGrow: 0 }}
      >
        {EQUIPMENT.map((e) => (
          <FilterPill
            key={e}
            label={e}
            active={equip === e}
            size="sm"
            onPress={() => setEquip(equip === e ? "All" : e)}
          />
        ))}
      </ScrollView>

      <View style={styles.countRow}>
        <Text style={styles.countText}>{filtered.length} results</Text>
        <TouchableOpacity onPress={() => Alert.alert("Custom Exercise", "Add your own exercise.")}>
          <Text style={styles.customBtn}>+ Custom</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No exercises match.</Text>
            <Text style={styles.emptySubText}>Try a different filter or search term.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ExerciseCard exercise={item} onAdd={() => setAddTarget(item)} />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />

      {addTarget && (
        <BottomSheet visible onClose={() => setAddTarget(null)} title="Add to program">
          <AddToProgramSheet exercise={addTarget} onAdd={handleAdd} />
        </BottomSheet>
      )}

      {toast && (
        <View style={styles.toast} pointerEvents="none">
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: G.bg },
  searchWrapper: { paddingHorizontal: 20, paddingBottom: 10, paddingTop: 4 },
  searchBox: {
    height: 40,
    backgroundColor: G.elevated,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: G.hairline,
  },
  searchIcon: { fontSize: 18, color: G.muted },
  searchInput: { flex: 1, color: G.text, fontSize: 15 },
  pillRow: { paddingHorizontal: 20, gap: 6, paddingVertical: 4 },
  countRow: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  countText: { fontSize: 11, color: G.muted, textTransform: "uppercase", letterSpacing: 1 },
  customBtn: { color: G.accent, fontSize: 11, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase" },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  empty: { alignItems: "center", marginTop: 60, gap: 8 },
  emptyText: { fontSize: 17, fontWeight: "600", color: G.secondary },
  emptySubText: { fontSize: 14, color: G.muted },
  toast: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    backgroundColor: G.textHi,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  toastText: { color: G.bg, fontSize: 13, fontWeight: "600" },
});
