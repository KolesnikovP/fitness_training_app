import { Redirect, Tabs } from "expo-router";
import React from "react";
import { useAuth } from "@/shared/auth/context";

export default function AppLayout() {
  const { isLoggedIn, isLoading } = useAuth();

  if (!isLoading && !isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: "#007AFF",
      }}
    >
      <Tabs.Screen
        name="exercises"
        options={{ title: "Exercises", tabBarLabel: "Exercises" }}
      />
      <Tabs.Screen
        name="log"
        options={{ title: "Log Workout", tabBarLabel: "Log" }}
      />
      <Tabs.Screen
        name="history"
        options={{ title: "History", tabBarLabel: "History" }}
      />
    </Tabs>
  );
}
