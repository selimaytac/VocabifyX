import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Settings" }} />
      <Stack.Screen
        name="manage-subscription"
        options={{ title: "Manage Subscription" }}
      />
      <Stack.Screen name="language" options={{ title: "Language" }} />
    </Stack>
  );
}
