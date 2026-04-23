import { Redirect, Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";
import React from "react";
import { useAuth } from "@/shared/auth/context";
import { G } from "@/shared/config/gridiron";

type TabIconProps = {
  focused: boolean;
  ios: string;
  android: string;
  size?: number;
};

function TabIcon({ focused, ios, android, size = 24 }: TabIconProps) {
  return (
    <SymbolView
      name={{ ios: ios as any, android: android as any }}
      size={size}
      tintColor={focused ? G.accent : G.muted}
      weight="medium"
    />
  );
}

export default function AppLayout() {
  const { isLoggedIn, isLoading } = useAuth();

  if (!isLoading && !isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: G.surface,
          borderTopColor: G.hairline,
          borderTopWidth: 0.5,
          height: 84,
          paddingBottom: 28,
          paddingTop: 8,
        },
        tabBarActiveTintColor: G.accent,
        tabBarInactiveTintColor: G.muted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "700",
          letterSpacing: 0.3,
          textTransform: "uppercase",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} ios="house.fill" android="home" />
          ),
        }}
      />
      <Tabs.Screen
        name="program"
        options={{
          tabBarLabel: "Program",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              ios="dumbbell.fill"
              android="fitness_center"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          tabBarLabel: "Progress",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              ios="chart.bar.fill"
              android="bar_chart"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          tabBarLabel: "Library",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              ios="books.vertical.fill"
              android="menu_book"
            />
          ),
        }}
      />
    </Tabs>
  );
}
