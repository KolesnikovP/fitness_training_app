import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
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

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiRequest(`/api/v1/exercises/${id}`)
      .then((res) => {
        if (res.status === 404) throw new Error("Exercise not found.");
        if (!res.ok) throw new Error("Server error.");
        return res.json();
      })
      .then(setExercise)
      .catch((err) => {
        if (err instanceof TypeError) {
          setError("Unable to connect. Check your internet connection.");
        } else {
          setError(err.message ?? "Something went wrong on our end. Please try again.");
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error || !exercise) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error ?? "Exercise not found."}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.name}>{exercise.Name}</Text>

        <View style={styles.tagRow}>
          <Tag label={exercise.Category} />
          <Tag label={exercise.MuscleGroup} />
          {exercise.Equipment && <Tag label={exercise.Equipment} />}
        </View>

        {exercise.Description && (
          <>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{exercise.Description}</Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  content: { padding: 24, gap: 16 },
  name: { fontSize: 26, fontWeight: "700" },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: { backgroundColor: "#E3F2FD", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12 },
  tagText: { fontSize: 13, color: "#1565C0", fontWeight: "500" },
  sectionTitle: { fontSize: 17, fontWeight: "600", marginTop: 8 },
  description: { fontSize: 15, color: "#444", lineHeight: 22 },
  errorText: { color: "#D32F2F", fontSize: 15, textAlign: "center" },
});
