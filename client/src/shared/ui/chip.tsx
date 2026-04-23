import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { G } from "@/shared/config/gridiron";

interface ChipProps {
  children: string;
  tone?: "default" | "accent" | "ghost";
}

export function Chip({ children, tone = "default" }: ChipProps) {
  const bg =
    tone === "accent" ? G.accentSoft : tone === "ghost" ? "transparent" : G.elevated;
  const fg = tone === "accent" ? G.accent : G.secondary;
  const bd = tone === "ghost" ? G.hairline : "transparent";
  return (
    <View style={[styles.chip, { backgroundColor: bg, borderColor: bd }]}>
      <Text style={[styles.chipText, { color: fg }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  chipText: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
});
