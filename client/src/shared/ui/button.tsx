import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { G } from "@/shared/config/gridiron";

interface ButtonProps {
  children: string;
  onPress?: () => void;
  tone?: "accent" | "ghost" | "surface";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
}

export function Button({
  children,
  onPress,
  tone = "accent",
  size = "md",
  fullWidth,
  disabled,
}: ButtonProps) {
  const heights = { sm: 32, md: 44, lg: 52 };
  const fontSizes = { sm: 13, md: 15, lg: 16 };
  const pads = { sm: 12, md: 16, lg: 20 };
  const bgs = { accent: G.accent, ghost: "transparent", surface: G.elevated };
  const fgs = { accent: G.accentInk, ghost: G.text, surface: G.text };
  const bds = { accent: "transparent", ghost: G.hairline, surface: "transparent" };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
      style={[
        styles.button,
        {
          height: heights[size],
          paddingHorizontal: pads[size],
          backgroundColor: bgs[tone],
          borderColor: bds[tone],
          width: fullWidth ? "100%" : undefined,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      <Text style={{ fontSize: fontSizes[size], fontWeight: "600", color: fgs[tone] }}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: G.radius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
});
