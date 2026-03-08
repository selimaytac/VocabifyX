import { BarChart2, Compass, Home, User } from "@tamagui/lucide-icons";
import { Redirect, Tabs } from "expo-router";
import { Platform } from "react-native";
import { useTheme } from "tamagui";

import { config } from "@/config";
import { useSubscription } from "@/hooks/useSubscription";

export default function TabLayout() {
  const theme = useTheme();
  const { isSubscribed, loading } = useSubscription();

  // Hard paywall gate: if the subscription has lapsed and we're not in
  // dev/web mode, redirect to the lapsed-subscriber modal paywall.
  if (!config.isDev && Platform.OS !== "web" && !loading && !isSubscribed) {
    return <Redirect href="/(modals)/paywall" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#F5A623",
        tabBarInactiveTintColor: theme.gray9.val,
        tabBarStyle: {
          backgroundColor: "#111111",
          borderTopColor: "#2a2a2a",
        },
        headerStyle: {
          backgroundColor: "#111111",
        },
        headerTintColor: "#ffffff",
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
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
