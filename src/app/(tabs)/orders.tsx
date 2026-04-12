import { useCallback } from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import Screen from "@/components/layout/Screen";
import ActiveOrderCard from "@/components/orders/ActiveOrderCard";
import OrdersEmpty from "@/components/orders/OrdersEmpty";
import PastOrderRow from "@/components/orders/PastOrderRow";
import { colors } from "@/constants/theme";
import { useCartStore } from "@/store/cart.store";
import { useOrdersStore } from "@/store/orders.store";
import type { Order } from "@/types";

export default function OrdersScreen(): React.ReactElement {
  const router = useRouter();
  const active = useOrdersStore((s) => s.active);
  const history = useOrdersStore((s) => s.history);
  const addItem = useCartStore((s) => s.addItem);

  const hasContent = active !== null || history.length > 0;

  const handleReorder = useCallback(
    (order: Order) => {
      void Haptics.selectionAsync();
      for (const item of order.items) {
        addItem({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          supplements: item.supplements,
          notes: item.notes,
        });
      }
      router.push("/cart");
    },
    [addItem, router],
  );

  if (!hasContent) {
    return (
      <Screen scroll={false}>
        <View style={{ paddingHorizontal: 24, paddingTop: 16 }}>
          <Text
            className="font-sans-semibold text-on-surface-variant uppercase"
            style={{ fontSize: 11, letterSpacing: 3 }}
          >
            Mes commandes
          </Text>
          <Text
            className="text-on-surface"
            style={{
              fontFamily: "PlusJakartaSans_800ExtraBold_Italic",
              fontSize: 44,
              lineHeight: 48,
              letterSpacing: -1.5,
              marginTop: 4,
            }}
          >
            Historique
          </Text>
        </View>
        <OrdersEmpty />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={{ paddingHorizontal: 24, paddingTop: 16 }}>
        <Text
          className="font-sans-semibold text-on-surface-variant uppercase"
          style={{ fontSize: 11, letterSpacing: 3 }}
        >
          Mes commandes
        </Text>
        <Text
          className="text-on-surface"
          style={{
            fontFamily: "PlusJakartaSans_800ExtraBold_Italic",
            fontSize: 44,
            lineHeight: 48,
            letterSpacing: -1.5,
            marginTop: 4,
          }}
        >
          Historique
        </Text>
      </View>

      {active !== null ? (
        <View style={{ marginTop: 24 }}>
          <ActiveOrderCard order={active} />
        </View>
      ) : null}

      {history.length > 0 ? (
        <View style={{ marginTop: 32 }}>
          <Text
            className="font-sans-bold text-on-surface-variant uppercase"
            style={{
              fontSize: 10,
              letterSpacing: 2,
              paddingHorizontal: 24,
              marginBottom: 16,
            }}
          >
            Commandes passées
          </Text>
          <View style={{ gap: 16 }}>
            {history.map((order) => (
              <PastOrderRow
                key={order.id}
                order={order}
                onReorder={() => handleReorder(order)}
              />
            ))}
          </View>
        </View>
      ) : null}

      <View
        className="items-center"
        style={{ paddingHorizontal: 24, marginTop: 32 }}
      >
        <View
          style={{
            width: 32,
            height: 2,
            backgroundColor: colors.editorialRule,
            marginBottom: 16,
          }}
        />
        <Text
          className="font-sans-semibold text-on-surface-variant uppercase"
          style={{ fontSize: 10, letterSpacing: 3, textAlign: "center" }}
        >
          Pop&apos;s Villepinte · Fait maison
        </Text>
      </View>
    </Screen>
  );
}
