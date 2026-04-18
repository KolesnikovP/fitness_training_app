import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
}

interface SelectedExercise {
  exercise: Exercise;
  sets: string;
  reps: string;
  weightKg: string;
}

type SubmitState = "idle" | "loading" | "success" | "error";

export default function WorkoutLogScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(true);
  const [selected, setSelected] = useState<SelectedExercise[]>([]);
  const [notes, setNotes] = useState("");
  const [search, setSearch] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    apiRequest("/api/v1/exercises")
      .then((res) => res.json())
      .then(setExercises)
      .catch(() => {})
      .finally(() => setLoadingExercises(false));
  }, []);

  function addExercise(ex: Exercise) {
    if (selected.find((s) => s.exercise.ID === ex.ID)) return;
    setSelected((prev) => [...prev, { exercise: ex, sets: "3", reps: "10", weightKg: "" }]);
  }

  function removeExercise(id: string) {
    setSelected((prev) => prev.filter((s) => s.exercise.ID !== id));
  }

  function updateField(id: string, field: "sets" | "reps" | "weightKg", value: string) {
    setSelected((prev) => prev.map((s) => (s.exercise.ID === id ? { ...s, [field]: value } : s)));
  }

  async function handleSubmit() {
    if (selected.length === 0) {
      setSubmitError("Add at least one exercise.");
      return;
    }

    setSubmitState("loading");
    setSubmitError(null);

    const body = {
      notes: notes.trim() || null,
      exercises: selected.map((s) => ({
        exercise_id: s.exercise.ID,
        sets: parseInt(s.sets, 10) || 1,
        reps: parseInt(s.reps, 10) || 1,
        weight_kg: s.weightKg ? parseFloat(s.weightKg) : null,
      })),
    };

    try {
      const res = await apiRequest("/api/v1/workouts", {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error?.message ?? "Failed to save workout.");
      }

      setSubmitState("success");
      setSelected([]);
      setNotes("");
    } catch (err) {
      setSubmitState("error");
      if (err instanceof TypeError) {
        setSubmitError("Unable to connect. Check your internet connection.");
      } else {
        setSubmitError((err as Error).message ?? "Something went wrong. Please try again.");
      }
    }
  }

  const filtered = exercises.filter(
    (e) =>
      e.Name.toLowerCase().includes(search.toLowerCase()) ||
      e.Category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          {submitState === "success" && (
            <View style={styles.successBanner}>
              <Text style={styles.successText}>Workout logged successfully!</Text>
            </View>
          )}

          {submitError && <Text style={styles.errorText}>{submitError}</Text>}

          <Text style={styles.sectionTitle}>Select Exercises</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises..."
            value={search}
            onChangeText={setSearch}
          />

          {loadingExercises ? (
            <ActivityIndicator style={{ marginVertical: 12 }} color="#007AFF" />
          ) : (
            <View style={styles.exerciseList}>
              {filtered.slice(0, 15).map((ex) => {
                const isSelected = selected.some((s) => s.exercise.ID === ex.ID);
                return (
                  <TouchableOpacity
                    key={ex.ID}
                    style={[styles.exerciseChip, isSelected && styles.exerciseChipSelected]}
                    onPress={() => (isSelected ? removeExercise(ex.ID) : addExercise(ex))}
                  >
                    <Text style={[styles.exerciseChipText, isSelected && styles.exerciseChipTextSelected]}>
                      {ex.Name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {selected.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Exercise Details</Text>
              {selected.map((s) => (
                <View key={s.exercise.ID} style={styles.exerciseCard}>
                  <View style={styles.exerciseCardHeader}>
                    <Text style={styles.exerciseCardName}>{s.exercise.Name}</Text>
                    <TouchableOpacity onPress={() => removeExercise(s.exercise.ID)}>
                      <Text style={styles.removeText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.inputRow}>
                    <LabeledInput label="Sets" value={s.sets} onChangeText={(v) => updateField(s.exercise.ID, "sets", v)} />
                    <LabeledInput label="Reps" value={s.reps} onChangeText={(v) => updateField(s.exercise.ID, "reps", v)} />
                    <LabeledInput label="Weight (kg)" value={s.weightKg} onChangeText={(v) => updateField(s.exercise.ID, "weightKg", v)} keyboardType="decimal-pad" />
                  </View>
                </View>
              ))}
            </>
          )}

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Notes (optional)</Text>
          <TextInput
            style={[styles.searchInput, { height: 80, textAlignVertical: "top" }]}
            placeholder="Add session notes..."
            multiline
            value={notes}
            onChangeText={setNotes}
          />

          <TouchableOpacity
            style={[styles.submitButton, submitState === "loading" && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={submitState === "loading"}
          >
            {submitState === "loading" ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Log Workout</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function LabeledInput({
  label,
  value,
  onChangeText,
  keyboardType = "number-pad",
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: "number-pad" | "decimal-pad";
}) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput style={styles.smallInput} value={value} onChangeText={onChangeText} keyboardType={keyboardType} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f5f5" },
  scroll: { padding: 16, gap: 10 },
  sectionTitle: { fontSize: 17, fontWeight: "600", color: "#111" },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  exerciseList: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  exerciseChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#e8e8e8",
  },
  exerciseChipSelected: { backgroundColor: "#007AFF" },
  exerciseChipText: { fontSize: 13, color: "#333" },
  exerciseChipTextSelected: { color: "#fff", fontWeight: "600" },
  exerciseCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  exerciseCardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  exerciseCardName: { fontSize: 15, fontWeight: "600", flex: 1 },
  removeText: { color: "#FF3B30", fontSize: 13 },
  inputRow: { flexDirection: "row", gap: 10 },
  inputLabel: { fontSize: 12, color: "#888", marginBottom: 4 },
  smallInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 15,
    backgroundColor: "#fafafa",
  },
  submitButton: {
    backgroundColor: "#34C759",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 12,
  },
  buttonDisabled: { opacity: 0.6 },
  submitButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  successBanner: { backgroundColor: "#E8F5E9", borderRadius: 8, padding: 12 },
  successText: { color: "#2E7D32", fontSize: 14, fontWeight: "600" },
  errorText: { color: "#D32F2F", fontSize: 14, backgroundColor: "#FFEBEE", padding: 10, borderRadius: 6 },
});
