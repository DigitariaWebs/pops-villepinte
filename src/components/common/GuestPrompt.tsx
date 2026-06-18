import { Pressable, Text, View } from "react-native";
import { LogIn } from "lucide-react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { colors } from "@/constants/theme";
import { useAuthStore } from "@/store/auth.store";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type GuestPromptProps = {
  title: string;
  message: string;
};

/**
 * Full-screen empty state shown to guest users on account-only tabs (Orders,
 * Profile). Tapping the CTA exits guest mode and routes to the OTP sign-in
 * flow via the root layout.
 */
export default function GuestPrompt({
  title,
  message,
}: GuestPromptProps): React.ReactElement {
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
      className="flex-1 items-center justify-center"
      style={{ paddingHorizontal: 40 }}
    >
      <View
        className="bg-surface-container items-center justify-center rounded-full"
        style={{ width: 120, height: 120 }}
      >
        <LogIn size={52} color={colors.inkMuted} strokeWidth={1.5} />
      </View>

      <Text
        className="text-on-surface"
        style={{
          fontFamily: "BebasNeue_400Regular",
          fontSize: 28,
          lineHeight: 32,
          letterSpacing: -1,
          marginTop: 28,
          textAlign: "center",
        }}
      >
        {title}
      </Text>

      <Text
        className="font-sans text-on-surface-variant"
        style={{
          fontSize: 14,
          lineHeight: 22,
          marginTop: 10,
          maxWidth: 280,
          textAlign: "center",
        }}
      >
        {message}
      </Text>

      <AnimatedPressable
        accessibilityRole="button"
        accessibilityLabel="Se connecter ou créer un compte"
        onPress={handleLogin}
        onPressIn={() => {
          pressScale.value = withTiming(0.97, { duration: 120 });
        }}
        onPressOut={() => {
          pressScale.value = withTiming(1, { duration: 160 });
        }}
        className="bg-primary rounded-full"
        style={[
          { paddingHorizontal: 32, paddingVertical: 16, marginTop: 32 },
          animatedStyle,
        ]}
      >
        <Text
          className="uppercase"
          style={{
            fontFamily: "Poppins_700Bold",
            fontSize: 12,
            letterSpacing: 2,
            color: colors.surface,
          }}
        >
          Se connecter
        </Text>
      </AnimatedPressable>
    </View>
  );
}
