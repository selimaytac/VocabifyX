import { BarChart2, Compass, Home, Plus, User } from "@tamagui/lucide-icons";
import { Redirect, Tabs, useRouter } from "expo-router";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";

import { config } from "@/config";
import { useSubscription } from "@/hooks/useSubscription";

function CenterFAB({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={fabStyles.container}
      activeOpacity={0.82}
    >
      <View style={fabStyles.button}>
        <Plus size={28} color="white" />
      </View>
    </TouchableOpacity>
  );
}

const fabStyles = StyleSheet.create({
  container: {
    top: -18,
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#213448",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#213448",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default function TabLayout() {
  const { isSubscribed, loading } = useSubscription();
  const router = useRouter();

  // Hard paywall gate: if the subscription has lapsed and we're not in
  // dev/web mode, redirect to the lapsed-subscriber modal paywall.
  if (!config.isDev && Platform.OS !== "web" && !loading && !isSubscribed) {
    return <Redirect href="/(modals)/paywall" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#213448",
        tabBarInactiveTintColor: "#B0B0B0",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E0E0E0",
          height: 72,
          paddingBottom: 12,
          paddingTop: 8,
        },
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
        name="create"
        options={{
          title: "",
          tabBarButton: () => (
            <CenterFAB onPress={() => router.push("/list/create")} />
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
