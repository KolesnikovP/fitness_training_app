import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { G } from "@/shared/config/gridiron";
import { Card, Chip, ProgressBar, ProgressRing } from "@/shared/ui";
import { DEFAULT_PROGRAM, SESSION_HISTORY } from "@/entities/workout/model";
import { GOALS } from "@/entities/goal/model";
import { findExercise, muscleShort } from "@/entities/exercise/model";

export default function HomeScreen() {
  const nextSlot = DEFAULT_PROGRAM[2]; // Leg Day — slot #3 in rotation
  const lastSession = SESSION_HISTORY[SESSION_HISTORY.length - 1];
  const activeGoal = GOALS[1]; // Squat goal
  const goalEx = findExercise(activeGoal.exercise ?? "");
  const sessionsThisWeek = 3;
  const weeklyGoal = 4;

  const today = new Date("2026-04-22");
  const dateLabel = today.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <View style={styles.greeting}>
          <Text style={styles.greetingDate}>{dateLabel.toUpperCase()}</Text>
          <Text style={styles.greetingName}>Good evening.</Text>
        </View>

        {/* Next up hero */}
        <TouchableOpacity activeOpacity={0.85} style={styles.hero}>
          <View style={styles.heroDecoration} />
          <Text style={styles.heroEyebrow}>NEXT UP · #3 IN ROTATION</Text>
          <Text style={styles.heroTitle}>{nextSlot.name}</Text>
          <Text style={styles.heroMeta}>
            {nextSlot.exercises.length} EXERCISES ·{" "}
            {nextSlot.exercises.reduce((s, e) => s + e.sets, 0)} SETS
          </Text>
          <View style={styles.heroBtn}>
            <Text style={styles.heroBtnText}>▶ Quick Start</Text>
          </View>
        </TouchableOpacity>

        {/* Weekly + Last session row */}
        <View style={styles.row}>
          {/* Weekly ring */}
          <Card pad={16} style={styles.weeklyCard}>
            <Text style={styles.cardLabel}>THIS WEEK</Text>
            <View style={styles.weeklyContent}>
              <ProgressRing
                value={sessionsThisWeek}
                max={weeklyGoal}
                size={68}
                label={`${sessionsThisWeek}/${weeklyGoal}`}
                sublabel="sessions"
              />
              <View style={styles.weeklyDays}>
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                  <View
                    key={i}
                    style={[styles.dayDot, i < 3 && styles.dayDotActive]}
                  >
                    <Text
                      style={[
                        styles.dayDotText,
                        i < 3 && styles.dayDotTextActive,
                      ]}
                    >
                      {d}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </Card>

          {/* Last session */}
          <Card pad={16} style={styles.lastCard}>
            <Text style={styles.cardLabel}>LAST SESSION</Text>
            <Text style={styles.lastSlotName}>{lastSession.slotName}</Text>
            <Text style={styles.lastDate}>
              {new Date(lastSession.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </Text>
            <View style={styles.lastStat}>
              <Text style={styles.lastStatVal}>
                {(lastSession.volume / 1000).toFixed(1)}t
              </Text>
              <Text style={styles.lastStatLabel}>volume</Text>
            </View>
          </Card>
        </View>

        {/* Active goal */}
        <Card pad={16}>
          <Text style={styles.cardLabel}>ACTIVE GOAL</Text>
          <Text style={styles.goalLabel}>{activeGoal.label}</Text>
          <View style={styles.goalProgress}>
            <View style={{ flex: 1 }}>
              <ProgressBar
                value={activeGoal.current}
                max={activeGoal.target}
                height={6}
              />
              <View style={styles.goalMeta}>
                <Text style={styles.goalCurrent}>
                  {activeGoal.current} {activeGoal.unit}
                </Text>
                <Text style={styles.goalTarget}>
                  / {activeGoal.target} {activeGoal.unit}
                </Text>
              </View>
            </View>
            {activeGoal.deadline && (
              <View style={styles.goalDeadline}>
                <Text style={styles.goalDeadlineText}>
                  {new Date(activeGoal.deadline).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
                <Text style={styles.goalDeadlineLabel}>deadline</Text>
              </View>
            )}
          </View>
        </Card>

        {/* Next workout exercises preview */}
        <View style={styles.previewHeader}>
          <Text style={styles.previewTitle}>
            {nextSlot.name} · Exercise List
          </Text>
        </View>
        {nextSlot.exercises.map((entry, i) => {
          const ex = findExercise(entry.ex);
          if (!ex) return null;
          return (
            <Card key={i} pad={14} style={styles.previewCard}>
              <View style={styles.previewRow}>
                <View style={styles.previewThumb}>
                  <Text style={styles.previewThumbText}>{ex.groups[0][0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.previewExName}>{ex.name}</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 4,
                      marginTop: 3,
                      flexWrap: "wrap",
                    }}
                  >
                    {ex.groups.slice(0, 2).map((g) => (
                      <Chip key={g}>{muscleShort(g)}</Chip>
                    ))}
                  </View>
                </View>
                <Text style={styles.previewSpec}>
                  {entry.sets}×{entry.reps}
                </Text>
              </View>
            </Card>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: G.bg },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 12, paddingBottom: 40 },

  greeting: { paddingVertical: 8, paddingHorizontal: 4 },
  greetingDate: {
    fontSize: 12,
    color: G.secondary,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  greetingName: {
    fontSize: 28,
    fontWeight: "700",
    color: G.textHi,
    letterSpacing: -0.8,
    lineHeight: 32,
  },

  hero: {
    backgroundColor: G.accent,
    borderRadius: G.radius.xl,
    padding: 20,
    overflow: "hidden",
    position: "relative",
  },
  heroDecoration: {
    position: "absolute",
    right: -40,
    top: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  heroEyebrow: {
    fontSize: 10,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    fontWeight: "700",
    color: "rgba(0,0,0,0.6)",
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: G.accentInk,
    letterSpacing: -1,
    lineHeight: 34,
    marginBottom: 4,
  },
  heroMeta: {
    fontSize: 11,
    color: "rgba(0,0,0,0.5)",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 16,
  },
  heroBtn: {
    backgroundColor: "rgba(0,0,0,0.15)",
    alignSelf: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: G.radius.full,
  },
  heroBtnText: { color: G.accentInk, fontWeight: "700", fontSize: 14 },

  row: { flexDirection: "row", gap: 12 },

  weeklyCard: { flex: 1 },
  cardLabel: {
    fontSize: 10,
    color: G.muted,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    fontWeight: "600",
    marginBottom: 12,
  },
  weeklyContent: { alignItems: "center", gap: 12 },
  weeklyDays: { flexDirection: "row", gap: 4 },
  dayDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: G.elevated,
    alignItems: "center",
    justifyContent: "center",
  },
  dayDotActive: { backgroundColor: G.accentSoft },
  dayDotText: { fontSize: 9, fontWeight: "600", color: G.muted },
  dayDotTextActive: { color: G.accent },

  lastCard: { flex: 1, justifyContent: "space-between" },
  lastSlotName: {
    fontSize: 18,
    fontWeight: "700",
    color: G.textHi,
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  lastDate: { fontSize: 12, color: G.secondary, marginBottom: 12 },
  lastStat: { flexDirection: "row", alignItems: "baseline", gap: 4 },
  lastStatVal: {
    fontSize: 26,
    fontWeight: "700",
    color: G.accent,
    letterSpacing: -0.5,
  },
  lastStatLabel: { fontSize: 11, color: G.secondary },

  goalLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: G.textHi,
    letterSpacing: -0.2,
    marginBottom: 12,
  },
  goalProgress: { flexDirection: "row", alignItems: "center", gap: 16 },
  goalMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  goalCurrent: { fontSize: 13, fontWeight: "700", color: G.accent },
  goalTarget: { fontSize: 13, color: G.secondary },
  goalDeadline: { alignItems: "center" },
  goalDeadlineText: { fontSize: 14, fontWeight: "700", color: G.text },
  goalDeadlineLabel: {
    fontSize: 10,
    color: G.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  previewHeader: { paddingHorizontal: 4, paddingTop: 4 },
  previewTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: G.secondary,
    letterSpacing: -0.1,
  },
  previewCard: { marginBottom: 0 },
  previewRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  previewThumb: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: G.elevated,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: G.hairline,
  },
  previewThumbText: { fontSize: 16, fontWeight: "700", color: G.accent },
  previewExName: {
    fontSize: 14,
    fontWeight: "700",
    color: G.text,
    letterSpacing: -0.2,
  },
  previewSpec: { fontSize: 14, fontWeight: "700", color: G.secondary },
});
