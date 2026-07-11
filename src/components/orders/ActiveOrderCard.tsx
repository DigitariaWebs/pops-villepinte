import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { ChevronRight, Clock } from "lucide-react-native";

import { ROUTES } from "@/constants/routes";
import { colors, font, radius, shadow } from "@/constants/theme";
import { formatPriceEUR } from "@/lib/format";
import { useCountdown } from "@/hooks/useCountdown";
import type { Order } from "@/types";

export type ActiveOrderCardProps = {
  order: Order;
};

export default function ActiveOrderCard({
  order,
}: ActiveOrderCardProps): React.ReactElement {
  const router = useRouter();
  const { minutes, progress, isExpired } = useCountdown(
    order.createdAt,
    order.estimatedReadyAt,
  );

  const itemCount = order.items.reduce((a, i) => a + i.quantity, 0);
  const isReady = order.status === "ready" || isExpired;
  const fillPct = isReady ? 100 : Math.round(progress * 100);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Voir la commande ${order.id}`}
      onPress={() => router.push(ROUTES.orderDetail(order.id))}
      style={{
        marginHorizontal: 20,
        backgroundColor: colors.primary,
        borderRadius: radius.lg,
        padding: 20,
        ...shadow.hero,
      }}
    >
      {/* Top row */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View
          style={{
            backgroundColor: colors.ink,
            borderRadius: radius.pill,
            paddingHorizontal: 10,
            paddingVertical: 4,
          }}
        >
          <Text
            style={{
              fontFamily: font.bodyBold,
              fontSize: 10,
              letterSpacing: 2,
              color: colors.primary,
              textTransform: "uppercase",
            }}
          >
            En cours
          </Text>
        </View>
        <ChevronRight size={22} color={colors.ink} strokeWidth={2.5} />
      </View>

      {/* Order ID */}
      <Text
        style={{
          fontFamily: font.display,
          fontSize: 28,
          color: colors.ink,
          letterSpacing: 0.5,
          marginTop: 12,
        }}
      >
        {order.id}
      </Text>

      {/* Info row */}
      <Text
        style={{
          fontFamily: font.body,
          fontSize: 13,
          color: "rgba(0,0,0,0.55)",
          marginTop: 4,
        }}
      >
        {itemCount} article{itemCount > 1 ? "s" : ""} · {formatPriceEUR(order.totalEUR)}
      </Text>

      {/* Progress */}
      <View style={{ marginTop: 16 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Clock size={16} color={colors.ink} strokeWidth={2} />
            <Text
              style={{
                fontFamily: font.bodyBold,
                fontSize: 14,
                color: colors.ink,
              }}
            >
              {isReady ? "C'est prêt ! 🎉" : `Prête dans ~${minutes} min`}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: font.bodyBold,
              fontSize: 13,
              color: "rgba(0,0,0,0.55)",
            }}
          >
            {fillPct}%
          </Text>
        </View>

        {/* Progress bar */}
        <View
          style={{
            height: 8,
            borderRadius: radius.pill,
            backgroundColor: "rgba(0,0,0,0.12)",
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: "100%",
              width: `${fillPct}%`,
              borderRadius: radius.pill,
              backgroundColor: isReady ? colors.success : colors.ink,
            }}
          />
        </View>
      </View>
    </Pressable>
  );
}
