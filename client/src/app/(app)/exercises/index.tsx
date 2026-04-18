import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiRequest } from "@/shared/api/client";

interface Exercise {
  ID: string;
  Name: string;
  Category: string;
  MuscleGroup: string;
  Equipment: string | null;
  Description: string | null;
}

const CATEGORIES = ["All", "Strength", "Cardio", "Mobility"];

export default function ExerciseLibraryScreen() {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState("All");
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    apiRequest("/api/v1/exercises")
      .then((res) => {
        if (!res.ok) throw new Error("Server error.");
        return res.json();
      })
      .then(setExercises)
      .catch((err) => {
        if (err instanceof TypeError) {
          setError("Unable to connect. Check your internet connection.");
        } else {
          setError("Something went wrong on our end. Please try again.");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = category === "All" ? exercises : exercises.filter((e) => e.Category === category);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={styles.filterContent}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, category === cat && styles.chipActive]}
            onPress={() => setCategory(cat)}
          >
            <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.ID}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push(`/(app)/exercises/${item.ID}`)}>
            <Text style={styles.exerciseName}>{item.Name}</Text>
            <Text style={styles.meta}>
              {item.Category} · {item.MuscleGroup}
              {item.Equipment ? ` · ${item.Equipment}` : ""}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No exercises found.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f5f5" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  filterRow: { flexGrow: 0, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#eee" },
  filterContent: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
  },
  chipActive: { backgroundColor: "#007AFF" },
  chipText: { fontSize: 13, color: "#555" },
  chipTextActive: { color: "#fff", fontWeight: "600" },
  list: { padding: 16, gap: 10 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  exerciseName: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  meta: { fontSize: 13, color: "#666" },
  errorText: { color: "#D32F2F", fontSize: 14, backgroundColor: "#FFEBEE", padding: 12, margin: 16, borderRadius: 6 },
  empty: { textAlign: "center", color: "#999", marginTop: 40 },
});
