import { Stack } from "expo-router";
import { Slot, useRouter } from "expo-router";
import React, { useState } from "react";
import { useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
export default function AuthLayout() {
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
    }
  }, [isMounted, user, token]);
  return <Stack screenOptions={{ headerShown: false }} />;
}
