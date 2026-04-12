import { useCallback, useEffect, useRef } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { colors } from "@/constants/theme";

const TOTAL_DURATION_MS = 2200;
const REDUCED_MOTION_DURATION_MS = 1200;
const SKIP_FADE_MS = 150;

export type AnimatedSplashProps = {
  onComplete: () => void;
};

export default function AnimatedSplash({
  onComplete,
}: AnimatedSplashProps): React.ReactElement {
  const reducedMotion = useReducedMotion();
  const containerOpacity = useSharedValue(1);

  const logoScale = useSharedValue(reducedMotion ? 1 : 0.6);
  const logoOpacity = useSharedValue(reducedMotion ? 1 : 0);
  const taglineOpacity = useSharedValue(reducedMotion ? 1 : 0);
  const taglineTranslateY = useSharedValue(reducedMotion ? 0 : 12);

  const completingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const finish = useCallback(() => {
    if (completingRef.current) return;
    completingRef.current = true;
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    if (!reducedMotion) {
      logoOpacity.value = withTiming(1, { duration: 400 });
      logoScale.value = withSpring(1, { damping: 10, stiffness: 160 });

      taglineOpacity.value = withDelay(500, withTiming(1, { duration: 350 }));
      taglineTranslateY.value = withDelay(500, withTiming(0, { duration: 350 }));
    }

    const totalMs = reducedMotion ? REDUCED_MOTION_DURATION_MS : TOTAL_DURATION_MS;
    timeoutRef.current = setTimeout(finish, totalMs);

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSkip = useCallback(() => {
    if (completingRef.current) return;
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    containerOpacity.value = withTiming(
      0,
      { duration: SKIP_FADE_MS },
      (isFinished) => {
        if (isFinished) runOnJS(finish)();
      },
    );
  }, [containerOpacity, finish]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));
  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));
  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineTranslateY.value }],
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Passer l'introduction"
      onPress={handleSkip}
      style={{ flex: 1, backgroundColor: colors.primary }}
    >
      <Animated.View
        style={[
          {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          },
          containerStyle,
        ]}
      >
        {/* Bold red stripe behind the logo */}
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 120,
            backgroundColor: colors.accent,
            transform: [{ rotate: "-3deg" }],
          }}
        />

        <Animated.View style={[{ alignItems: "center" }, logoStyle]}>
          <Text
            style={{
              fontFamily: "BebasNeue_400Regular",
              fontSize: 96,
              lineHeight: 96,
              letterSpacing: 4,
              color: colors.ink,
            }}
          >
            POP&apos;S
          </Text>
          <View
            style={{
              backgroundColor: colors.ink,
              paddingHorizontal: 16,
              paddingVertical: 4,
              marginTop: -4,
            }}
          >
            <Text
              style={{
                fontFamily: "BebasNeue_400Regular",
                fontSize: 18,
                letterSpacing: 6,
                color: colors.primary,
              }}
            >
              VILLEPINTE
            </Text>
          </View>
        </Animated.View>

        <Animated.View style={[{ marginTop: 40, alignItems: "center" }, taglineStyle]}>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 14,
              letterSpacing: 1,
              color: colors.ink,
              textTransform: "uppercase",
            }}
          >
            Commandez avant d&apos;arriver
          </Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}
