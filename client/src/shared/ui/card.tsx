import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { G } from "@/shared/config/gridiron";

interface CardProps {
  children: React.ReactNode;
  pad?: number;
  onPress?: () => void;
  style?: object;
}

export function Card({ children, pad = 16, onPress, style }: CardProps) {
  const inner = (
    <View style={[styles.card, { padding: pad }, style]}>{children}</View>
  );
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.75}>
        {inner}
      </TouchableOpacity>
    );
  }
  return inner;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: G.surface,
    borderRadius: G.radius.lg,
    borderWidth: 1,
    borderColor: G.hairline,
  },
});
