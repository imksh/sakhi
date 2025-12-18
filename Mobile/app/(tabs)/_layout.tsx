import { View, Text } from "react-native";
import { useEffect, useState } from "react";
import { Tabs, Redirect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useThemeStore from "../../store/themeStore.ts";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { save, getData } from "../../utils/storage";
import { useAuthStore } from "../../store/useAuthStore";
import Loading from "../../components/Loading";

const TabLayout = () => {
  const { colors } = useThemeStore();
  const insets = useSafeAreaInsets();
  const [flag, setFlag] = useState();
  const router = useRouter();
  const { checkAuth, authUser, getAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    getAuth();
  }, []);

  if (isCheckingAuth) {
    return <Loading />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 70 + insets.bottom,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
