import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { G } from "@/shared/config/gridiron";

interface NumStepperProps {
  label: string;
  value: number;
  onInc: () => void;
  onDec: () => void;
  unit?: string;
  decimals?: number;
}

export function NumStepper({ label, value, onInc, onDec, unit, decimals = 0 }: NumStepperProps) {
  return (
    <View style={styles.box}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <Text style={styles.value}>
          {decimals > 0 ? value.toFixed(decimals) : value}
          {unit && <Text style={styles.unit}> {unit}</Text>}
        </Text>
        <View style={styles.btns}>
          <Pressable onPress={onInc} style={styles.btn}>
            <Text style={{ color: G.secondary, fontSize: 10, lineHeight: 12 }}>▲</Text>
          </Pressable>
          <Pressable onPress={onDec} style={styles.btn}>
            <Text style={{ color: G.secondary, fontSize: 10, lineHeight: 12 }}>▼</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    backgroundColor: G.elevated,
    borderRadius: G.radius.md,
    borderWidth: 1,
    borderColor: G.hairline,
    padding: 10,
    paddingLeft: 12,
    gap: 4,
  },
  label: {
    fontSize: 9,
    color: G.muted,
    letterSpacing: 1,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  value: {
    fontSize: 20,
    fontWeight: "700",
    color: G.textHi,
    letterSpacing: -0.5,
  },
  unit: {
    fontSize: 10,
    color: G.muted,
    fontWeight: "500",
  },
  btns: { gap: 2 },
  btn: {
    width: 22,
    height: 16,
    backgroundColor: G.surface,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: G.hairline,
    alignItems: "center",
    justifyContent: "center",
  },
});
