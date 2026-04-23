import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { G } from "@/shared/config/gridiron";
import { Card, ProgressBar, ScreenHeader } from "@/shared/ui";
import { SESSION_HISTORY } from "@/entities/workout/model";
import { GOALS, BODY_WEIGHT_LOG } from "@/entities/goal/model";
import { findExercise } from "@/entities/exercise/model";

type Tab = "performance" | "body" | "goals";

export default function ProgressScreen() {
  const [tab, setTab] = useState<Tab>("performance");

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScreenHeader title="Progress" />

      {/* Segmented control */}
      <View style={styles.segmentRow}>
        {(["performance", "body", "goals"] as Tab[]).map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            style={[styles.segment, tab === t && styles.segmentActive]}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.segmentText,
                tab === t && styles.segmentTextActive,
              ]}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === "performance" && <PerformanceTab />}
      {tab === "body" && <BodyTab />}
      {tab === "goals" && <GoalsTab />}
    </SafeAreaView>
  );
}

// ── Performance tab ───────────────────────────────────────────────────────────

function PerformanceTab() {
  // Last 8 sessions volumes
  const recentSessions = SESSION_HISTORY.slice(-8);

  // PRs: for key exercises, find max weight in history
  const prExercises = ["bench-bb", "squat-bb", "deadlift", "ohp"];
  const prs = prExercises
    .map((exId) => {
      const ex = findExercise(exId);
      const best = SESSION_HISTORY.flatMap((s) => s.exercises)
        .filter((e) => e.ex === exId)
        .reduce((max, e) => Math.max(max, e.weight), 0);
      return { ex, best };
    })
    .filter((p) => p.ex && p.best > 0);

  // Volume trend
  const maxVol = Math.max(...recentSessions.map((s) => s.volume));

  // Bench strength trend (last 8 sessions that had bench)
  const benchHistory = SESSION_HISTORY.filter((s) =>
    s.exercises.some((e) => e.ex === "bench-bb"),
  )
    .slice(-6)
    .map((s) => ({
      date: s.date,
      weight: s.exercises.find((e) => e.ex === "bench-bb")?.weight ?? 0,
    }));

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* PRs */}
      <Text style={styles.sectionLabel}>PERSONAL RECORDS</Text>
      <View style={styles.prRow}>
        {prs.map(
          ({ ex, best }) =>
            ex && (
              <Card key={ex.id} pad={14} style={styles.prCard}>
                <Text style={styles.prVal}>
                  {best}
                  <Text style={styles.prUnit}> kg</Text>
                </Text>
                <Text style={styles.prName} numberOfLines={2}>
                  {ex.name}
                </Text>
              </Card>
            ),
        )}
      </View>

      {/* Volume chart */}
      <Text style={styles.sectionLabel}>WEEKLY VOLUME</Text>
      <Card pad={16}>
        <View style={styles.volChart}>
          {recentSessions.map((s, i) => {
            const pct = maxVol > 0 ? s.volume / maxVol : 0;
            const heightPx = Math.max(4, pct * 100);
            return (
              <View key={i} style={styles.volBarWrapper}>
                <View style={[styles.volBar, { height: heightPx }]} />
                <Text style={styles.volBarLabel}>
                  {s.slotName.slice(0, 3).toUpperCase()}
                </Text>
              </View>
            );
          })}
        </View>
        <View style={styles.volStatRow}>
          <View style={styles.volStat}>
            <Text style={styles.volStatVal}>{recentSessions.length}</Text>
            <Text style={styles.volStatLabel}>Sessions</Text>
          </View>
          <View style={styles.volStat}>
            <Text style={styles.volStatVal}>
              {(
                recentSessions.reduce((s, r) => s + r.volume, 0) / 1000
              ).toFixed(0)}
              t
            </Text>
            <Text style={styles.volStatLabel}>Total vol</Text>
          </View>
          <View style={styles.volStat}>
            <Text style={styles.volStatVal}>
              {maxVol > 0 ? Math.round(maxVol / 1000) : 0}k
            </Text>
            <Text style={styles.volStatLabel}>Best session</Text>
          </View>
        </View>
      </Card>

      {/* Strength trend */}
      <Text style={styles.sectionLabel}>BENCH PRESS TREND</Text>
      <Card pad={16}>
        <View style={styles.trendRow}>
          {benchHistory.map((b, i) => {
            const minW = Math.min(...benchHistory.map((x) => x.weight));
            const maxW = Math.max(...benchHistory.map((x) => x.weight));
            const rng = maxW - minW || 1;
            const pct = (b.weight - minW) / rng;
            return (
              <View key={i} style={styles.trendCol}>
                <View
                  style={[
                    styles.trendDot,
                    {
                      opacity: 0.4 + pct * 0.6,
                      transform: [{ scale: 0.7 + pct * 0.5 }],
                    },
                  ]}
                />
                <Text style={styles.trendVal}>{b.weight}</Text>
                <Text style={styles.trendLabel}>
                  {new Date(b.date).toLocaleDateString("en-US", {
                    month: "numeric",
                    day: "numeric",
                  })}
                </Text>
              </View>
            );
          })}
        </View>
        <View style={styles.trendFooter}>
          <Text style={styles.prevResult}>
            Current best: {Math.max(...benchHistory.map((b) => b.weight))} kg ×
            5
          </Text>
        </View>
      </Card>
    </ScrollView>
  );
}

// ── Body tab ─────────────────────────────────────────────────────────────────

function BodyTab() {
  const latest = BODY_WEIGHT_LOG[BODY_WEIGHT_LOG.length - 1];
  const first = BODY_WEIGHT_LOG[0];
  const delta = latest.weight - first.weight;
  const minW = Math.min(...BODY_WEIGHT_LOG.map((e) => e.weight));
  const maxW = Math.max(...BODY_WEIGHT_LOG.map((e) => e.weight));
  const rng = maxW - minW || 1;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Weight summary */}
      <Card pad={16}>
        <Text style={styles.sectionLabel}>BODY WEIGHT</Text>
        <View style={styles.weightRow}>
          <View>
            <Text style={styles.weightVal}>
              {latest.weight}
              <Text style={styles.weightUnit}> kg</Text>
            </Text>
            <Text style={styles.weightDate}>
              {new Date(latest.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </Text>
          </View>
          <View style={styles.deltaBadge}>
            <Text
              style={[
                styles.deltaText,
                { color: delta < 0 ? G.success : G.danger },
              ]}
            >
              {delta < 0 ? "▼" : "▲"} {Math.abs(delta).toFixed(1)} kg
            </Text>
            <Text style={styles.deltaLabel}>since start</Text>
          </View>
        </View>

        {/* Mini chart */}
        <View style={styles.weightChart}>
          {BODY_WEIGHT_LOG.map((e, i) => {
            const pct = (e.weight - minW) / rng;
            const barH = Math.max(4, pct * 60);
            return (
              <View key={i} style={styles.weightBarWrapper}>
                <View style={[styles.weightBar, { height: barH }]} />
              </View>
            );
          })}
        </View>
        <View style={styles.weightChartLabels}>
          <Text style={styles.weightChartLabel}>
            {new Date(first.date).toLocaleDateString("en-US", {
              month: "short",
            })}
          </Text>
          <Text style={styles.weightChartLabel}>
            {new Date(latest.date).toLocaleDateString("en-US", {
              month: "short",
            })}
          </Text>
        </View>
      </Card>

      {/* Measurements placeholder */}
      <Text style={styles.sectionLabel}>MEASUREMENTS</Text>
      {[
        { label: "Chest", value: "102 cm" },
        { label: "Waist", value: "84 cm" },
        { label: "Arms", value: "38 cm" },
      ].map((m) => (
        <Card key={m.label} pad={14} style={{ marginBottom: 0 }}>
          <View style={styles.measureRow}>
            <Text style={styles.measureLabel}>{m.label}</Text>
            <Text style={styles.measureVal}>{m.value}</Text>
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}

// ── Goals tab ─────────────────────────────────────────────────────────────────

function GoalsTab() {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.sectionLabel}>ACTIVE GOALS</Text>
      {GOALS.map((goal) => {
        const pct = Math.min(1, goal.current / goal.target);
        return (
          <Card key={goal.id} pad={16} style={{ marginBottom: 0 }}>
            <View style={styles.goalHeader}>
              <View style={styles.goalKindBadge}>
                <Text style={styles.goalKindText}>
                  {goal.kind === "bodyweight"
                    ? "⚖"
                    : goal.kind === "strength"
                      ? "🏋"
                      : "📅"}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.goalLabel}>{goal.label}</Text>
                {goal.deadline && (
                  <Text style={styles.goalDeadline}>
                    by{" "}
                    {new Date(goal.deadline).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Text>
                )}
              </View>
              <Text style={styles.goalPct}>{Math.round(pct * 100)}%</Text>
            </View>
            <ProgressBar value={goal.current} max={goal.target} height={6} />
            <View style={styles.goalMeta}>
              <Text style={styles.goalCurrent}>
                {goal.current} {goal.unit}
              </Text>
              <Text style={styles.goalTarget}>
                / {goal.target} {goal.unit}
              </Text>
            </View>
          </Card>
        );
      })}

      <TouchableOpacity style={styles.addGoalBtn}>
        <Text style={styles.addGoalText}>+ Add goal</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: G.bg },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 12, paddingBottom: 40 },

  segmentRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: G.elevated,
    borderRadius: G.radius.md,
    padding: 3,
    gap: 2,
  },
  segment: {
    flex: 1,
    height: 34,
    borderRadius: G.radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentActive: { backgroundColor: G.surface },
  segmentText: { fontSize: 12, fontWeight: "600", color: G.muted },
  segmentTextActive: { color: G.textHi },

  sectionLabel: {
    fontSize: 10,
    color: G.muted,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 4,
  },

  prRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  prCard: { minWidth: "45%", flex: 1 },
  prVal: {
    fontSize: 28,
    fontWeight: "700",
    color: G.accent,
    letterSpacing: -0.5,
  },
  prUnit: { fontSize: 14, color: G.secondary, fontWeight: "500" },
  prName: { fontSize: 12, color: G.secondary, marginTop: 4, lineHeight: 16 },

  volChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    height: 120,
    marginBottom: 16,
  },
  volBarWrapper: { flex: 1, alignItems: "center", gap: 6 },
  volBar: {
    width: "100%",
    backgroundColor: G.accent,
    borderRadius: 4,
    opacity: 0.85,
  },
  volBarLabel: {
    fontSize: 9,
    color: G.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  volStatRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: G.hairline,
    paddingTop: 12,
    gap: 0,
  },
  volStat: { flex: 1, alignItems: "center", gap: 2 },
  volStatVal: { fontSize: 20, fontWeight: "700", color: G.textHi },
  volStatLabel: { fontSize: 11, color: G.secondary },

  trendRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  trendCol: { alignItems: "center", gap: 6 },
  trendDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: G.accent,
  },
  trendVal: { fontSize: 12, fontWeight: "700", color: G.text },
  trendLabel: { fontSize: 9, color: G.secondary },
  trendFooter: {
    borderTopWidth: 1,
    borderTopColor: G.hairline,
    paddingTop: 10,
    marginTop: 4,
  },
  prevResult: { fontSize: 12, color: G.prevResult },

  weightRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  weightVal: {
    fontSize: 36,
    fontWeight: "700",
    color: G.textHi,
    letterSpacing: -1,
  },
  weightUnit: { fontSize: 18, color: G.secondary, fontWeight: "500" },
  weightDate: { fontSize: 12, color: G.secondary, marginTop: 2 },
  deltaBadge: { alignItems: "flex-end" },
  deltaText: { fontSize: 18, fontWeight: "700" },
  deltaLabel: { fontSize: 11, color: G.secondary },
  weightChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
    height: 70,
    marginBottom: 4,
  },
  weightBarWrapper: { flex: 1, alignItems: "center" },
  weightBar: {
    width: "80%",
    backgroundColor: G.accentSoft,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: G.accent + "40",
  },
  weightChartLabels: { flexDirection: "row", justifyContent: "space-between" },
  weightChartLabel: { fontSize: 10, color: G.muted },

  measureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  measureLabel: { fontSize: 14, color: G.secondary },
  measureVal: { fontSize: 16, fontWeight: "700", color: G.textHi },

  goalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  goalKindBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: G.elevated,
    alignItems: "center",
    justifyContent: "center",
  },
  goalKindText: { fontSize: 18 },
  goalLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: G.textHi,
    letterSpacing: -0.2,
  },
  goalDeadline: { fontSize: 11, color: G.secondary, marginTop: 2 },
  goalPct: { fontSize: 20, fontWeight: "700", color: G.accent },
  goalMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  goalCurrent: { fontSize: 12, fontWeight: "700", color: G.accent },
  goalTarget: { fontSize: 12, color: G.secondary },

  addGoalBtn: {
    height: 48,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: G.hairline,
    borderRadius: G.radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  addGoalText: { color: G.secondary, fontSize: 14, fontWeight: "600" },
});
