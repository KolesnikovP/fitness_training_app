import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiRequest } from "@/shared/api/client";

interface SessionExercise {
  ExerciseID: string;
  Sets: number;
  Reps: number;
  WeightKg: number | null;
}

interface WorkoutSession {
  ID: string;
  LoggedAt: string;
  Notes: string | null;
  Exercises: SessionExercise[];
}

export default function WorkoutHistoryScreen() {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  const fetchSessions = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    setError(null);

    try {
      const res = await apiRequest("/api/v1/workouts");
      if (!res.ok) throw new Error("Server error.");
      const data = await res.json();
      setSessions(data ?? []);
    } catch (err) {
      if (err instanceof TypeError) {
        setError("Unable to connect. Check your internet connection.");
      } else {
        setError("Something went wrong on our end. Please try again.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchSessions();
  }, [fetchSessions]);

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

      <FlatList
        data={sessions}
        keyExtractor={(item) => item.ID}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchSessions(true)} />}
        renderItem={({ item }) => <SessionCard session={item} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No workouts logged yet.</Text>
            <Text style={styles.emptySubText}>Log your first workout in the Log tab.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

function SessionCard({ session }: { session: WorkoutSession }) {
  const date = new Date(session.LoggedAt);
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const exerciseCount = session.Exercises?.length ?? 0;
  const totalSets = session.Exercises?.reduce((sum, e) => sum + e.Sets, 0) ?? 0;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardDate}>{formattedDate}</Text>
        <Text style={styles.cardTime}>{formattedTime}</Text>
      </View>

      <View style={styles.statRow}>
        <Stat label="Exercises" value={String(exerciseCount)} />
        <Stat label="Total Sets" value={String(totalSets)} />
      </View>

      {session.Notes && <Text style={styles.notes}>{session.Notes}</Text>}
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f5f5" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { padding: 16, gap: 12 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    gap: 10,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardDate: { fontSize: 16, fontWeight: "600", color: "#111" },
  cardTime: { fontSize: 13, color: "#888" },
  statRow: { flexDirection: "row", gap: 16 },
  stat: { alignItems: "center" },
  statValue: { fontSize: 22, fontWeight: "700", color: "#007AFF" },
  statLabel: { fontSize: 12, color: "#888", marginTop: 2 },
  notes: { fontSize: 13, color: "#555", fontStyle: "italic", borderTopWidth: 1, borderTopColor: "#f0f0f0", paddingTop: 8 },
  errorText: { color: "#D32F2F", fontSize: 14, backgroundColor: "#FFEBEE", padding: 12, margin: 16, borderRadius: 6 },
  emptyContainer: { alignItems: "center", marginTop: 60, gap: 8 },
  emptyText: { fontSize: 17, fontWeight: "600", color: "#555" },
  emptySubText: { fontSize: 14, color: "#999" },
});
