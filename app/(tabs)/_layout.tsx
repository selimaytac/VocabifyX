import { BarChart2, Compass, Home, User } from "@tamagui/lucide-icons";
import { Redirect, Tabs } from "expo-router";
import { Platform } from "react-native";

import { config } from "@/config";
import { useSubscription } from "@/hooks/useSubscription";

export default function TabLayout() {
  const { isSubscribed, loading } = useSubscription();

  // Hard paywall gate: if the subscription has lapsed and we're not in
  // dev/web mode, redirect to the lapsed-subscriber modal paywall.
  if (!config.isDev && Platform.OS !== "web" && !loading && !isSubscribed) {
    return <Redirect href="/(modals)/paywall" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#1B2D4F",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E5E7EB",
          height: 60,
          paddingBottom: 8,
        },
        headerStyle: {
          backgroundColor: "#FFFFFF",
        },
        headerTintColor: "#0D0D0D",
        headerShadowVisible: false,
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 18,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size }) => (
            <Compass color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
          tabBarIcon: ({ color, size }) => (
            <BarChart2 color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
