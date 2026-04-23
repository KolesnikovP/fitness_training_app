import React from "react";
import { StyleSheet, View } from "react-native";
import { G } from "@/shared/config/gridiron";

interface ProgressBarProps {
  value: number;
  max?: number;
  height?: number;
  color?: string;
}

export function ProgressBar({ value, max = 100, height = 6, color = G.accent }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <View style={[styles.track, { height }]}>
      <View
        style={[
          styles.fill,
          { width: `${pct}%` as `${number}%`, backgroundColor: color, height },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "100%",
    backgroundColor: G.hairline,
    borderRadius: 999,
    overflow: "hidden",
  },
  fill: {
    borderRadius: 999,
  },
});
