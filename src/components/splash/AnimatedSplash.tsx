import { useCallback, useEffect, useRef } from "react";
import { Pressable, Text, View, type DimensionValue } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Carrot,
  ChefHat,
  Cherry,
  Coffee,
  Cookie,
  Drumstick,
  IceCream,
  type LucideIcon,
  Pizza,
  Salad,
  Sandwich,
  UtensilsCrossed,
  Wine,
} from "lucide-react-native";

import { colors } from "@/constants/theme";

type FoodIconSpec = {
  Icon: LucideIcon;
  top: DimensionValue;
  left: DimensionValue;
  size: number;
  rotate: number;
  delay: number;
};

const FOOD_ICONS: readonly FoodIconSpec[] = [
  { Icon: Pizza, top: "8%", left: "10%", size: 56, rotate: -15, delay: 0 },
  { Icon: Sandwich, top: "6%", left: "70%", size: 64, rotate: 12, delay: 80 },
  { Icon: Drumstick, top: "18%", left: "82%", size: 48, rotate: 25, delay: 160 },
  { Icon: Cherry, top: "22%", left: "16%", size: 40, rotate: 0, delay: 240 },
  { Icon: ChefHat, top: "14%", left: "45%", size: 52, rotate: 0, delay: 320 },
  { Icon: IceCream, top: "38%", left: "6%", size: 52, rotate: -20, delay: 400 },
  { Icon: Coffee, top: "36%", left: "80%", size: 44, rotate: 8, delay: 480 },
  { Icon: Cookie, top: "62%", left: "18%", size: 48, rotate: 15, delay: 560 },
  { Icon: Salad, top: "64%", left: "72%", size: 56, rotate: -10, delay: 640 },
  { Icon: Carrot, top: "55%", left: "88%", size: 40, rotate: 30, delay: 720 },
  { Icon: Wine, top: "78%", left: "10%", size: 44, rotate: -5, delay: 800 },
  { Icon: UtensilsCrossed, top: "82%", left: "48%", size: 48, rotate: 0, delay: 880 },
];

const ICON_FADE_DURATION_MS = 500;
const ICON_TARGET_OPACITY = 0.18;
const WORDMARK_START_MS = 900;
const WORDMARK_FADE_MS = 400;
// Last icon lands at 880 + 500 = 1380ms, wordmark settles by 1300ms.
// Hold ~920ms after the final landing, then fire onComplete.
const TOTAL_DURATION_MS = 2300;
const REDUCED_MOTION_DURATION_MS = 1500;
const SKIP_FADE_MS = 150;

type FoodIconItemProps = {
  spec: FoodIconSpec;
  reducedMotion: boolean;
};

function FoodIconItem({ spec, reducedMotion }: FoodIconItemProps): React.ReactElement {
  const opacity = useSharedValue(reducedMotion ? ICON_TARGET_OPACITY : 0);
  const scale = useSharedValue(reducedMotion ? 1 : 0.8);
  const translateY = useSharedValue(reducedMotion ? 0 : 8);

  useEffect(() => {
    if (reducedMotion) return;
    opacity.value = withDelay(
      spec.delay,
      withTiming(ICON_TARGET_OPACITY, { duration: ICON_FADE_DURATION_MS }),
    );
    scale.value = withDelay(
      spec.delay,
      withTiming(1, { duration: ICON_FADE_DURATION_MS }),
    );
    translateY.value = withDelay(
      spec.delay,
      withTiming(0, { duration: ICON_FADE_DURATION_MS }),
    );
    // Intentionally run once on mount. Shared values do not belong in deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${spec.rotate}deg` },
    ],
  }));

  const { Icon } = spec;

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: spec.top,
          left: spec.left,
        },
        animatedStyle,
      ]}
    >
      <Icon size={spec.size} color={colors.onSurface} strokeWidth={1.5} />
    </Animated.View>
  );
}

export type AnimatedSplashProps = {
  onComplete: () => void;
};

export default function AnimatedSplash({
  onComplete,
}: AnimatedSplashProps): React.ReactElement {
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();

  const containerOpacity = useSharedValue(1);
  const wordmarkOpacity = useSharedValue(reducedMotion ? 1 : 0);
  const wordmarkScale = useSharedValue(reducedMotion ? 1 : 0.85);

  const completingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const finish = useCallback(() => {
    if (completingRef.current) return;
    completingRef.current = true;
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    if (!reducedMotion) {
      wordmarkOpacity.value = withDelay(
        WORDMARK_START_MS,
        withTiming(1, { duration: WORDMARK_FADE_MS }),
      );
      wordmarkScale.value = withDelay(
        WORDMARK_START_MS,
        withSpring(1, { damping: 12, stiffness: 140 }),
      );
    }

    const totalMs = reducedMotion ? REDUCED_MOTION_DURATION_MS : TOTAL_DURATION_MS;
    timeoutRef.current = setTimeout(finish, totalMs);

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
    // Intentionally run once on mount.
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
        if (isFinished) {
          runOnJS(finish)();
        }
      },
    );
  }, [containerOpacity, finish]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const wordmarkStyle = useAnimatedStyle(() => ({
    opacity: wordmarkOpacity.value,
    transform: [{ scale: wordmarkScale.value }],
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Passer l'introduction"
      onPress={handleSkip}
      className="flex-1 bg-surface"
    >
      <Animated.View style={[{ flex: 1 }, containerStyle]}>
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          {FOOD_ICONS.map((spec, index) => (
            <FoodIconItem
              key={`${spec.Icon.displayName ?? "icon"}-${index}`}
              spec={spec}
              reducedMotion={reducedMotion}
            />
          ))}
        </View>

        <Animated.View
          style={[
            {
              position: "absolute",
              top: insets.top,
              bottom: insets.bottom,
              left: 0,
              right: 0,
              alignItems: "center",
              justifyContent: "center",
            },
            wordmarkStyle,
          ]}
        >
          <Text
            className="text-primary"
            style={{
              fontFamily: "PlusJakartaSans_800ExtraBold_Italic",
              fontSize: 88,
              lineHeight: 88,
              letterSpacing: -2,
            }}
          >
            Pop&apos;s
          </Text>
          <Text
            className="mt-3 text-on-surface-variant uppercase"
            style={{
              fontFamily: "PlusJakartaSans_600SemiBold",
              fontSize: 11,
              letterSpacing: 3,
            }}
          >
            Villepinte · Depuis 2024
          </Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}
