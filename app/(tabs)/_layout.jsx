import { View, Text } from "react-native";
import React, { useState } from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Slot, useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
export default function Tablayout() {
  const { user, token, checkAuth } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (user && token) {
      router.replace("/(tabs)");
    } else {
      router.replace("/(auth)");
    }
  }, [isMounted, user, token]);

  return (
    <Tabs
      screenListeners={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
