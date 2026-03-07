import { Stack } from "expo-router";

export default function SessionLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="flashcard" />
      <Stack.Screen name="quiz" />
      <Stack.Screen name="summary" />
    </Stack>
  );
}
