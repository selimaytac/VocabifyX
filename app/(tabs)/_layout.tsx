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
        <Plus size={26} color="white" />
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
    backgroundColor: "#1B2D4F",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1B2D4F",
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
        tabBarActiveTintColor: "#1B2D4F",
        tabBarInactiveTintColor: "#B8BEC8",
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 16,
          left: 20,
          right: 20,
          backgroundColor: "#FFFFFF",
          borderRadius: 36,
          height: 68,
          paddingBottom: 0,
          borderTopWidth: 0,
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          elevation: 10,
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
