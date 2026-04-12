import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { colors, shadow } from "@/constants/theme";
import { formatPriceEUR } from "@/lib/format";
import { useCountdown } from "@/hooks/useCountdown";
import type { Order } from "@/types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type ActiveOrderCardProps = {
  order: Order;
};

export default function ActiveOrderCard({
  order,
}: ActiveOrderCardProps): React.ReactElement {
  const router = useRouter();
  const pressScale = useSharedValue(1);
  const { minutes, isExpired } = useCountdown(
    order.createdAt,
    order.estimatedReadyAt,
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  const itemCount = order.items.reduce((a, i) => a + i.quantity, 0);
  const isReady = order.status === "ready" || isExpired;

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={`Voir la commande ${order.id}`}
      onPress={() =>
        router.push({ pathname: "/order/[id]", params: { id: order.id } })
      }
      onPressIn={() => {
        pressScale.value = withTiming(0.98, { duration: 120 });
      }}
      onPressOut={() => {
        pressScale.value = withTiming(1, { duration: 160 });
      }}
      className="bg-primary-container rounded-xl"
      style={[
        {
          marginHorizontal: 24,
          paddingHorizontal: 28,
          paddingVertical: 28,
        },
        shadow.hero,
        animatedStyle,
      ]}
    >
      <Text
        className="font-sans-bold uppercase"
        style={{
          fontSize: 10,
          letterSpacing: 2,
          color: "rgba(253,249,238,0.65)",
        }}
      >
        Commande en cours
      </Text>

      <Text
        style={{
          fontFamily: "BebasNeue_400Regular",
          fontSize: 24,
          letterSpacing: -0.5,
          color: colors.surface,
          marginTop: 6,
        }}
      >
        {order.id}
      </Text>

      <Text
        className="font-sans"
        style={{
          fontSize: 13,
          color: "rgba(253,249,238,0.7)",
          marginTop: 8,
        }}
      >
        {itemCount} article{itemCount > 1 ? "s" : ""} ·{" "}
        {formatPriceEUR(order.totalEUR)}
      </Text>

      <View
        className="flex-row items-center justify-between"
        style={{ marginTop: 20 }}
      >
        <Text
          className="font-sans-bold"
          style={{ fontSize: 15, color: colors.surface }}
        >
          {isReady ? "C'est prêt !" : `Prête dans ~${minutes} min`}
        </Text>
        <ChevronRight size={22} color={colors.surface} strokeWidth={2.5} />
      </View>
    </AnimatedPressable>
  );
}
