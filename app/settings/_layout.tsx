import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#FFFFFF",
        },
        headerTintColor: "#09122C",
        headerShadowVisible: false,
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 18,
          color: "#09122C",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Settings",
          headerLeft: Platform.OS === "ios" ? undefined : undefined,
        }}
      />
      <Stack.Screen
        name="manage-subscription"
        options={{
          title: "Manage Subscription",
          presentation: "modal",
          animation: Platform.OS === "ios" ? "slide_from_bottom" : "fade",
        }}
      />
      <Stack.Screen
        name="language"
        options={{
          title: "Language",
          presentation: "modal",
          animation: Platform.OS === "ios" ? "slide_from_bottom" : "fade",
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: "Notifications",
          presentation: "modal",
          animation: Platform.OS === "ios" ? "slide_from_bottom" : "fade",
        }}
      />
    </Stack>
  );
}
