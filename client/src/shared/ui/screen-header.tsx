import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { G } from "@/shared/config/gridiron";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
}

export function ScreenHeader({ title, subtitle, trailing }: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      {subtitle && <Text style={styles.sub}>{subtitle}</Text>}
      <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }}>
        <Text style={styles.title}>{title}</Text>
        {trailing}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 4,
    backgroundColor: G.bg,
  },
  sub: {
    fontSize: 11,
    color: G.secondary,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    fontWeight: "500",
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    color: G.textHi,
    letterSpacing: -1.2,
    lineHeight: 38,
  },
});
