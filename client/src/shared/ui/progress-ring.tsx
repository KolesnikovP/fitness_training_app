import React from "react";
import { Text, View } from "react-native";
import { G } from "@/shared/config/gridiron";

interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  label?: string;
  sublabel?: string;
}

export function ProgressRing({ value, max = 100, size = 72, label, sublabel }: ProgressRingProps) {
  const pct = Math.max(0, Math.min(1, value / max));
  const strokeW = size * 0.11;
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <View
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeW,
          borderColor: G.hairline,
        }}
      />
      {pct > 0 && (
        <View
          style={{
            position: "absolute",
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeW,
            borderColor: pct > 0.5 ? G.accent : "transparent",
            borderTopColor: G.accent,
            borderRightColor: pct > 0.25 ? G.accent : "transparent",
            borderBottomColor: pct > 0.5 ? G.accent : "transparent",
            borderLeftColor: pct > 0.75 ? G.accent : "transparent",
            transform: [{ rotate: `${pct * 360 - 90}deg` }],
          }}
        />
      )}
      <View style={{ alignItems: "center" }}>
        {label && (
          <Text style={{ fontSize: size * 0.25, fontWeight: "700", color: G.text }}>
            {label}
          </Text>
        )}
        {sublabel && (
          <Text
            style={{
              fontSize: 9,
              color: G.secondary,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              marginTop: 1,
            }}
          >
            {sublabel}
          </Text>
        )}
      </View>
    </View>
  );
}
