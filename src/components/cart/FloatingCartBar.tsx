import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { ChevronRight, ShoppingBag } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  FadeOut,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";

import { colors } from "@/constants/theme";
import { formatPriceEUR } from "@/lib/format";
import { useCartStore } from "@/store/cart.store";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const TAB_BAR_OFFSET = 90;

export default function FloatingCartBar(): React.ReactElement | null {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.totalEUR());
  const reducedMotion = useReducedMotion();

  const opacity = useSharedValue(reducedMotion ? 1 : 0);
  const translateY = useSharedValue(reducedMotion ? 0 : 20);
  const scale = useSharedValue(reducedMotion ? 1 : 0.95);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    if (reducedMotion) return;
    opacity.value = withTiming(1, { duration: 240 });
    translateY.value = withSpring(0, { damping: 14, stiffness: 180, mass: 0.9 });
    scale.value = withSpring(1, { damping: 14, stiffness: 180, mass: 0.9 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value * pressScale.value },
    ],
  }));

  if (items.length === 0) return null;

  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const itemLabel = `${itemCount} article${itemCount > 1 ? "s" : ""}`;

  return (
    <Animated.View
      exiting={FadeOut.duration(200)}
      style={{
        position: "absolute",
        left: 24,
        right: 24,
        bottom: insets.bottom + TAB_BAR_OFFSET,
      }}
    >
      <AnimatedPressable
        accessibilityRole="button"
        accessibilityLabel={`Voir le panier — ${itemLabel}, ${formatPriceEUR(total)}`}
        onPress={() => router.push("/cart")}
        onPressIn={() => {
          pressScale.value = withTiming(0.97, { duration: 120 });
        }}
        onPressOut={() => {
          pressScale.value = withTiming(1, { duration: 160 });
        }}
        className="bg-on-surface flex-row items-center justify-between rounded-full"
        style={[
          {
            paddingHorizontal: 24,
            paddingVertical: 16,
            shadowColor: colors.ink,
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.18,
            shadowRadius: 24,
            elevation: 10,
          },
          animatedStyle,
        ]}
      >
        <View className="flex-row items-center" style={{ gap: 12 }}>
          <ShoppingBag size={18} color={colors.surface} strokeWidth={2.25} />
          <Text
            className="font-sans-semibold"
            style={{ fontSize: 14, color: colors.surface }}
          >
            {itemLabel}
          </Text>
        </View>

        <View className="flex-row items-center" style={{ gap: 8 }}>
          <Text
            className="text-primary"
            style={{
              fontFamily: "BebasNeue_400Regular",
              fontSize: 18,
            }}
          >
            {formatPriceEUR(total)}
          </Text>
          <ChevronRight size={18} color={colors.surface} strokeWidth={2.5} />
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}
