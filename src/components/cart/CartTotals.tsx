import { Text, View } from "react-native";

import { formatPriceEUR } from "@/lib/format";

export type CartTotalsProps = {
  subtotal: number;
};

export default function CartTotals({
  subtotal,
}: CartTotalsProps): React.ReactElement {
  return (
    <View
      className="bg-surface-container-low rounded-xl"
      style={{
        marginHorizontal: 24,
        marginTop: 32,
        paddingHorizontal: 28,
        paddingVertical: 28,
      }}
    >
      <Text
        className="font-sans-bold text-on-surface-variant uppercase"
        style={{ fontSize: 10, letterSpacing: 3, marginBottom: 12 }}
      >
        Le compte
      </Text>

      <View
        className="flex-row items-center justify-between"
        style={{ marginBottom: 8 }}
      >
        <Text
          className="font-sans text-on-surface-variant"
          style={{ fontSize: 14 }}
        >
          Sous-total
        </Text>
        <Text
          className="font-sans-semibold text-on-surface"
          style={{ fontSize: 15 }}
        >
          {formatPriceEUR(subtotal)}
        </Text>
      </View>

      <View className="flex-row items-center justify-between">
        <Text
          className="font-sans text-on-surface-variant"
          style={{ fontSize: 14 }}
        >
          Frais de préparation
        </Text>
        <Text
          className="font-sans-semibold text-success"
          style={{ fontSize: 15 }}
        >
          Offerts
        </Text>
      </View>

      <View style={{ height: 16 }} />

      <View className="flex-row items-baseline justify-between">
        <Text
          className="text-on-surface"
          style={{
            fontFamily: "PlusJakartaSans_800ExtraBold",
            fontSize: 16,
          }}
        >
          Total
        </Text>
        <Text
          className="text-primary"
          style={{
            fontFamily: "PlusJakartaSans_800ExtraBold_Italic",
            fontSize: 36,
            letterSpacing: -1,
          }}
        >
          {formatPriceEUR(subtotal)}
        </Text>
      </View>
    </View>
  );
}
