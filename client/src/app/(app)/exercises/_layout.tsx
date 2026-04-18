import { Stack } from "expo-router";

export default function ExercisesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Exercise Library" }} />
      <Stack.Screen name="[id]" options={{ title: "Exercise Detail" }} />
    </Stack>
  );
}
