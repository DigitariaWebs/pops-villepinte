import { Pressable, Text, View } from "react-native";
import { Sparkles } from "lucide-react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { colors } from "@/constants/theme";
import { useAuthStore } from "@/store/auth.store";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type GuestSignInBannerProps = {
  /** Short reminder text. */
  label?: string;
};

/**
 * Slim, full-width guest-mode reminder strip. Rendered automatically at the top
 * of every {@link Screen} while the user is browsing in guest mode, so the
 * reminder follows them across the app without taking much vertical space.
 * Tapping "Se connecter" exits guest mode and routes to the OTP flow via the
 * root layout — the same mechanism as {@link GuestPrompt} / {@link useRequireAccount}.
 */
export default function GuestSignInBanner({
  label = "Mode invité",
}: GuestSignInBannerProps): React.ReactElement {
  const exitGuest = useAuthStore((s) => s.exitGuest);
  const setAuthChoice = useAuthStore((s) => s.setAuthChoice);
  const pressScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  const handleLogin = (): void => {
    setAuthChoice("signin");
    exitGuest();
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: colors.ink,
        paddingHorizontal: 16,
        paddingVertical: 8,
      }}
    >
      <Sparkles size={14} color={colors.primary} strokeWidth={2.5} />
      <Text
        numberOfLines={1}
        style={{
          flex: 1,
          fontFamily: "Poppins_600SemiBold",
          fontSize: 12,
          color: colors.white,
          letterSpacing: 0.2,
        }}
      >
        {label} · crée ton compte pour en profiter
      </Text>

      <AnimatedPressable
        accessibilityRole="button"
        accessibilityLabel="Se connecter ou créer un compte"
        onPress={handleLogin}
        onPressIn={() => {
          pressScale.value = withTiming(0.96, { duration: 120 });
        }}
        onPressOut={() => {
          pressScale.value = withTiming(1, { duration: 160 });
        }}
        style={[
          {
            backgroundColor: colors.primary,
            borderRadius: 999,
            paddingHorizontal: 12,
            paddingVertical: 6,
          },
          animatedStyle,
        ]}
      >
        <Text
          style={{
            fontFamily: "Poppins_700Bold",
            fontSize: 10,
            letterSpacing: 0.8,
            color: colors.ink,
            textTransform: "uppercase",
          }}
        >
          Se connecter
        </Text>
      </AnimatedPressable>
    </View>
  );
}
