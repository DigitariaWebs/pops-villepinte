import "../../global.css";

import { useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { useAppFonts } from "@/constants/fonts";

SplashScreen.preventAutoHideAsync();

export default function RootLayout(): React.ReactNode {
  const fontsLoaded = useAppFonts();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
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
  );
}
