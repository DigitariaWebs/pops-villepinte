import { Pressable, Text, View } from "react-native";

import OrderStatusPill from "@/components/order/OrderStatusPill";
import { colors } from "@/constants/theme";
import { formatPriceEUR } from "@/lib/format";
import type { Order } from "@/types";

function formatFrenchDate(isoString: string): string {
  const date = new Date(isoString);
  const raw = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export type PastOrderRowProps = {
  order: Order;
  onReorder: () => void;
};

export default function PastOrderRow({
  order,
  onReorder,
}: PastOrderRowProps): React.ReactElement {
  const itemCount = order.items.reduce((a, i) => a + i.quantity, 0);

  return (
    <View
      className="bg-surface-container-low rounded-xl"
      style={{
        marginHorizontal: 24,
        paddingHorizontal: 28,
        paddingVertical: 24,
      }}
    >
      <View className="flex-row items-start justify-between">
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text
            className="font-sans text-on-surface-variant"
            style={{ fontSize: 12 }}
          >
            {formatFrenchDate(order.createdAt)}
          </Text>
          <Text
            className="text-on-surface"
            style={{
              fontFamily: "BebasNeue_400Regular",
              fontSize: 18,
              letterSpacing: -0.5,
              marginTop: 4,
            }}
          >
            {order.id}
          </Text>
        </View>
        <OrderStatusPill status={order.status} />
      </View>

      <Text
        className="font-sans text-on-surface-variant"
        style={{ fontSize: 13, marginTop: 12 }}
      >
        {itemCount} article{itemCount > 1 ? "s" : ""} ·{" "}
        {formatPriceEUR(order.totalEUR)}
      </Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Recommander la commande ${order.id}`}
        onPress={onReorder}
        hitSlop={12}
        style={{ marginTop: 16, alignSelf: "flex-start" }}
      >
        <Text
          className="font-sans-bold text-primary uppercase"
          style={{ fontSize: 11, letterSpacing: 2 }}
        >
          Recommander
        </Text>
      </Pressable>
    </View>
  );
}
