import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import Animated, { LinearTransition } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import IconButton from "@/components/common/IconButton";
import Toast from "@/components/common/Toast";
import CartEmpty from "@/components/cart/CartEmpty";
import CartItemRow from "@/components/cart/CartItemRow";
import CartSuggestionCard from "@/components/cart/CartSuggestionCard";
import CartTotals from "@/components/cart/CartTotals";
import { colors } from "@/constants/theme";
import { PRODUCTS } from "@/data/menu";
import { formatPriceEUR } from "@/lib/format";
import { useCartStore } from "@/store/cart.store";

const SUGGESTIONS_MAX = 6;

export default function CartScreen(): React.ReactElement {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.totalEUR());

  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");

  const itemCount = useMemo(
    () => items.reduce((acc, i) => acc + i.quantity, 0),
    [items],
  );

  const suggestions = useMemo(() => {
    const inCart = new Set(items.map((i) => i.productId));
    const pool = PRODUCTS.filter((p) => !inCart.has(p.id));
    const drinks = pool.filter((p) => p.categoryId === "boissons");
    const rest = pool.filter((p) => p.categoryId !== "boissons");
    return [...drinks, ...rest].slice(0, SUGGESTIONS_MAX);
  }, [items]);

  const handleItemDeleted = (productName: string): void => {
    setToastMessage(`${productName} retiré du panier`);
    setToastVisible(true);
  };

  const handleValidate = (): void => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push("/checkout");
  };

  if (items.length === 0) {
    return (
      <View className="flex-1 bg-surface" style={{ paddingTop: insets.top + 8 }}>
        <View
          className="flex-row items-center justify-between"
          style={{ paddingHorizontal: 24, paddingBottom: 8 }}
        >
          <IconButton
            icon={ArrowLeft}
            variant="light"
            onPress={() => router.back()}
            accessibilityLabel="Retour"
          />
          <Text
            className="font-sans-semibold text-on-surface-variant uppercase"
            style={{ fontSize: 11, letterSpacing: 3 }}
          >
            Panier
          </Text>
          <View style={{ width: 44 }} />
        </View>
        <CartEmpty />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 160 }}
      >
        <View
          className="flex-row items-center justify-between"
          style={{ paddingHorizontal: 24 }}
        >
          <IconButton
            icon={ArrowLeft}
            variant="light"
            onPress={() => router.back()}
            accessibilityLabel="Retour"
          />
          <Text
            className="font-sans-semibold text-on-surface-variant uppercase"
            style={{ fontSize: 11, letterSpacing: 3 }}
          >
            Panier
          </Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
          <Text
            className="text-on-surface"
            style={{
              fontFamily: "BebasNeue_400Regular",
              fontSize: 44,
              lineHeight: 48,
              letterSpacing: -1.5,
            }}
          >
            Votre commande
          </Text>
          <Text
            className="font-sans text-on-surface-variant"
            style={{ fontSize: 13, marginTop: 8 }}
          >
            {itemCount} article{itemCount > 1 ? "s" : ""} · prêt dans quelques
            minutes
          </Text>
        </View>

        <Animated.View
          layout={LinearTransition.duration(220)}
          style={{ marginTop: 24 }}
        >
          {items.map((item, idx) => (
            <View
              key={item.id}
              className={
                idx % 2 === 1 ? "bg-surface-container-low" : "bg-surface"
              }
            >
              <CartItemRow
                item={item}
                index={idx}
                onDeleted={handleItemDeleted}
              />
            </View>
          ))}
        </Animated.View>

        {suggestions.length > 0 ? (
          <View style={{ marginTop: 32 }}>
            <View style={{ paddingHorizontal: 24, marginBottom: 16 }}>
              <Text
                className="font-sans-semibold text-on-surface-variant uppercase"
                style={{ fontSize: 11, letterSpacing: 3 }}
              >
                Et pour accompagner ?
              </Text>
              <Text
                className="text-on-surface"
                style={{
                  fontFamily: "BebasNeue_400Regular",
                  fontSize: 22,
                  letterSpacing: -0.5,
                  marginTop: 4,
                }}
              >
                Notre conseil
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
            >
              {suggestions.map((p) => (
                <CartSuggestionCard key={p.id} product={p} />
              ))}
            </ScrollView>
          </View>
        ) : null}

        <CartTotals subtotal={total} />

        <View
          className="items-center"
          style={{ paddingHorizontal: 24, marginTop: 32 }}
        >
          <View
            style={{
              width: 32,
              height: 2,
              backgroundColor: colors.border,
              marginBottom: 16,
            }}
          />
          <Text
            className="font-sans-semibold text-on-surface-variant uppercase"
            style={{ fontSize: 10, letterSpacing: 3, textAlign: "center" }}
          >
            Retrait sur place · Villepinte
          </Text>
        </View>
      </ScrollView>

      {/* STICKY CTA */}
      <View
        className="bg-surface"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: Math.max(insets.bottom, 16) + 8,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Valider la commande pour ${formatPriceEUR(total)}`}
          onPress={handleValidate}
          className="bg-primary flex-row items-center justify-between rounded-full"
          style={{
            paddingHorizontal: 24,
            paddingVertical: 18,
            shadowColor: colors.ink,
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.08,
            shadowRadius: 24,
            elevation: 8,
          }}
        >
          <View>
            <Text
              className="uppercase"
              style={{
                fontFamily: "Poppins_700Bold",
                fontSize: 10,
                letterSpacing: 2,
                color: "rgba(253,249,238,0.7)",
              }}
            >
              Total
            </Text>
            <Text
              style={{
                fontFamily: "BebasNeue_400Regular",
                fontSize: 22,
                color: colors.surface,
                marginTop: 2,
              }}
            >
              {formatPriceEUR(total)}
            </Text>
          </View>
          <View
            className="bg-surface flex-row items-center rounded-full"
            style={{ paddingHorizontal: 18, paddingVertical: 10, gap: 8 }}
          >
            <Text
              className="text-primary uppercase"
              style={{
                fontFamily: "Poppins_700Bold",
                fontSize: 12,
                letterSpacing: 2,
              }}
            >
              Valider
            </Text>
          </View>
        </Pressable>
      </View>

      <Toast
        visible={toastVisible}
        message={toastMessage}
        onHide={() => setToastVisible(false)}
        duration={2000}
      />
    </View>
  );
}
