import "../../global.css";

import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import AnimatedSplash from "@/components/splash/AnimatedSplash";
import { useAppFonts } from "@/constants/fonts";
import { useAuthStore } from "@/store/auth.store";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout(): React.ReactNode {
  const fontsLoaded = useAppFonts();
  const hasSeenOnboarding = useAuthStore((s) => s.hasSeenOnboarding);
  const markOnboardingSeen = useAuthStore((s) => s.markOnboardingSeen);
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  if (!splashDone) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <AnimatedSplash onComplete={() => setSplashDone(true)} />
      </GestureHandlerRootView>
    );
  }

  if (!hasSeenOnboarding) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <OnboardingFlow onComplete={markOnboardingSeen} />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="product/[id]" options={{ presentation: "modal" }} />
          <Stack.Screen name="cart" options={{ presentation: "modal" }} />
          <Stack.Screen name="checkout" />
          <Stack.Screen name="order/[id]" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
