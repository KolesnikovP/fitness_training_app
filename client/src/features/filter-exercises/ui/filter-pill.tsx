import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { G } from "@/shared/config/gridiron";

interface FilterPillProps {
  label: string;
  active: boolean;
  onPress: () => void;
  size?: "sm" | "md";
}

export function FilterPill({ label, active, onPress, size = "md" }: FilterPillProps) {
  const h = size === "sm" ? 26 : 30;
  const fs = size === "sm" ? 11 : 12;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.pill,
        {
          height: h,
          backgroundColor: active ? G.text : "transparent",
          borderColor: active ? G.text : G.hairline,
        },
      ]}
      activeOpacity={0.75}
    >
      <Text style={[styles.pillText, { fontSize: fs, color: active ? G.bg : G.secondary }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pillText: { fontWeight: "600" },
});
