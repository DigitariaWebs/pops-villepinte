import { useMemo } from "react";
import { Text, View } from "react-native";

import { PRODUCTS_BY_ID, SUPPLEMENTS_BY_ID } from "@/data/menu";
import { formatPriceEUR } from "@/lib/format";
import { getLineUnitPrice } from "@/store/cart.store";
import type { CartItem } from "@/types";

export type OrderRecapProps = {
  items: CartItem[];
  total: number;
};

function RecapLine({ item }: { item: CartItem }): React.ReactElement | null {
  const product = PRODUCTS_BY_ID[item.productId];
  if (!product) return null;

  const variant =
    item.variantId !== undefined
      ? product.variants?.find((v) => v.id === item.variantId)
      : undefined;

  const unitPrice = getLineUnitPrice(item);
  const lineTotal = unitPrice * item.quantity;

  const supplementNames = useMemo(() => {
    if (item.supplements.length === 0) return null;
    return item.supplements
      .map((sid) => SUPPLEMENTS_BY_ID[sid]?.name)
      .filter((n): n is string => n !== undefined)
      .join(", ");
  }, [item.supplements]);

  const nameLabel = `${item.quantity}× ${product.name}${
    variant !== undefined ? ` · ${variant.label}` : ""
  }`;

  return (
    <View
      className="flex-row items-start justify-between"
      style={{ paddingVertical: 6 }}
    >
      <View style={{ flex: 1, paddingRight: 16 }}>
        <Text
          numberOfLines={2}
          className="font-sans-semibold text-on-surface"
          style={{ fontSize: 13 }}
        >
          {nameLabel}
        </Text>
        {supplementNames !== null ? (
          <Text
            numberOfLines={1}
            className="font-sans text-on-surface-variant"
            style={{ fontSize: 11, marginTop: 2 }}
          >
            {supplementNames}
          </Text>
        ) : null}
      </View>
      <Text
        className="font-sans-bold text-on-surface"
        style={{ fontSize: 13 }}
      >
        {formatPriceEUR(lineTotal)}
      </Text>
    </View>
  );
}

export default function OrderRecap({
  items,
  total,
}: OrderRecapProps): React.ReactElement {
  return (
    <View
      className="bg-surface-container-low rounded-xl"
      style={{
        marginHorizontal: 24,
        paddingHorizontal: 28,
        paddingVertical: 24,
      }}
    >
      <Text
        className="font-sans-bold text-on-surface-variant uppercase"
        style={{ fontSize: 10, letterSpacing: 2, marginBottom: 16 }}
      >
        Votre commande
      </Text>

      {items.map((item) => (
        <RecapLine key={item.id} item={item} />
      ))}

      <View style={{ height: 16 }} />

      <View className="flex-row items-baseline justify-between">
        <Text
          className="text-on-surface"
          style={{
            fontFamily: "Poppins_700Bold",
            fontSize: 14,
          }}
        >
          Total
        </Text>
        <Text
          className="text-primary"
          style={{
            fontFamily: "BebasNeue_400Regular",
            fontSize: 28,
            letterSpacing: -1,
          }}
        >
          {formatPriceEUR(total)}
        </Text>
      </View>
    </View>
  );
}
