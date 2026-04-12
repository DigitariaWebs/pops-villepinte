import "../../global.css";

import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import AuthFlow from "@/components/auth/AuthFlow";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import AnimatedSplash from "@/components/splash/AnimatedSplash";
import { useAppFonts } from "@/constants/fonts";
import { useAuthStore } from "@/store/auth.store";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout(): React.ReactNode {
  const fontsLoaded = useAppFonts();

  const hasSeenOnboarding = useAuthStore((s) => s.hasSeenOnboarding);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const markOnboardingSeen = useAuthStore((s) => s.markOnboardingSeen);
  const login = useAuthStore((s) => s.login);

  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  // Step 1: Animated splash
  if (!splashDone) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <AnimatedSplash onComplete={() => setSplashDone(true)} />
      </GestureHandlerRootView>
    );
  }

  // Step 2: Onboarding (first time only)
  if (!hasSeenOnboarding) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" />
        <OnboardingFlow onComplete={markOnboardingSeen} />
      </GestureHandlerRootView>
    );
  }

  // Step 3: Phone OTP auth
  if (!isAuthenticated) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <AuthFlow onComplete={(phone) => login(phone)} />
      </GestureHandlerRootView>
    );
  }

  // Step 4: Main app
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
