import "../../global.css";

import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import AnimatedSplash from "@/components/splash/AnimatedSplash";
import { useAppFonts } from "@/constants/fonts";

SplashScreen.preventAutoHideAsync().catch(() => {
  /* noop — hideAsync below handles the lifecycle */
});

export default function RootLayout(): React.ReactNode {
  const fontsLoaded = useAppFonts();
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {
        /* noop */
      });
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {!splashDone ? (
        <AnimatedSplash onComplete={() => setSplashDone(true)} />
      ) : (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="product/[id]" options={{ presentation: "modal" }} />
          <Stack.Screen name="cart" options={{ presentation: "modal" }} />
          <Stack.Screen name="checkout" />
          <Stack.Screen name="order/[id]" />
        </Stack>
      )}
    </SafeAreaProvider>
  );
}
