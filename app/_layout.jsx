import { useRouter, useSegments, Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";

export default function RootLayout() {
  // const { checkAuth, user, token } = useAuthStore();
  // const segments = useSegments();
  // const router = useRouter();
  // const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  // console.log("user in root layout:", user, "segments:", segments);

  // useEffect(() => {
  //   const init = async () => {
  //     await checkAuth();
  //     setHasCheckedAuth(true);
  //   };
  //   init();
  // }, []);

  // useEffect(() => {
  //   if (!hasCheckedAuth || segments.length === 0) return;

  //   const isAuthScreen = segments[0] === "(auth)";
  //   const isSignedIn = user && token;

  //   if (!isSignedIn && !isAuthScreen) {
  //     router.replace("/(auth)");
  //   } else if (isSignedIn && isAuthScreen) {
  //     router.replace("/(tabs)");
  //   }
  // }, [user, token, segments, hasCheckedAuth]);

  return (
    <SafeAreaProvider>
      <SafeScreen>
        {/* ✅ Just render Slot — expo-router handles Stack/Tab automatically */}
        <Slot />
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
